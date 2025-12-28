'use client'

import { useState } from 'react'
import { ScrollText, Filter, AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface LogEntry {
  id: string
  script: string
  category: string
  message: string
  timestamp: string
  level?: 'info' | 'warning' | 'error' | 'success'
  identifier?: string
}

interface RecentLogsPanelProps {
  logs?: LogEntry[]
  loading?: boolean
  onLogClick?: (log: LogEntry) => void
}

const levelIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
}

const levelColors = {
  info: 'text-blue-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
  success: 'text-green-400',
}

export function RecentLogsPanel({ logs, loading, onLogClick }: RecentLogsPanelProps) {
  const [filter, setFilter] = useState<string>('all')

  const filteredLogs = logs?.filter((log) => {
    if (filter === 'all') return true
    return log.level === filter || log.category === filter
  })

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/50">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-white">Recent Logs</span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-full mb-1" />
              <div className="h-3 bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50">
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-green-500" />
            <span className="font-medium text-white">Recent Logs</span>
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All</option>
              <option value="info">Info</option>
              <option value="warning">Warnings</option>
              <option value="error">Errors</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto font-mono text-sm">
        {filteredLogs && filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const level = log.level || 'info'
            const Icon = levelIcons[level]
            return (
              <div
                key={log.id}
                className="flex items-start gap-2 p-3 hover:bg-gray-800/50 cursor-pointer border-b border-gray-800/50 last:border-0"
                onClick={() => onLogClick?.(log)}
              >
                <Icon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', levelColors[level])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                      {log.script}
                    </span>
                    <span className="text-xs text-gray-500">
                      {log.category}
                    </span>
                    <span className="text-xs text-gray-600 ml-auto">
                      {format(new Date(log.timestamp), 'HH:mm:ss')}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1 break-words">{log.message}</p>
                  {log.identifier && (
                    <p className="text-xs text-gray-500 mt-1">
                      Player: {log.identifier}
                    </p>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-8 text-center text-gray-500">
            No logs available
          </div>
        )}
      </div>
    </div>
  )
}
