import { NextRequest, NextResponse } from 'next/server'
import { getASHAManager } from '@/src/server/models/asha'

const ashaManager = getASHAManager()

export async function POST(request: NextRequest) {
  try {
    const { ashaId, patientId, description, outcome, followUpRequired, location } = await request.json()

    if (!ashaId || !patientId || !description || !outcome) {
      return NextResponse.json(
        { error: 'Missing required fields: ashaId, patientId, description, outcome' },
        { status: 400 }
      )
    }

    const result = await ashaManager.recordPatientVisit(
      ashaId,
      patientId,
      description,
      outcome,
      followUpRequired || false,
      location
    )

    return NextResponse.json({
      success: true,
      message: 'Patient visit recorded successfully',
      activityId: result.activityId,
      txId: result.txId,
      blockNo: result.blockNo
    })

  } catch (error) {
    console.error('Error recording patient visit:', error)
    return NextResponse.json(
      { error: 'Failed to record patient visit' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ashaId = searchParams.get('ashaId')

    if (!ashaId) {
      return NextResponse.json(
        { error: 'Missing ashaId parameter' },
        { status: 400 }
      )
    }

    const activities = ashaManager.getASHAActivities(ashaId)

    return NextResponse.json({
      success: true,
      activities
    })

  } catch (error) {
    console.error('Error fetching ASHA activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ASHA activities' },
      { status: 500 }
    )
  }
}
