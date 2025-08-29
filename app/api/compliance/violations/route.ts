import { NextRequest, NextResponse } from 'next/server'
import { getComplianceManager } from '@/src/server/models/compliance'

const complianceManager = getComplianceManager()

export async function POST(request: NextRequest) {
  try {
    const { hospitalId, type, severity, description, penaltyPoints } = await request.json()

    if (!hospitalId || !type || !severity || !description || penaltyPoints === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await complianceManager.addViolation(hospitalId, {
      type,
      severity,
      description,
      penaltyPoints
    })

    return NextResponse.json({
      success: true,
      message: 'Compliance violation recorded successfully',
      hospitalId,
      txId: result.txId,
      blockNo: result.blockNo
    })

  } catch (error) {
    console.error('Error recording violation:', error)
    return NextResponse.json(
      { error: 'Failed to record compliance violation' },
      { status: 500 }
    )
  }
}
