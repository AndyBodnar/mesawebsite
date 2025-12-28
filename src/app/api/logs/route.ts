import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const script = searchParams.get('script')
    const category = searchParams.get('category')
    const identifier = searchParams.get('identifier')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: Record<string, unknown> = {}

    if (script) where.script = script
    if (category) where.category = category
    if (identifier) where.identifier = identifier
    if (search) {
      where.OR = [
        { message: { contains: search } },
        { title: { contains: search } },
        { playerName: { contains: search } },
      ]
    }

    const [logs, total] = await Promise.all([
      db.gameLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.gameLog.count({ where }),
    ])

    return NextResponse.json({
      logs,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json({ logs: [], total: 0, limit: 50, offset: 0 })
  }
}
