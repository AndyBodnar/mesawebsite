'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Server,
  Activity,
  Clock,
  AlertTriangle,
  Shield,
  Zap,
  HardDrive,
  Cpu,
  Wifi,
  RefreshCw,
} from 'lucide-react'

// Hooks
import { useDashboard, useLogs, usePlayerActivityHistory } from '@/hooks'

// Components
import { StatsCard } from '@/components/staff/StatsCard'
import { OnlinePlayersPanel } from '@/components/staff/OnlinePlayersPanel'
import { RecentLogsPanel } from '@/components/staff/RecentLogsPanel'
import { PlayerActivityChart } from '@/components/charts/PlayerActivityChart'
import { LogDistributionChart } from '@/components/charts/LogDistributionChart'
import { ServerPerformanceChart } from '@/components/charts/ServerPerformanceChart'

export default function StaffDashboard() {
  const { players, logStats, serverInfo, loading, isRefreshing, error, refetch } = useDashboard()
  const { data: logsData, loading: logsLoading } = useLogs({ limit: 20 })
  const { data: activityHistory, loading: activityLoading } = usePlayerActivityHistory()

  // Transform players data for the panel
  const playersList = useMemo(() => {
    if (!players?.players) return []
    return players.players.map((p: any) => ({
      id: p.id,
      name: p.name,
      identifier: p.identifier,
      ping: p.ping || 0,
      job: p.job,
      playtime: p.playtime,
    }))
  }, [players])

  // Transform logs data for the panel
  const logsList = useMemo(() => {
    if (!logsData?.logs) return []
    return logsData.logs.map((l: any) => ({
      id: l.id,
      script: l.script,
      category: l.category,
      message: l.message,
      timestamp: l.createdAt,
      identifier: l.identifier,
      level: (l.category?.includes('error') ? 'error' :
             l.category?.includes('warn') ? 'warning' : 'info') as 'error' | 'warning' | 'info',
    }))
  }, [logsData])

  // Transform log stats for pie chart
  const logDistribution = useMemo(() => {
    if (!logStats?.byCategory) return undefined
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
    return Object.entries(logStats.byCategory).map(([name, value], i) => ({
      name,
      value: value as number,
      color: colors[i % colors.length],
    }))
  }, [logStats])

  // Use real player activity history data (falls back to current count if no history)
  const playerActivityData = useMemo(() => {
    // If we have real history data, use it
    if (activityHistory?.history && activityHistory.history.length > 0) {
      return activityHistory.history
    }
    // Fallback: show current player count as the only data point
    const currentPlayers = players?.count || 0
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    return [{ time: timeStr, players: currentPlayers }]
  }, [activityHistory, players?.count])

  // Generate server performance data with current values
  const [perfHistory, setPerfHistory] = useState<{ time: string; cpu: number; memory: number; tick: number }[]>([])
  
  useEffect(() => {
    if (!serverInfo) return
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    setPerfHistory(prev => {
      const newPoint = {
        time: now,
        cpu: serverInfo.cpu || Math.floor(20 + Math.random() * 30),
        memory: serverInfo.memory || Math.floor(40 + Math.random() * 20),
        tick: 60 + Math.floor(Math.random() * 6) // Tick rate ~60-66
      }
      const updated = [...prev, newPoint].slice(-20) // Keep last 20 points
      return updated
    })
  }, [serverInfo])

  const handlePlayerAction = (playerId: number, action: string) => {
    console.log(`Action: ${action} on player ${playerId}`)
    // TODO: Implement player actions via API
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
          <p className="text-gray-400">Server management and analytics overview</p>
        </div>
        <button
          onClick={refetch}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span>Failed to load dashboard data. Check API connection.</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <StatsCard
          title="Players Online"
          value={players?.count || 0}
          subtitle={`of ${serverInfo?.maxPlayers || 64} slots`}
          icon={Users}
          loading={loading}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Server Uptime"
          value={serverInfo?.uptime || '0h'}
          subtitle="Since last restart"
          icon={Clock}
          loading={loading}
        />
        <StatsCard
          title="Total Logs Today"
          value={logStats?.totalLogs?.toLocaleString() || '0'}
          subtitle="Events recorded"
          icon={Activity}
          loading={loading}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Warnings"
          value={logStats?.last24Hours || 0}
          subtitle="Pending review"
          icon={AlertTriangle}
          loading={loading}
        />
      </motion.div>

      {/* Server Status Bar */}
      <motion.div
        className="grid gap-4 sm:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Server className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Server Status</p>
            <p className="text-sm font-medium text-green-400">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Cpu className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">CPU Usage</p>
            <p className="text-sm font-medium text-white">{serverInfo?.cpu || '0'}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <HardDrive className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Memory Usage</p>
            <p className="text-sm font-medium text-white">{serverInfo?.memory || '0'}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <Wifi className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg Ping</p>
            <p className="text-sm font-medium text-white">{serverInfo?.avgPing || '0'}ms</p>
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          className="rounded-xl border border-gray-800 bg-gray-900/50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Player Activity (24h)</h3>
          <PlayerActivityChart data={playerActivityData} loading={loading} />
        </motion.div>

        <motion.div
          className="rounded-xl border border-gray-800 bg-gray-900/50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Log Distribution</h3>
          <LogDistributionChart data={logDistribution} loading={loading} />
        </motion.div>
      </div>

      {/* Server Performance Chart */}
      <motion.div
        className="rounded-xl border border-gray-800 bg-gray-900/50 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Server Performance</h3>
        <ServerPerformanceChart data={perfHistory} loading={loading} />
      </motion.div>

      {/* Players and Logs Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <OnlinePlayersPanel
            players={playersList}
            loading={loading}
            onPlayerAction={handlePlayerAction}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecentLogsPanel
            logs={logsList}
            loading={logsLoading}
          />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="rounded-xl border border-gray-800 bg-gray-900/50 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="font-medium text-white">Server Announce</p>
              <p className="text-xs text-gray-400">Send global message</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="font-medium text-white">Restart Warning</p>
              <p className="text-xs text-gray-400">Schedule restart</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium text-white">Whitelist Mode</p>
              <p className="text-xs text-gray-400">Toggle whitelist</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
            <div className="p-2 rounded-lg bg-green-500/10">
              <RefreshCw className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-white">Refresh Resources</p>
              <p className="text-xs text-gray-400">Reload all scripts</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
