import { NextRequest, NextResponse } from 'next/server'
import { getASHAManager } from '@/src/server/models/asha'

const ashaManager = getASHAManager()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ashaId = searchParams.get('ashaId')
    const district = searchParams.get('district')
    const state = searchParams.get('state')
    const stats = searchParams.get('stats')

    if (stats === 'true') {
      const systemStats = ashaManager.getSystemStats()
      return NextResponse.json({
        success: true,
        stats: systemStats
      })
    }

    if (ashaId) {
      const worker = ashaManager.getASHAWorker(ashaId)
      if (!worker) {
        return NextResponse.json(
          { error: 'ASHA worker not found' },
          { status: 404 }
        )
      }

      const workerStats = ashaManager.getASHAStats(ashaId)
      const activities = ashaManager.getASHAActivities(ashaId)
      const pendingOTPs = ashaManager.getPendingOTPRequests(ashaId)
      const consents = ashaManager.getPatientConsents(ashaId)

      return NextResponse.json({
        success: true,
        worker,
        stats: workerStats,
        activities,
        pendingOTPs,
        consents
      })
    }

    if (district) {
      const workers = ashaManager.getASHAWorkersByLocation(district, state || undefined)
      return NextResponse.json({
        success: true,
        workers
      })
    }

    const allWorkers = ashaManager.getAllASHAWorkers()
    return NextResponse.json({
      success: true,
      workers: allWorkers
    })

  } catch (error) {
    console.error('Error fetching ASHA workers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ASHA workers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const workerData = await request.json()

    const { name, phoneNumber, village, district, state, specializations, isActive } = workerData

    if (!name || !phoneNumber || !village || !district || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await ashaManager.registerASHAWorker({
      name,
      phoneNumber,
      village,
      district,
      state,
      specializations: specializations || [],
      isActive: isActive !== false
    })

    return NextResponse.json({
      success: true,
      message: 'ASHA worker registered successfully',
      ashaId: result.ashaId,
      txId: result.txId,
      blockNo: result.blockNo
    })

  } catch (error) {
    console.error('Error registering ASHA worker:', error)
    return NextResponse.json(
      { error: 'Failed to register ASHA worker' },
      { status: 500 }
    )
  }
}
