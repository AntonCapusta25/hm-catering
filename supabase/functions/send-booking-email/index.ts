import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')!
// The FROM email must be verified in SendGrid
const ADMIN_EMAIL = 'chefs@homemademeals.net'

interface CateringBookingData {
    customer_name: string
    customer_email: string
    occasion: string
    event_date: string
    guests: string
}

const clientEmailTemplate = (data: CateringBookingData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catering Request Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #f47a42; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Catering Request Received!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #333; line-height: 1.6;">
                Dear ${data.customer_name},
              </p>
              
              <p style="margin: 0 0 30px; font-size: 16px; color: #333; line-height: 1.6;">
                Thank you for inquiring about Homemade Catering! We have successfully received your request. Here are the details you provided:
              </p>
              
              <!-- Booking Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDFDFD; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-weight: 600; color: #666; font-size: 14px; padding: 8px 0;">Occasion:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0;">${data.occasion}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #666; font-size: 14px; padding: 8px 0;">Date:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0;">${data.event_date}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #666; font-size: 14px; padding: 8px 0;">Guests:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0;">${data.guests}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; font-size: 16px; color: #333; line-height: 1.6;">
                Our catering team will carefully review your request and get back to you shortly to finalize the details and provide a personalized quote.
              </p>
              
              <p style="margin: 0; font-size: 16px; color: #333; line-height: 1.6;">
                Best regards,<br>
                <strong>The Homemade Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #666;">
                Homemade - Premium Catering Services
              </p>
              <p style="margin: 0; font-size: 12px; color: #999;">
                Netherlands | chefs@homemademeals.net
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

const adminEmailTemplate = (data: CateringBookingData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Catering Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #2c3e50; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🔔 New Catering Request</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 30px; font-size: 16px; color: #333; line-height: 1.6;">
                A new catering request has been submitted. Please review the details below:
              </p>
              
              <!-- Customer Information -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDFDFD; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin: 0 0 20px; color: #f47a42; font-size: 18px;">Customer Information</h3>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-weight: 600; color: #666; font-size: 14px; padding: 8px 0; width: 40%;">Name:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0;">${data.customer_name}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #666; font-size: 14px; padding: 8px 0;">Email:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0;"><a href="mailto:${data.customer_email}" style="color: #f47a42; text-decoration: none;">${data.customer_email}</a></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Booking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDFDFD; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin: 0 0 20px; color: #f47a42; font-size: 18px;">Event Details</h3>
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-weight: 600; color: #666; font-size: 14px; padding: 8px 0;">Occasion:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0;">${data.occasion}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #666; font-size: 14px; padding: 8px 0;">Date:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0;">${data.event_date}</td>
                      </tr>
                      <tr>
                        <td style="font-weight: 600; color: #666; font-size: 14px; padding: 8px 0;">Guests:</td>
                        <td style="color: #333; font-size: 14px; padding: 8px 0;">${data.guests}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 12px; color: #999;">
                This is an automated notification from the Homemade booking system
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            },
        })
    }

    try {
        const bodyText = await req.text()

        if (!bodyText) {
            throw new Error('Request body is empty')
        }

        const data: CateringBookingData = JSON.parse(bodyText)

        // Send client confirmation email
        const clientEmailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: data.customer_email, name: data.customer_name }],
                    subject: 'Your Catering Request is Confirmed! 🎉',
                }],
                from: { email: ADMIN_EMAIL, name: 'Homemade Chefs' },
                content: [{
                    type: 'text/html',
                    value: clientEmailTemplate(data),
                }],
            }),
        })

        // Send admin notification email
        const adminEmailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: ADMIN_EMAIL, name: 'Homemade Admin' }],
                    subject: `New Catering Request: ${data.occasion} - ${data.customer_name}`,
                }],
                from: { email: ADMIN_EMAIL, name: 'Homemade Booking System' },
                content: [{
                    type: 'text/html',
                    value: adminEmailTemplate(data),
                }],
            }),
        })

        if (!clientEmailResponse.ok || !adminEmailResponse.ok) {
            throw new Error('Failed to send emails via Sendgrid')
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Emails sent successfully' }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                status: 200
            }
        )
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('Error sending emails:', errorMessage, error)
        return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                status: 500
            }
        )
    }
})
