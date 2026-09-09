import { NextRequest, NextResponse } from 'next/server'
import { processPendingBookingEmails } from '@/lib/bookingEmailService'

export async function GET(request: NextRequest) {
  try {
    const result = await processPendingBookingEmails()
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Error in process-pending cron:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await processPendingBookingEmails()
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Error in process-pending cron:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
