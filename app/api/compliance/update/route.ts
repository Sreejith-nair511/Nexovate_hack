import { NextRequest, NextResponse } from 'next/server'
import { getComplianceManager } from '@/src/server/models/compliance'

const complianceManager = getComplianceManager()

export async function POST(request: NextRequest) {
  try {
    const { hospitalId, metrics } = await request.json()

    if (!hospitalId || !metrics) {
      return NextResponse.json(
        { error: 'Missing required fields: hospitalId, metrics' },
        { status: 400 }
      )
    }

    const result = await complianceManager.updateCompliance(hospitalId, metrics)

    return NextResponse.json({
      success: true,
      message: 'Compliance metrics updated successfully',
      hospitalId,
      newScore: result.newScore,
      txId: result.txId,
      blockNo: result.blockNo
    })

  } catch (error) {
    console.error('Error updating compliance:', error)
    return NextResponse.json(
      { error: 'Failed to update compliance metrics' },
      { status: 500 }
    )
  }
}
