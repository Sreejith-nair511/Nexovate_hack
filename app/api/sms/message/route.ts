import { NextRequest, NextResponse } from 'next/server'
import { getSMSUSSDService } from '@/src/server/models/sms'

const smsService = getSMSUSSDService()

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message } = await request.json()

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: phoneNumber, message' },
        { status: 400 }
      )
    }

    const response = await smsService.handleSMS(phoneNumber, message)

    return NextResponse.json({
      success: true,
      response,
      phoneNumber,
      originalMessage: message
    })

  } catch (error) {
    console.error('Error handling SMS:', error)
    return NextResponse.json(
      { error: 'Failed to process SMS message' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = smsService.getSessionStats()

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Error fetching SMS stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SMS statistics' },
      { status: 500 }
    )
  }
}
