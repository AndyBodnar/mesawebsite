'use client'

import { motion } from 'framer-motion'
import {
  Server,
  Cpu,
  HardDrive,
  Wifi,
  RefreshCw,
  Power,
  AlertTriangle,
  Clock,
  Users,
  Activity,
  Package,
  CheckCircle,
  XCircle,
  Search,
} from 'lucide-react'
import { useState } from 'react'
import { useServerInfo, useOnlinePlayers, useResources } from '@/hooks'

export default function StaffServerPage() {
  const { data: serverInfo, loading, refetch } = useServerInfo()
  const { data: playersData } = useOnlinePlayers()
  const { data: resourcesData, loading: resourcesLoading, refetch: refetchResources } = useResources()
  const [resourceSearch, setResourceSearch] = useState('')

  const hasData = serverInfo && (serverInfo.cpu || serverInfo.memory || serverInfo.uptime)

  // Filter resources by search
  const filteredResources = resourcesData?.resources?.filter(r =>
    r.name.toLowerCase().includes(resourceSearch.toLowerCase())
  ) || []

  // Count started/stopped resources
  const startedCount = resourcesData?.resources?.filter(r => r.state === 'started').length || 0
  const stoppedCount = resourcesData?.resources?.filter(r => r.state === 'stopped').length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Server Management</h1>
          <p className="text-gray-400">Monitor and control your FiveM server</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Server Status */}
      <motion.div
        className="rounded-xl border border-gray-800 bg-gray-900/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Server className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Black Mesa RP</h2>
              <p className="text-sm text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Server Online
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Restart
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <Power className="h-4 w-4" />
              Stop
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Wifi className="h-8 w-8 mb-3 animate-pulse" />
            <p className="text-lg">Waiting on data stream</p>
            <p className="text-sm mt-1 text-gray-600">Server metrics will appear when connected</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Players</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {playersData?.count || 0}/{playersData?.maxPlayers || 64}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Cpu className="h-4 w-4" />
                <span className="text-sm">CPU Usage</span>
              </div>
              <p className="text-2xl font-bold text-white">{serverInfo?.cpu || 0}%</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <HardDrive className="h-4 w-4" />
                <span className="text-sm">Memory</span>
              </div>
              <p className="text-2xl font-bold text-white">{serverInfo?.memory || 0}%</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Uptime</span>
              </div>
              <p className="text-2xl font-bold text-white">{serverInfo?.uptime || '0h'}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="rounded-xl border border-gray-800 bg-gray-900/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <RefreshCw className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium text-white">Refresh Resources</p>
              <p className="text-xs text-gray-400">Reload all scripts</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="font-medium text-white">Server Announce</p>
              <p className="text-xs text-gray-400">Send global message</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-white">View Logs</p>
              <p className="text-xs text-gray-400">Console output</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Server className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="font-medium text-white">txAdmin</p>
              <p className="text-xs text-gray-400">Open panel</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Resources List */}
      <motion.div
        className="rounded-xl border border-gray-800 bg-gray-900/50 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">Active Resources</h3>
            {resourcesData?.success && (
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  {startedCount}
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <XCircle className="h-3 w-3" />
                  {stoppedCount}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search resources..."
                value={resourceSearch}
                onChange={(e) => setResourceSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-48"
              />
            </div>
            <button
              onClick={() => refetchResources()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {resourcesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : !resourcesData?.success || !resourcesData.resources?.length ? (
          <div className="text-gray-500 text-center py-8">
            <Wifi className="h-8 w-8 mx-auto mb-3 animate-pulse" />
            <p>Waiting on data stream</p>
            <p className="text-sm mt-1 text-gray-600">
              {resourcesData?.error || 'Resource list will populate when bridge is connected'}
            </p>
            <p className="text-xs mt-2 text-gray-700">Restart blkms_admin_bridge in txAdmin</p>
          </div>
        ) : (
          <div className="grid gap-2 max-h-[400px] overflow-y-auto">
            {filteredResources.map((resource) => (
              <div
                key={resource.name}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-white font-mono">{resource.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      resource.state === 'started'
                        ? 'bg-green-500/20 text-green-400'
                        : resource.state === 'stopped'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {resource.state}
                  </span>
                  <button
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title={resource.state === 'started' ? 'Restart resource' : 'Start resource'}
                  >
                    <RefreshCw className="h-3 w-3 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
            {filteredResources.length === 0 && resourceSearch && (
              <div className="text-center py-4 text-gray-500">
                No resources matching "{resourceSearch}"
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
