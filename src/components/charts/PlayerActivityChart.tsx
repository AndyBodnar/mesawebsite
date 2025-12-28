'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Wifi } from 'lucide-react'

interface PlayerActivityChartProps {
  data?: { time: string; players: number }[]
  loading?: boolean
}

export function PlayerActivityChart({ data, loading }: PlayerActivityChartProps) {
  // Show chart if we have any data points (even if all zeros)
  const hasData = data && data.length > 0

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading chart...</div>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-gray-500">
        <Wifi className="h-8 w-8 mb-3 animate-pulse" />
        <p className="text-lg">Waiting on data stream</p>
        <p className="text-sm mt-1 text-gray-600">Activity will populate as players connect</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="playerGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="time"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => String(value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
          }}
          labelStyle={{ color: '#9ca3af' }}
        />
        <Area
          type="monotone"
          dataKey="players"
          stroke="#3b82f6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#playerGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
