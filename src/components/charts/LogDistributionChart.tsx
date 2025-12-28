'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Activity } from 'lucide-react'

interface LogDistributionChartProps {
  data?: { name: string; value: number; color: string }[]
  loading?: boolean
}

const DEFAULT_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
]

export function LogDistributionChart({ data, loading }: LogDistributionChartProps) {
  const hasData = data && data.length > 0 && data.some(d => d.value > 0)

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
        <Activity className="h-8 w-8 mb-3 animate-pulse" />
        <p className="text-lg">Waiting on data stream</p>
        <p className="text-sm mt-1 text-gray-600">Logs will populate as events occur</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {data!.map((entry, index) => (
            <Cell
              key={"cell-" + index}
              fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value: number) => [value.toLocaleString(), 'Events']}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
