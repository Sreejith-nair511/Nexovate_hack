import { NextRequest, NextResponse } from 'next/server';
import { getRecordManager } from '@/src/server/models/record';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recordId, endorsedBy } = body;

    if (!recordId || !endorsedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const recordManager = getRecordManager();
    const result = await recordManager.endorseRecord(recordId, endorsedBy);

    return NextResponse.json({
      success: true,
      txId: result.txId,
      blockNo: result.blockNo,
      recordId
    });

  } catch (error) {
    console.error('Error endorsing record:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to endorse record' },
      { status: 500 }
    );
  }
}
