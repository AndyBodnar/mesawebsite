'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Server } from 'lucide-react'

interface ServerPerformanceChartProps {
  data?: { time: string; cpu: number; memory: number; tick: number }[]
  loading?: boolean
}

export function ServerPerformanceChart({ data, loading }: ServerPerformanceChartProps) {
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
        <Server className="h-8 w-8 mb-3 animate-pulse" />
        <p className="text-lg">Waiting on data stream</p>
        <p className="text-sm mt-1 text-gray-600">Server metrics will populate when connected</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="time"
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
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
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => (
            <span className="text-gray-300 text-sm capitalize">{value}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey="cpu"
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          name="CPU %"
        />
        <Line
          type="monotone"
          dataKey="memory"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          name="Memory %"
        />
        <Line
          type="monotone"
          dataKey="tick"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          name="Tick Rate"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
