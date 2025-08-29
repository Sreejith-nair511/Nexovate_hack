import { NextRequest, NextResponse } from 'next/server';
import { getRecordManager } from '@/src/server/models/record';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recordId, patientId, reason } = body;

    if (!recordId || !patientId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recordManager = getRecordManager();
    const result = await recordManager.disputeRecord(recordId, patientId, reason);

    return NextResponse.json({
      success: true,
      txId: result.txId,
      blockNo: result.blockNo,
      recordId
    });

  } catch (error) {
    console.error('Error disputing record:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to dispute record' },
      { status: 500 }
    );
  }
}
