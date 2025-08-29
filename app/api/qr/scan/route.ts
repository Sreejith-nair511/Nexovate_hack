import { NextRequest, NextResponse } from 'next/server'
import { getQRHealthCardManager } from '@/src/server/models/qr'

const qrManager = getQRHealthCardManager()

export async function POST(request: NextRequest) {
  try {
    const { qrCodeData, scannedBy, accessLevel, purpose, location } = await request.json()

    if (!qrCodeData || !scannedBy) {
      return NextResponse.json(
        { error: 'Missing required fields: qrCodeData, scannedBy' },
        { status: 400 }
      )
    }

    const result = await qrManager.scanHealthCard(
      qrCodeData,
      scannedBy,
      accessLevel || 'basic',
      purpose || 'routine_check',
      location
    )

    return NextResponse.json({
      success: true,
      scanResult: result
    })

  } catch (error) {
    console.error('Error scanning QR health card:', error)
    return NextResponse.json(
      { error: 'Failed to scan QR health card' },
      { status: 500 }
    )
  }
}
