import { NextRequest, NextResponse } from 'next/server'
import { RecordManager } from '@/src/server/models/record'

const recordManager = new RecordManager()

export async function POST(request: NextRequest) {
  try {
    const { recordId, patientId, rating, comment } = await request.json()

    // Validate required fields
    if (!recordId || !patientId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: recordId, patientId, rating' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Submit feedback
    const result = await recordManager.addFeedback(recordId, {
      patientId,
      rating,
      comment: comment || '',
      timestamp: Date.now()
    })

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      txId: result.txId,
      blockNo: result.blockNo
    })

  } catch (error) {
    console.error('Error submitting feedback:', error)
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recordId = searchParams.get('recordId')
    const patientId = searchParams.get('patientId')

    if (!recordId && !patientId) {
      return NextResponse.json(
        { error: 'Either recordId or patientId is required' },
        { status: 400 }
      )
    }

    // Get feedback for specific record or all feedback by patient
    const feedback = await recordManager.getFeedback(recordId, patientId)

    return NextResponse.json({
      success: true,
      feedback
    })

  } catch (error) {
    console.error('Error fetching feedback:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    )
  }
}
