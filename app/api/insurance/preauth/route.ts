import { NextRequest, NextResponse } from 'next/server'
import { getInsuranceManager } from '@/src/server/models/insurance'

const insuranceManager = getInsuranceManager()

export async function POST(request: NextRequest) {
  try {
    const {
      patientId,
      recordId,
      insuranceProvider,
      policyNumber,
      estimatedAmount,
      treatmentDetails
    } = await request.json()

    // Validate required fields
    if (!patientId || !recordId || !insuranceProvider || !policyNumber || !estimatedAmount || !treatmentDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Request pre-authorization
    const result = await insuranceManager.requestPreAuth({
      patientId,
      recordId,
      insuranceProvider,
      policyNumber,
      estimatedAmount,
      treatmentDetails
    })

    return NextResponse.json({
      success: true,
      message: 'Pre-authorization request submitted successfully',
      preAuthNumber: result.preAuthNumber,
      txId: result.txId,
      blockNo: result.blockNo
    })

  } catch (error) {
    console.error('Error requesting pre-authorization:', error)
    return NextResponse.json(
      { error: 'Failed to request pre-authorization' },
      { status: 500 }
    )
  }
}
