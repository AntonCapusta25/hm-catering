import { supabase } from './supabase';

export interface Restaurant {
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

export interface Category {
    id: string;
    name: string;
    products: Product[];
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    available: boolean;
}

export interface MerchantMenu {
    merchant: {
        id: string;
        name: string;
        address: string;
        cuisine: string;
        url: string;
    };
    categories: Category[];
}

export interface SearchParams {
    city?: string;
    cuisine?: string;
    priceRange?: string;
    limit?: number;
}

/**
 * Search for restaurants using Supabase Edge Function
 */
export async function searchRestaurants(params: SearchParams = {}): Promise<Restaurant[]> {
    try {
        console.log('🔍 Calling Supabase function: get-restaurants', params);

        const { data, error } = await supabase.functions.invoke('get-restaurants', {
            body: params
        });

        if (error) {
            console.error('❌ Supabase function error:', error);
            throw error;
        }

        console.log(`✅ Received ${data?.length || 0} restaurants`);
        return data || [];
    } catch (error) {
        console.error('❌ Error fetching restaurants:', error);
        // Return empty array on error instead of throwing
        return [];
    }
}

/**
 * Get menu for a specific restaurant using Supabase Edge Function
 */
export async function getMerchantMenu(merchantId: string): Promise<MerchantMenu | null> {
    try {
        console.log('🍽️ Calling Supabase function: get-restaurant-menu', { merchantId });

        const { data, error } = await supabase.functions.invoke('get-restaurant-menu', {
            body: { merchantId }
        });

        if (error) {
            console.error('❌ Supabase function error:', error);
            throw error;
        }

        console.log(`✅ Received menu with ${data?.categories?.length || 0} categories`);
        return data;
    } catch (error) {
        console.error('❌ Error fetching menu:', error);
        return null;
    }
}
