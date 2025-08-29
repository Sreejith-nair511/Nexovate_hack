import { NextRequest, NextResponse } from 'next/server'
import { getInsuranceManager } from '@/src/server/models/insurance'

const insuranceManager = getInsuranceManager()

export async function POST(request: NextRequest) {
  try {
    const {
      claimId,
      reviewerId,
      decision,
      approvedAmount,
      rejectionReason
    } = await request.json()

    // Validate required fields
    if (!claimId || !reviewerId || !decision) {
      return NextResponse.json(
        { error: 'Missing required fields: claimId, reviewerId, decision' },
        { status: 400 }
      )
    }

    if (decision !== 'approve' && decision !== 'reject') {
      return NextResponse.json(
        { error: 'Decision must be either "approve" or "reject"' },
        { status: 400 }
      )
    }

    // Review claim
    const result = await insuranceManager.reviewClaim(
      claimId,
      reviewerId,
      decision,
      approvedAmount,
      rejectionReason
    )

    return NextResponse.json({
      success: true,
      message: `Claim ${decision}d successfully`,
      claimId,
      decision,
      txId: result.txId,
      blockNo: result.blockNo
    })

  } catch (error) {
    console.error('Error reviewing insurance claim:', error)
    return NextResponse.json(
      { error: 'Failed to review insurance claim' },
      { status: 500 }
    )
  }
}
