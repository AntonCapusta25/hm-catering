import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { processPendingBookingEmails } from '@/lib/bookingEmailService'

export async function POST(request: NextRequest) {
  // Debug logging for Vercel
  console.log('Environment check:', {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasSendGridKey: !!process.env.SENDGRID_API_KEY,
    supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
  });

  try {
    const body = await request.json()
    const {
      name,
      email,
      selectedMenu,
      selectedChef,
      cuisine,
      eventDate,
      guests,
      message,
      phone,
      id,
      isPartial
    } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Format message tag:
    // If isPartial: tag with [PARTIAL LEAD]
    // If full submission (!isPartial): clean any [PARTIAL LEAD] or [EMAIL_SENT] tag so the 5-minute timer can process the complete submission!
    let formattedMessage = message || '';
    if (isPartial) {
      if (!formattedMessage.includes('[PARTIAL LEAD]')) {
        formattedMessage = `[PARTIAL LEAD] ${formattedMessage}`.trim();
      }
    } else {
      formattedMessage = formattedMessage
        .replace(/\[PARTIAL LEAD\]/g, '')
        .replace(/\[PROCESSING_EMAIL\]/g, '')
        .replace(/\[EMAIL_SENT\]/g, '')
        .trim();
    }

    const submissionData = {
      name: name,
      email: email,
      selected_menu: selectedMenu || null,
      selected_chef: selectedChef || null,
      cuisine: cuisine || null,
      event_date: eventDate || null,
      guests: guests || null,
      message: formattedMessage || null,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (id) {
      // Update existing submission
      result = await supabaseAdmin
        .from('booking_submissions')
        .update(submissionData)
        .eq('id', id)
        .select()
    } else {
      // Create new submission
      result = await supabaseAdmin
        .from('booking_submissions')
        .insert([submissionData])
        .select()
    }

    const { data, error: dbError } = result;

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save booking' },
        { status: 500 }
      )
    }

    // Trigger background processing for any pending emails older than 5 minutes
    processPendingBookingEmails().catch(err => {
      console.error('Background processPendingBookingEmails error:', err);
    });

    // Data is preserved immediately in database. Emails are sent ONCE 5 minutes after creation/update.
    return NextResponse.json(
      { 
        success: true, 
        message: isPartial ? 'Partial lead saved' : 'Private chef request received!',
        id: data?.[0]?.id 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
