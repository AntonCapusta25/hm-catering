// Test script to verify Supabase connection and catering_bookings table
import { supabaseAdmin } from './src/lib/supabase.js';

async function testDatabaseConnection() {
    console.log('🔍 Testing Supabase connection...\n');

    // Test 1: Check environment variables
    console.log('1️⃣ Environment Variables:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    console.log('');

    // Test 2: Try to query the catering_bookings table
    console.log('2️⃣ Testing catering_bookings table access:');
    try {
        const { data, error, count } = await supabaseAdmin
            .from('catering_bookings')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log('   ❌ Error accessing table:', error.message);
            console.log('   Error details:', JSON.stringify(error, null, 2));
        } else {
            console.log('   ✅ Table exists and is accessible');
            console.log('   📊 Current record count:', count);
        }
    } catch (err) {
        console.log('   ❌ Exception:', err.message);
    }
    console.log('');

    // Test 3: Try to insert a test record
    console.log('3️⃣ Testing insert operation:');
    try {
        const testData = {
            client_name: 'Test User',
            client_email: 'test@example.com',
            selected_package: 'Test Package',
            cuisine_preference: 'Italian',
            event_date: '2026-02-01',
            guest_count: 10,
            special_requests: 'This is a test booking',
            booking_status: 'pending',
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabaseAdmin
            .from('catering_bookings')
            .insert([testData])
            .select();

        if (error) {
            console.log('   ❌ Insert failed:', error.message);
            console.log('   Error details:', JSON.stringify(error, null, 2));
        } else {
            console.log('   ✅ Test record inserted successfully!');
            console.log('   Record ID:', data[0]?.id);

            // Clean up test record
            if (data[0]?.id) {
                await supabaseAdmin
                    .from('catering_bookings')
                    .delete()
                    .eq('id', data[0].id);
                console.log('   🧹 Test record cleaned up');
            }
        }
    } catch (err) {
        console.log('   ❌ Exception:', err.message);
    }
    console.log('');

    console.log('✅ Test complete!');
}

testDatabaseConnection().catch(console.error);
