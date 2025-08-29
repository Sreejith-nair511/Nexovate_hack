import { NextRequest, NextResponse } from 'next/server'
import { getASHAManager } from '@/src/server/models/asha'

const ashaManager = getASHAManager()

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    if (action === 'request') {
      const { recordId, patientId, doctorId, ashaId, recordSummary, urgencyLevel } = data

      if (!recordId || !patientId || !doctorId || !ashaId || !recordSummary) {
        return NextResponse.json(
          { error: 'Missing required fields for OTP request' },
          { status: 400 }
        )
      }

      const result = await ashaManager.requestOTPCoSign(
        recordId,
        patientId,
        doctorId,
        ashaId,
        recordSummary,
        urgencyLevel || 'medium'
      )

      return NextResponse.json({
        success: true,
        message: 'OTP sent to ASHA worker',
        requestId: result.requestId,
        otp: result.otp, // In production, this would be sent via SMS
        txId: result.txId,
        blockNo: result.blockNo
      })
    }

    if (action === 'verify') {
      const { requestId, otp, ashaSignature } = data

      if (!requestId || !otp) {
        return NextResponse.json(
          { error: 'Missing required fields for OTP verification' },
          { status: 400 }
        )
      }

      const result = await ashaManager.verifyOTPAndCoSign(requestId, otp, ashaSignature)

      return NextResponse.json({
        success: result.success,
        message: result.message,
        txId: result.txId,
        blockNo: result.blockNo,
        signedPayload: result.signedPayload
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "request" or "verify"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error handling OTP request:', error)
    return NextResponse.json(
      { error: 'Failed to process OTP request' },
      { status: 500 }
    )
  }
}
