import { NextRequest, NextResponse } from 'next/server'
import { getBlockchainExplorer } from '@/src/server/models/blockchain'

const explorer = getBlockchainExplorer()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'analytics') {
      const analytics = await explorer.getChainAnalytics()
      return NextResponse.json({
        success: true,
        analytics
      })
    }

    if (type === 'health') {
      const health = explorer.getNetworkHealth()
      return NextResponse.json({
        success: true,
        health
      })
    }

    if (type === 'realtime') {
      const metrics = explorer.getRealTimeMetrics()
      return NextResponse.json({
        success: true,
        metrics
      })
    }

    const stats = await explorer.getBlockchainStats()
    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Error fetching blockchain stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blockchain statistics' },
      { status: 500 }
    )
  }
}
