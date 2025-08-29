import { NextRequest, NextResponse } from 'next/server'
import { getQRHealthCardManager } from '@/src/server/models/qr'

const qrManager = getQRHealthCardManager()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cardId = searchParams.get('cardId')
    const patientId = searchParams.get('patientId')
    const stats = searchParams.get('stats')
    const expiring = searchParams.get('expiring')

    if (stats === 'true') {
      const qrStats = qrManager.getQRStats()
      return NextResponse.json({
        success: true,
        stats: qrStats
      })
    }

    if (expiring === 'true') {
      const days = parseInt(searchParams.get('days') || '30')
      const expiringCards = qrManager.getExpiringCards(days)
      return NextResponse.json({
        success: true,
        expiringCards
      })
    }

    if (cardId) {
      const card = qrManager.getHealthCard(cardId)
      if (!card) {
        return NextResponse.json(
          { error: 'Health card not found' },
          { status: 404 }
        )
      }

      const accessLogs = qrManager.getAccessLogs(cardId)
      return NextResponse.json({
        success: true,
        card,
        accessLogs
      })
    }

    if (patientId) {
      const cards = qrManager.getHealthCardsByPatient(patientId)
      return NextResponse.json({
        success: true,
        cards
      })
    }

    const allCards = qrManager.getAllActiveCards()
    return NextResponse.json({
      success: true,
      cards: allCards
    })

  } catch (error) {
    console.error('Error fetching QR health cards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QR health cards' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { cardId, updates, updatedBy } = await request.json()

    if (!cardId || !updates || !updatedBy) {
      return NextResponse.json(
        { error: 'Missing required fields: cardId, updates, updatedBy' },
        { status: 400 }
      )
    }

    const result = await qrManager.updateHealthCard(cardId, updates, updatedBy)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Health card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Health card updated successfully',
      txId: result.txId,
      blockNo: result.blockNo,
      newQRCode: result.newQRCode
    })

  } catch (error) {
    console.error('Error updating QR health card:', error)
    return NextResponse.json(
      { error: 'Failed to update QR health card' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cardId = searchParams.get('cardId')
    const revokedBy = searchParams.get('revokedBy')
    const reason = searchParams.get('reason')

    if (!cardId || !revokedBy || !reason) {
      return NextResponse.json(
        { error: 'Missing required parameters: cardId, revokedBy, reason' },
        { status: 400 }
      )
    }

    const result = await qrManager.revokeHealthCard(cardId, revokedBy, reason)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Health card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Health card revoked successfully',
      txId: result.txId,
      blockNo: result.blockNo
    })

  } catch (error) {
    console.error('Error revoking QR health card:', error)
    return NextResponse.json(
      { error: 'Failed to revoke QR health card' },
      { status: 500 }
    )
  }
}
