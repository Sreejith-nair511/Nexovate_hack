import { NextRequest, NextResponse } from 'next/server'
import { getBlockchainExplorer } from '@/src/server/models/blockchain'

const explorer = getBlockchainExplorer()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'nodes') {
      const nodes = explorer.getNetworkNodes()
      return NextResponse.json({
        success: true,
        nodes
      })
    }

    if (type === 'flows') {
      const timeRange = parseInt(searchParams.get('timeRange') || '86400000') // 24 hours default
      const flows = explorer.getTransactionFlows(timeRange)
      return NextResponse.json({
        success: true,
        flows
      })
    }

    return NextResponse.json(
      { error: 'Invalid type parameter. Use "nodes" or "flows"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error fetching network data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch network data' },
      { status: 500 }
    )
  }
}
