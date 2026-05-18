import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function GET(request: NextRequest) {
  try {
    // Check for a secret to prevent unauthorized access
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    if (secret !== 'homemade-resync-2024') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch bookings from the last 30 days that are NOT partial
    const { data: bookings, error: dbError } = await supabaseAdmin
      .from('booking_submissions')
      .select('*')
      .gte('updated_at', thirtyDaysAgo)
      .not('message', 'ilike', '%[PARTIAL LEAD]%')
      .order('updated_at', { ascending: false })

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ message: 'No complete bookings found for the last month', count: 0 })
    }

    const COLORS = {
      cream: '#FDFBF7',
      dark: '#2D2420',
      orange: '#F27D42',
      orangeLight: '#FF9F6D'
    };

    const employees = [
      'khaylanlalla35@gmail.com',
      'walid_sabihi@outlook.com'
    ];

    const results = []

    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i]
      
      // Determine assigned employee (simplified for bulk)
      const assignedEmployee = employees[i % employees.length]
      const assignedName = assignedEmployee.includes('khaylan') ? 'Khaylan' : 'Walid'

      const subject = `🔄 [RESYNC] Private Chef Request: ${booking.name}`

      const adminEmail = {
        to: [
          process.env.SENDGRID_TO_EMAIL!, 
          'mahmoudelwakil22@gmail.com',
          assignedEmployee
        ],
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: subject,
        html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Arial', sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); color: #ffffff; padding: 30px; text-align: center; }
  .content { padding: 30px; }
  .detail-row { padding: 12px 0; border-bottom: 1px solid #eee; }
  .detail-label { font-weight: bold; color: ${COLORS.dark}; display: inline-block; width: 140px; }
  .detail-value { color: #555; }
  .footer { background-color: ${COLORS.dark}; color: #999; padding: 20px; text-align: center; font-size: 12px; }
  .badge { display: inline-block; background-color: #3b82f6; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">Resynced Booking</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Homemade Private Chefs</p>
    </div>
    
    <div class="content">
      <div style="margin-bottom: 20px; display: flex; gap: 10px;">
        <span class="badge">Complete Submission (Resync)</span>
        <span class="badge" style="background-color: ${COLORS.orange};">Assigned to: ${assignedName}</span>
      </div>
      
      <h2 style="color: ${COLORS.dark}; margin-top: 0;">Client Information</h2>
      <div class="detail-row">
        <span class="detail-label">Name:</span>
        <span class="detail-value">${booking.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${booking.email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone:</span>
        <span class="detail-value">${booking.phone || 'N/A'}</span>
      </div>
      
      <h2 style="color: ${COLORS.dark}; margin-top: 30px;">Event Details</h2>
      <div class="detail-row">
        <span class="detail-label">Package:</span>
        <span class="detail-value">${booking.selected_menu || 'Custom Package'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Cuisine:</span>
        <span class="detail-value">${booking.cuisine || 'Not specified'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Event Date:</span>
        <span class="detail-value">${booking.event_date || 'Not specified'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Guest Count:</span>
        <span class="detail-value">${booking.guests || 'Not specified'}</span>
      </div>
      
      ${booking.message ? `
      <h2 style="color: ${COLORS.dark}; margin-top: 30px;">Details & Special Requests</h2>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid ${COLORS.orange};">
        <p style="margin: 0; white-space: pre-wrap; color: #555;">${booking.message}</p>
      </div>
      ` : ''}
      
      <p style="margin-top: 30px; font-size: 12px; color: #999;">
        Original Update: ${new Date(booking.updated_at).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
      </p>
    </div>
  </div>
</body>
</html>
        `,
      }

      try {
        await sgMail.send(adminEmail)
        results.push({ id: booking.id, name: booking.name, status: 'sent' })
      } catch (err) {
        results.push({ id: booking.id, name: booking.name, status: 'failed', error: err })
      }
    }

    return NextResponse.json({ 
        message: `Successfully processed ${results.length} bookings`, 
        results 
    })

  } catch (error) {
    console.error('Error in resync:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
