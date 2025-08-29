import { NextRequest, NextResponse } from 'next/server'
import { getInsuranceManager } from '@/src/server/models/insurance'

const insuranceManager = getInsuranceManager()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')
    const status = searchParams.get('status')

    let claims
    if (patientId) {
      claims = insuranceManager.getClaimsByPatient(patientId)
    } else if (status) {
      claims = insuranceManager.getClaimsByStatus(status as any)
    } else {
      // Return all claims (for admin/insurance reviewers)
      const stats = insuranceManager.getClaimStats()
      const allClaims = [
        ...insuranceManager.getClaimsByStatus('submitted'),
        ...insuranceManager.getClaimsByStatus('under_review'),
        ...insuranceManager.getClaimsByStatus('approved'),
        ...insuranceManager.getClaimsByStatus('rejected'),
        ...insuranceManager.getClaimsByStatus('paid')
      ]
      
      return NextResponse.json({
        success: true,
        claims: allClaims,
        stats
      })
    }

    return NextResponse.json({
      success: true,
      claims
    })

  } catch (error) {
    console.error('Error fetching insurance claims:', error)
    return NextResponse.json(
      { error: 'Failed to fetch insurance claims' },
      { status: 500 }
    )
  }
}
