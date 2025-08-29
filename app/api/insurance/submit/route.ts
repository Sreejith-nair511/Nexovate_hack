import { NextRequest, NextResponse } from 'next/server'
import { getInsuranceManager } from '@/src/server/models/insurance'

const insuranceManager = getInsuranceManager()

export async function POST(request: NextRequest) {
  try {
    const {
      claimId,
      patientId,
      recordId,
      insuranceProvider,
      policyNumber,
      claimAmount,
      documents,
      preAuthRequired,
      preAuthNumber
    } = await request.json()

    // Validate required fields
    if (!claimId || !patientId || !recordId || !insuranceProvider || !policyNumber || !claimAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Submit claim
    const result = await insuranceManager.submitClaim({
      claimId,
      patientId,
      recordId,
      insuranceProvider,
      policyNumber,
      claimAmount,
      documents: documents || [],
      preAuthRequired: preAuthRequired || false,
      preAuthNumber
    })

    return NextResponse.json({
      success: true,
      message: 'Insurance claim submitted successfully',
      claimId,
      txId: result.txId,
      blockNo: result.blockNo
    })

  } catch (error) {
    console.error('Error submitting insurance claim:', error)
    return NextResponse.json(
      { error: 'Failed to submit insurance claim' },
      { status: 500 }
    )
  }
}
