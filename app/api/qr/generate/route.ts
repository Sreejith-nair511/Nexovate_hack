import { NextRequest, NextResponse } from 'next/server'
import { getQRHealthCardManager } from '@/src/server/models/qr'

const qrManager = getQRHealthCardManager()

export async function POST(request: NextRequest) {
  try {
    const { 
      patientId, 
      patientName, 
      patientData, 
      issuerHospitalId, 
      validityDays 
    } = await request.json()

    if (!patientId || !patientName || !patientData || !issuerHospitalId) {
      return NextResponse.json(
        { error: 'Missing required fields: patientId, patientName, patientData, issuerHospitalId' },
        { status: 400 }
      )
    }

    if (!patientData.bloodGroup || !patientData.emergencyContact) {
      return NextResponse.json(
        { error: 'Missing required patient data: bloodGroup, emergencyContact' },
        { status: 400 }
      )
    }

    const result = await qrManager.generateHealthCard(
      patientId,
      patientName,
      {
        abhaId: patientData.abhaId,
        bloodGroup: patientData.bloodGroup,
        emergencyContact: patientData.emergencyContact,
        allergies: patientData.allergies || [],
        chronicConditions: patientData.chronicConditions || [],
        medications: patientData.medications || [],
      },
      issuerHospitalId,
      validityDays || 365
    )

    return NextResponse.json({
      success: true,
      message: 'QR Health Card generated successfully',
      cardId: result.cardId,
      qrCodeImage: result.qrCodeImage,
      txId: result.txId,
      blockNo: result.blockNo
    })

  } catch (error) {
    console.error('Error generating QR health card:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR health card' },
      { status: 500 }
    )
  }
}
