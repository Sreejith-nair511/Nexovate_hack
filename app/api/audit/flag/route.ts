import { NextRequest, NextResponse } from 'next/server';
import { getLedger, LEDGER_ACTIONS } from '@/src/server/ledger/mockLedger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recordId, auditorId, reason } = body;

    if (!recordId || !auditorId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ledger = getLedger();
    const result = await ledger.appendTx({
      actor: `auditor:${auditorId}`,
      action: LEDGER_ACTIONS.AUDIT_FLAG,
      recordId,
      details: {
        reason,
        flaggedAt: Date.now()
      }
    });

    return NextResponse.json({
      success: true,
      txId: result.txId,
      blockNo: result.blockNo,
      recordId
    });

  } catch (error) {
    console.error('Error flagging record:', error);
    return NextResponse.json(
      { error: 'Failed to flag record' },
      { status: 500 }
    );
  }
}
