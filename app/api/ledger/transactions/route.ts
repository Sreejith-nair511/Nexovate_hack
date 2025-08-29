import { NextRequest, NextResponse } from 'next/server';
import { getLedger } from '@/src/server/ledger/mockLedger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const actor = searchParams.get('actor');
    const action = searchParams.get('action');
    const recordId = searchParams.get('recordId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const ledger = getLedger();
    let transactions;

    if (actor) {
      transactions = ledger.getTransactionsByActor(actor);
    } else if (action) {
      transactions = ledger.getTransactionsByAction(action);
    } else if (recordId) {
      transactions = ledger.getTransactionsByRecordId(recordId);
    } else {
      transactions = ledger.getRecentTransactions(limit);
    }

    return NextResponse.json({
      success: true,
      transactions,
      total: transactions.length
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
