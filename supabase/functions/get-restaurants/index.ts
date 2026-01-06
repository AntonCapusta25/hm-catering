import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const HYPERZOD_API_KEY = Deno.env.get('HYPERZOD_API_KEY') || '';
const HYPERZOD_TENANT_ID = Deno.env.get('HYPERZOD_TENANT_ID') || '3331';
const HYPERZOD_BASE_URL = Deno.env.get('HYPERZOD_BASE_URL') || 'https://api.hyperzod.app';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchParams {
    city?: string;
    cuisine?: string;
    priceRange?: string;
    limit?: number;
}

interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    priceRange: string;
    image: string;
    address: string;
    url: string;
    description?: string;
    hours?: string;
    logo?: string;
    phone?: string;
    deliveryFee?: string;
    categories?: string[];
}

function mapMerchantToRestaurant(merchant: any): Restaurant {
    const name = merchant.name || merchant.business_name || "Unknown Restaurant";

    // Extract images - prefer cover image, fallback to logo
    const coverImage = merchant.images?.cover?.image_url || merchant.images?.cover?.image_thumb_url;
    const logoImage = merchant.images?.logo?.image_url || merchant.images?.logo?.image_thumb_url;
    const image = coverImage || logoImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop";

    // Extract rating - use average_rating if available
    const rating = merchant.average_rating > 0 ? merchant.average_rating : 4.5;

    // Calculate price range based on min_order_amount
    let priceRange = "mid-range";
    if (merchant.min_order_amount) {
        if (merchant.min_order_amount < 15) priceRange = "budget";
        else if (merchant.min_order_amount > 30) priceRange = "premium";
    }

    // Generate safe URL slug
    const slug = merchant.slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    return {
        id: String(merchant._id || merchant.merchant_id || merchant.id),
        name: name,
        cuisine: merchant.category_name || (merchant.categories && merchant.categories[0]?.name) || "Food",
        rating: rating,
        priceRange: priceRange,
        image: image,
        logo: logoImage,
        address: merchant.address || "Address not available",
        url: `https://www.homemademeals.net/en/m/${slug}/${merchant._id || merchant.merchant_id}`,
        description: merchant.description || `Experience delicious food at ${name}.`,
        phone: merchant.phone || merchant.owner_phone,
        hours: merchant.business_hours || "10:00 AM - 10:00 PM",
        deliveryFee: merchant.delivery_amount || 0,
        categories: merchant.merchant_category_ids || [],
    };
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { city, cuisine, priceRange, limit } = await req.json() as SearchParams;

        console.log(`🔍 Searching restaurants with params:`, { city, cuisine, priceRange, limit });

        if (!HYPERZOD_API_KEY) {
            throw new Error("HYPERZOD_API_KEY is not configured");
        }

        const baseUrl = new URL(`${HYPERZOD_BASE_URL}/admin/v1/merchant/list`);
        let allMerchants: any[] = [];
        let currentPage = 1;
        let lastPage = 1;

        // Fetch all pages
        do {
            const url = new URL(baseUrl.toString());
            url.searchParams.set("page", currentPage.toString());

            console.log(`   Fetching page ${currentPage}...`);
            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-TENANT": HYPERZOD_TENANT_ID,
                    "X-API-KEY": HYPERZOD_API_KEY,
                },
            });

            if (!response.ok) {
                const text = await response.text();
                console.error(`❌ Hyperzod API error: ${response.status}`, text.substring(0, 200));
                throw new Error(`Hyperzod API error: ${response.status}`);
            }

            const responseData = await response.json();
            console.log(`   Page ${currentPage} response:`, {
                success: responseData.success,
                dataLength: responseData.data?.data?.length || 0,
                lastPage: responseData.data?.last_page || 1
            });

            if (responseData.success && responseData.data) {
                lastPage = responseData.data.last_page || 1;
                if (Array.isArray(responseData.data.data)) {
                    allMerchants = allMerchants.concat(responseData.data.data);
                }
            }

            currentPage++;
        } while (currentPage <= lastPage);

        console.log(`🍽️ Total: ${allMerchants.length} merchants`);
        let merchants = allMerchants;

        // Filter for published/active merchants only
        merchants = merchants.filter((m: any) => m.status === true);
        console.log(`✅ Published merchants: ${merchants.length}`);

        // Filter by city
        if (city) {
            const cityLower = city.toLowerCase();
            merchants = merchants.filter((m: any) => {
                const haystack = [
                    m.city,
                    m.address,
                    m.business_address,
                    m.location?.address,
                    m.area_name,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                return haystack.includes(cityLower);
            });
            console.log(`📍 ${city}: ${merchants.length} merchants`);
        }

        // Apply limit if specified
        if (limit && limit > 0) {
            merchants = merchants.slice(0, limit);
        }

        const result = merchants.map((m: any) => mapMerchantToRestaurant(m));
        console.log(`✅ Returning ${result.length} restaurants`);

        return new Response(
            JSON.stringify(result),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            },
        )
    } catch (error) {
        console.error("❌ Error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            },
        )
    }
})
