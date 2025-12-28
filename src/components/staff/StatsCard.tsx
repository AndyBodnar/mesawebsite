'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  loading?: boolean
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  loading,
}: StatsCardProps) {
  if (loading) {
    return (
      <div className={cn('rounded-xl border border-gray-800 bg-gray-900/50 p-4', className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-24 mb-3" />
          <div className="h-8 bg-gray-700 rounded w-16 mb-2" />
          <div className="h-3 bg-gray-700 rounded w-20" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-xl border border-gray-800 bg-gray-900/50 p-4', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{title}</span>
        {Icon && <Icon className="h-5 w-5 text-gray-500" />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {trend && (
          <span
            className={cn(
              'text-sm font-medium',
              trend.isPositive ? 'text-green-500' : 'text-red-500'
            )}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  )
}
