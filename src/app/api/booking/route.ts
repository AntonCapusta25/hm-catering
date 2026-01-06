import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

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
      message
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

    // Store in Supabase - NEW catering_bookings table
    const { data, error: dbError } = await supabaseAdmin
      .from('catering_bookings')
      .insert([
        {
          client_name: name,
          client_email: email,
          selected_package: selectedMenu || null,
          cuisine_preference: cuisine || null,
          event_date: eventDate || null,
          guest_count: guests ? parseInt(guests.replace(/\D/g, '')) : null,
          special_requests: message || null,
          booking_status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save booking' },
        { status: 500 }
      )
    }

    // Brand colors for Homemade Catering
    const COLORS = {
      cream: '#FDFBF7',
      dark: '#2D2420',
      orange: '#F27D42',
      orangeLight: '#FF9F6D'
    };

    // Send admin notification email
    const adminEmail = {
      to: process.env.SENDGRID_TO_EMAIL!,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: `🎉 New Catering Request: ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Arial', sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, ${COLORS.orange} 0%, ${COLORS.orangeLight} 100%); color: #ffffff; padding: 30px; text-align: center; }
  .content { padding: 30px; }
  .detail-row { padding: 12px 0; border-bottom: 1px solid #eee; }
  .detail-label { font-weight: bold; color: ${COLORS.dark}; display: inline-block; width: 140px; }
  .detail-value { color: #555; }
  .footer { background-color: ${COLORS.dark}; color: #999; padding: 20px; text-align: center; font-size: 12px; }
  .badge { display: inline-block; background-color: #4CAF50; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">New Catering Request</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Homemade Catering</p>
    </div>
    
    <div class="content">
      <div style="margin-bottom: 20px;">
        <span class="badge">New Booking</span>
      </div>
      
      <h2 style="color: ${COLORS.dark}; margin-top: 0;">Client Information</h2>
      <div class="detail-row">
        <span class="detail-label">Name:</span>
        <span class="detail-value">${name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span class="detail-value"><a href="mailto:${email}" style="color: ${COLORS.orange};">${email}</a></span>
      </div>
      
      <h2 style="color: ${COLORS.dark}; margin-top: 30px;">Event Details</h2>
      <div class="detail-row">
        <span class="detail-label">Package:</span>
        <span class="detail-value">${selectedMenu || 'Custom Package'}</span>
      </div>
      ${selectedChef ? `
      <div class="detail-row">
        <span class="detail-label">Preferred Chef:</span>
        <span class="detail-value">${selectedChef}</span>
      </div>
      ` : ''}
      <div class="detail-row">
        <span class="detail-label">Cuisine:</span>
        <span class="detail-value">${cuisine || 'Not specified'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Event Date:</span>
        <span class="detail-value">${eventDate || 'Not specified'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Guest Count:</span>
        <span class="detail-value">${guests || 'Not specified'}</span>
      </div>
      
      ${message ? `
      <h2 style="color: ${COLORS.dark}; margin-top: 30px;">Special Requests</h2>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid ${COLORS.orange};">
        <p style="margin: 0; white-space: pre-wrap; color: #555;">${message}</p>
      </div>
      ` : ''}
      
      <p style="margin-top: 30px; font-size: 12px; color: #999;">
        Submitted: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Homemade Catering. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    // Send client confirmation email
    const clientEmail = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: "Your Catering Request Received! 🎉",
      html: `
<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
  body { margin: 0; padding: 0; background-color: ${COLORS.cream}; font-family: 'Inter', sans-serif; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
  .header { background: linear-gradient(135deg, ${COLORS.dark} 0%, #3a3330 100%); color: #ffffff; padding: 50px 30px; text-align: center; }
  .logo-text { font-size: 36px; font-weight: 700; margin: 0; letter-spacing: -1px; }
  .tagline { font-size: 14px; letter-spacing: 3px; text-transform: uppercase; opacity: 0.8; margin-top: 10px; }
  .content { padding: 40px 30px; }
  .greeting { font-size: 24px; font-weight: 600; color: ${COLORS.dark}; margin-top: 0; }
  .text { line-height: 1.8; color: #555; font-size: 15px; }
  .details-box { background: linear-gradient(to right, ${COLORS.cream}, #ffffff); padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid ${COLORS.orange}; }
  .detail-item { padding: 8px 0; font-size: 14px; }
  .detail-label { font-weight: 600; color: ${COLORS.dark}; }
  .detail-value { color: #666; }
  .cta-button { display: inline-block; background: linear-gradient(135deg, ${COLORS.orange} 0%, ${COLORS.orangeLight} 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; font-weight: 600; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; box-shadow: 0 4px 15px rgba(242, 125, 66, 0.3); }
  .cta-button:hover { box-shadow: 0 6px 20px rgba(242, 125, 66, 0.4); }
  .footer { background-color: ${COLORS.dark}; color: #999; padding: 30px; text-align: center; font-size: 13px; }
  .footer a { color: ${COLORS.orange}; text-decoration: none; }
  .divider { height: 1px; background: linear-gradient(to right, transparent, #ddd, transparent); margin: 30px 0; }
</style>
</head>
<body>
  <div class="container">
    
    <!-- Header -->
    <div class="header">
      <h1 class="logo-text">Homemade Catering</h1>
      <p class="tagline">Premium Event Catering</p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <h2 class="greeting">Hi ${name.split(' ')[0]}! 👋</h2>
      
      <p class="text">
        Thank you for choosing <strong>Homemade Catering</strong> for your upcoming event. 
        We're thrilled to have the opportunity to make your celebration truly special!
      </p>

      <p class="text">
        We've received your catering request${selectedMenu ? ` for our <strong>${selectedMenu}</strong> package` : ''}, 
        and our team is already reviewing the details.
      </p>

      <!-- Event Details -->
      <div class="details-box">
        <h3 style="margin-top: 0; color: ${COLORS.dark}; font-size: 16px;">Your Event Details</h3>
        ${selectedMenu ? `<div class="detail-item"><span class="detail-label">Package:</span> <span class="detail-value">${selectedMenu}</span></div>` : ''}
        ${selectedChef ? `<div class="detail-item"><span class="detail-label">Chef:</span> <span class="detail-value">${selectedChef}</span></div>` : ''}
        ${cuisine ? `<div class="detail-item"><span class="detail-label">Cuisine:</span> <span class="detail-value">${cuisine}</span></div>` : ''}
        ${eventDate ? `<div class="detail-item"><span class="detail-label">Event Date:</span> <span class="detail-value">${eventDate}</span></div>` : ''}
        ${guests ? `<div class="detail-item"><span class="detail-label">Guests:</span> <span class="detail-value">${guests}</span></div>` : ''}
      </div>

      <div class="divider"></div>

      <h3 style="color: ${COLORS.dark}; font-size: 18px;">What Happens Next?</h3>
      <p class="text">
        Our catering specialists will review your requirements and reach out within <strong>24-48 hours</strong> to:
      </p>
      <ul class="text" style="line-height: 2;">
        <li>Discuss your event vision and preferences</li>
        <li>Customize your menu to perfection</li>
        <li>Provide a detailed quote</li>
        <li>Answer any questions you may have</li>
      </ul>

      <p class="text">
        Want to discuss your event right away? Schedule a call with our team:
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 35px 0;">
        <a href="https://calendly.com/homemademeals-info/interview-with-homemade" class="cta-button">Schedule a Call</a>
      </div>
      
      <p class="text" style="text-align: center; font-style: italic; color: #888; margin-top: 40px;">
        We can't wait to bring your event to life! 🎉
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #ccc;">Homemade Catering</p>
      <p style="margin: 5px 0;">Premium Event Catering Services</p>
      <p style="margin: 15px 0 5px 0;">
        <a href="https://www.homemademeals.net">www.homemademeals.net</a>
      </p>
      <p style="margin: 20px 0 0 0; font-size: 11px; color: #777;">
        &copy; ${new Date().getFullYear()} Homemade Catering. All rights reserved.
      </p>
    </div>

  </div>
</body>
</html>
      `,
    };

    try {
      // Send both emails
      await sgMail.send(adminEmail);
      await sgMail.send(clientEmail);
    } catch (emailError: any) {
      console.error('SendGrid error:', emailError)
      // Don't fail the request if email fails, booking is already saved
      return NextResponse.json(
        {
          success: true,
          warning: 'Booking saved but email notification failed',
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Catering request received!' },
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
