import { NextRequest, NextResponse } from 'next/server'
import { getSMSUSSDService } from '@/src/server/models/sms'

const smsService = getSMSUSSDService()

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, input } = await request.json()

    if (!phoneNumber || input === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: phoneNumber, input' },
        { status: 400 }
      )
    }

    const response = await smsService.handleUSSD(phoneNumber, input)

    return NextResponse.json({
      success: true,
      response,
      phoneNumber
    })

  } catch (error) {
    console.error('Error handling USSD:', error)
    return NextResponse.json(
      { error: 'Failed to process USSD request' },
      { status: 500 }
    )
  }
}
