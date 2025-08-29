import { NextRequest, NextResponse } from 'next/server'
import { getComplianceManager } from '@/src/server/models/compliance'

const complianceManager = getComplianceManager()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hospitalId = searchParams.get('hospitalId')
    const leaderboard = searchParams.get('leaderboard')

    if (hospitalId) {
      const compliance = complianceManager.getHospitalCompliance(hospitalId)
      if (!compliance) {
        return NextResponse.json(
          { error: 'Hospital not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        compliance
      })
    }

    if (leaderboard === 'true') {
      const leaderboardData = complianceManager.getComplianceLeaderboard()
      return NextResponse.json({
        success: true,
        leaderboard: leaderboardData
      })
    }

    const allCompliance = complianceManager.getAllHospitalsCompliance()
    const stats = complianceManager.getComplianceStats()

    return NextResponse.json({
      success: true,
      hospitals: allCompliance,
      stats
    })

  } catch (error) {
    console.error('Error fetching compliance data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch compliance data' },
      { status: 500 }
    )
  }
}
