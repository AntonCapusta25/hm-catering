import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const HYPERZOD_API_KEY = Deno.env.get('HYPERZOD_API_KEY') || '';
const HYPERZOD_TENANT_ID = Deno.env.get('HYPERZOD_TENANT_ID') || '3331';
const HYPERZOD_BASE_URL = Deno.env.get('HYPERZOD_BASE_URL') || 'https://api.hyperzod.app';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Category {
    id: string;
    name: string;
    products: Product[];
}

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    available: boolean;
}

interface MerchantMenu {
    merchant: {
        id: string;
        name: string;
        address: string;
        cuisine: string;
        url: string;
    };
    categories: Category[];
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { merchantId } = await req.json();

        if (!merchantId) {
            throw new Error("merchantId is required");
        }

        console.log(`🍽️ Fetching menu for merchant: ${merchantId}`);

        if (!HYPERZOD_API_KEY) {
            throw new Error("HYPERZOD_API_KEY is not configured");
        }

        const url = `${HYPERZOD_BASE_URL}/merchant/v1/catalog/product/list?merchant_id=${merchantId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-TENANT': HYPERZOD_TENANT_ID,
                'X-API-KEY': HYPERZOD_API_KEY,
            },
        });

        if (!response.ok) {
            const text = await response.text();
            console.error(`❌ Hyperzod API error: ${response.status}`, text.substring(0, 200));
            throw new Error(`Hyperzod API error: ${response.status}`);
        }

        const data = await response.json();

        // Organize products by category
        const categoriesMap = new Map<string, Category>();
        const products = data.data?.data || [];

        products.forEach((product: any) => {
            const categoryId = product.product_category?.[0] || 'uncategorized';
            const categoryName = product.category_name || 'Other';

            if (!categoriesMap.has(categoryId)) {
                categoriesMap.set(categoryId, {
                    id: categoryId,
                    name: categoryName,
                    products: []
                });
            }

            categoriesMap.get(categoryId)!.products.push({
                id: product._id || product.id || product.product_id,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.product_images?.[0]?.file_url || product.images?.[0]?.image_url || product.image_url,
                available: product.is_available !== false
            });
        });

        const categories = Array.from(categoriesMap.values());

        console.log(`✅ Menu loaded: ${products.length} products in ${categories.length} categories`);

        const result: MerchantMenu = {
            merchant: {
                id: merchantId,
                name: data.merchant_name || 'Restaurant',
                address: data.merchant_address || '',
                cuisine: data.merchant_cuisine || '',
                url: `https://www.homemademeals.net/en/m/${data.merchant_slug || 'restaurant'}/${merchantId}`
            },
            categories
        };

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
