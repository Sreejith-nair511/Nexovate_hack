import { NextRequest, NextResponse } from 'next/server';
import { getLedger } from '@/src/server/ledger/mockLedger';

export async function GET(request: NextRequest) {
  try {
    const ledger = getLedger();
    const stats = ledger.getStats();

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching ledger stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ledger stats' },
      { status: 500 }
    );
  }
}
