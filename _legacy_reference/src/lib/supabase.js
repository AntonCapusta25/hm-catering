import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Helper function to submit booking
export const submitBooking = async (bookingData) => {
    const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()

    if (error) throw error
    return data
}

// Helper function to submit chef application
export const submitChefApplication = async (chefData) => {
    const { data, error } = await supabase
        .from('christmas_chefs')
        .insert([chefData])
        .select()

    if (error) throw error
    return data
}

// Helper function to get menu items
export const getMenuItems = async () => {
    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

// Helper function to get cuisines
export const getCuisines = async () => {
    const { data, error } = await supabase
        .from('cuisines')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

// Helper function to upload image to Supabase Storage
export const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file)

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

    return publicUrl
}
