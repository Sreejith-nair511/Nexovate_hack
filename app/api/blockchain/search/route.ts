import { NextRequest, NextResponse } from 'next/server'
import { getBlockchainExplorer } from '@/src/server/models/blockchain'

const explorer = getBlockchainExplorer()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    if (type === 'transaction') {
      const txId = searchParams.get('txId')
      if (!txId) {
        return NextResponse.json(
          { error: 'Missing txId parameter' },
          { status: 400 }
        )
      }

      const transaction = await explorer.getTransactionDetails(txId)
      return NextResponse.json({
        success: true,
        transaction
      })
    }

    if (type === 'block') {
      const blockNumber = parseInt(searchParams.get('blockNumber') || '0')
      const block = await explorer.getBlockDetails(blockNumber)
      return NextResponse.json({
        success: true,
        block
      })
    }

    if (type === 'transactions') {
      const query = {
        actor: searchParams.get('actor') || undefined,
        action: searchParams.get('action') || undefined,
        recordId: searchParams.get('recordId') || undefined,
        fromDate: searchParams.get('fromDate') ? parseInt(searchParams.get('fromDate')!) : undefined,
        toDate: searchParams.get('toDate') ? parseInt(searchParams.get('toDate')!) : undefined,
        limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      }

      const transactions = await explorer.searchTransactions(query)
      return NextResponse.json({
        success: true,
        transactions
      })
    }

    return NextResponse.json(
      { error: 'Invalid type parameter. Use "transaction", "block", or "transactions"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error searching blockchain:', error)
    return NextResponse.json(
      { error: 'Failed to search blockchain' },
      { status: 500 }
    )
  }
}
