import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 30

export async function GET() {
  try {
    const now = new Date()
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Get total logs count
    const totalLogs = await db.gameLog.count()

    // Get logs in last 24 hours
    const last24Hours = await db.gameLog.count({
      where: {
        createdAt: { gte: twentyFourHoursAgo },
      },
    })

    // Get logs grouped by category
    const categoryGroups = await db.gameLog.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
      take: 10,
    })

    const byCategory: Record<string, number> = {}
    for (const group of categoryGroups) {
      byCategory[group.category] = group._count.category
    }

    // Get logs grouped by script
    const scriptGroups = await db.gameLog.groupBy({
      by: ['script'],
      _count: { script: true },
      orderBy: { _count: { script: 'desc' } },
      take: 10,
    })

    const byScript: Record<string, number> = {}
    for (const group of scriptGroups) {
      byScript[group.script] = group._count.script
    }

    return NextResponse.json({
      totalLogs,
      last24Hours,
      byCategory,
      byScript,
    })
  } catch (error) {
    console.error('Error fetching log stats:', error)
    return NextResponse.json({
      totalLogs: 0,
      last24Hours: 0,
      byCategory: {},
      byScript: {},
    })
  }
}
