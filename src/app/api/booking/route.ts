import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(request: NextRequest) {
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

        // Store in Supabase
        const { data, error: dbError } = await supabaseAdmin
            .from('booking_submissions')
            .insert([
                {
                    name,
                    email,
                    selected_menu: selectedMenu || null,
                    selected_chef: selectedChef || null,
                    cuisine: cuisine || null,
                    event_date: eventDate || null,
                    guests: guests || null,
                    message: message || null,
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

        // Brand colors
        const COLORS = {
            cream: '#FDFBF7',
            dark: '#111111',
            gold: '#D4AF37',
            goldLight: '#F2D06B',
            orange: '#F27D42'
        };

        // Send admin notification email
        const adminEmail = {
            to: process.env.SENDGRID_TO_EMAIL!,
            from: process.env.SENDGRID_FROM_EMAIL!,
            subject: `🎄 New Booking Request: ${name}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${COLORS.gold};">New Booking Request</h2>
          <p><strong>Client:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
          <p><strong>Menu:</strong> ${selectedMenu || 'Custom'}</p>
          <p><strong>Preferred Chef:</strong> ${selectedChef || 'Any'}</p>
          <p><strong>Cuisine Style:</strong> ${cuisine || 'Not specified'}</p>
          <p><strong>Event Date:</strong> ${eventDate || 'Not specified'}</p>
          <p><strong>Guests:</strong> ${guests || 'Not specified'}</p>
          ${message ? `
            <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          ` : ''}
          <p style="font-size: 12px; color: #888; margin-top: 20px;">Submitted: ${new Date().toLocaleString()}</p>
        </div>
      `,
        };

        // Send client confirmation email with "Savor the Magic" branding
        const clientEmail = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL!,
            subject: "Your Chef Booking Request Received! 🎄",
            html: `
<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;600;700&family=Inter:wght@300;400;600&display=swap');
  body { margin: 0; padding: 0; background-color: ${COLORS.cream}; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; font-family: 'Inter', sans-serif; color: ${COLORS.dark}; }
  .header { background-color: ${COLORS.dark}; color: #ffffff; padding: 40px 20px; text-align: center; background-image: linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)); }
  .gold-text { color: ${COLORS.gold}; }
  .content { padding: 40px 30px; }
  .heading-font { font-family: 'Fraunces', serif; }
  .btn { display: inline-block; background-color: ${COLORS.gold}; color: ${COLORS.dark}; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; }
  .btn:hover { background-color: ${COLORS.goldLight}; }
  .footer { background-color: ${COLORS.dark}; color: #888; padding: 20px; text-align: center; font-size: 12px; }
  .details-box { background-color: ${COLORS.cream}; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #eee; }
</style>
</head>
<body>
  <div class="container">
    
    <!-- Hero Header -->
    <div class="header">
      <h1 class="heading-font" style="font-size: 32px; margin: 0;">Savor the <span class="gold-text" style="font-style: italic;">Magic</span></h1>
      <p style="font-size: 14px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.8; margin-top: 10px;">Culinary Experience</p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <h2 class="heading-font" style="font-size: 24px; color: ${COLORS.dark}; margin-top: 0;">Hi ${name.split(' ')[0]},</h2>
      
      <p style="line-height: 1.6; color: #444;">
        Thank you for trusting <strong>Homemade</strong> with your dining experience. 
        We have received your booking request${selectedMenu ? ` for <strong>${selectedMenu}</strong>` : ''}.
      </p>

      <div class="details-box">
        ${selectedMenu ? `<p style="margin: 5px 0;"><strong>Menu:</strong> ${selectedMenu}</p>` : ''}
        ${selectedChef ? `<p style="margin: 5px 0;"><strong>Chef:</strong> ${selectedChef}</p>` : ''}
        ${cuisine ? `<p style="margin: 5px 0;"><strong>Cuisine:</strong> ${cuisine}</p>` : ''}
        ${eventDate ? `<p style="margin: 5px 0;"><strong>Event Date:</strong> ${eventDate}</p>` : ''}
        ${guests ? `<p style="margin: 5px 0;"><strong>Guests:</strong> ${guests}</p>` : ''}
      </div>

      <p style="line-height: 1.6; color: #444;">
        Our chefs are already sharpening their knives! We will review your details and get back to you shortly to finalize your menu and secure your date.
      </p>

      <p style="line-height: 1.6; color: #444;">
        Ready to discuss the details immediately?
      </p>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="https://calendly.com/homemademeals-info/interview-with-homemade" class="btn">Book a Call</a>
      </div>
      
      <p style="text-align: center; margin-top: 30px; font-style: italic; color: #666;">
        We look forward to creating an unforgettable experience for you! 🎄
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Savor the Magic. All rights reserved.</p>
      <p><a href="https://www.homemademeals.net" style="color: ${COLORS.gold}; text-decoration: none;">www.homemademeals.net</a></p>
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
            { success: true, message: 'Booking request received!' },
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
