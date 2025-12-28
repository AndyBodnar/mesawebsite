'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Shield,
  AlertTriangle,
  MessageSquare,
  Eye,
  Ban,
  Clock,
  Wifi,
  X,
} from 'lucide-react'
import { useOnlinePlayers } from '@/hooks'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Send action to bridge via API
async function sendPlayerAction(action: string, playerId: number, data?: Record<string, any>) {
  try {
    const res = await fetch(`${API_URL}/api/server/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, playerId, ...data })
    })
    return res.json()
  } catch (error) {
    console.error('Action failed:', error)
    return { success: false, error: 'Failed to send action' }
  }
}

export default function PlayersPage() {
  const { data: playersData, loading, isRefreshing, refetch } = useOnlinePlayers()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterJob, setFilterJob] = useState<string | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [actionModal, setActionModal] = useState<'message' | 'warn' | 'kick' | 'ban' | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const handleAction = async (action: string) => {
    if (!selectedPlayer) return
    setActionLoading(true)

    const result = await sendPlayerAction(action, selectedPlayer.id, {
      reason: actionReason,
      playerName: selectedPlayer.name
    })

    setActionLoading(false)
    if (result.success) {
      setActionModal(null)
      setSelectedPlayer(null)
      setActionReason('')
      refetch()
    } else {
      alert(result.error || 'Action failed')
    }
  }

  const players = useMemo(() => {
    if (!playersData?.players) return []
    let filtered = playersData.players

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((p: any) =>
        p.name?.toLowerCase().includes(query) ||
        p.characterName?.toLowerCase().includes(query) ||
        p.licenseId?.toLowerCase().includes(query)
      )
    }

    if (filterJob) {
      filtered = filtered.filter((p: any) => p.job === filterJob)
    }

    return filtered
  }, [playersData, searchQuery, filterJob])

  const jobs = useMemo(() => {
    if (!playersData?.players) return []
    const jobSet = new Set(playersData.players.map((p: any) => p.job).filter(Boolean))
    return Array.from(jobSet) as string[]
  }, [playersData])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Players</h1>
          <p className="text-gray-400">
            {playersData?.count || 0} of {playersData?.maxPlayers || 64} players online
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or license..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        {jobs.length > 0 && (
          <select
            value={filterJob || ''}
            onChange={(e) => setFilterJob(e.target.value || null)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job} value={job}>{job}</option>
            ))}
          </select>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Empty State */}
      {!loading && players.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Players Online</h3>
          <p className="text-gray-400">
            {searchQuery ? 'No players match your search.' : 'The server is currently empty.'}
          </p>
        </div>
      )}

      {/* Players Grid */}
      {!loading && players.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {players.map((player: any, index: number) => (
            <motion.div
              key={player.id || player.licenseId || index}
              className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-white">
                    {player.characterName || player.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    ID: {player.id || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Wifi className="h-4 w-4 text-green-400" />
                  <span className="text-gray-400">{player.ping || 0}ms</span>
                </div>
              </div>

              {player.job && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs">
                    {player.job}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <Clock className="h-4 w-4" />
                <span>Playtime: {player.totalPlaytime || player.playtime || '0h'}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                <button
                  onClick={() => {
                    setSelectedPlayer(player)
                    sendPlayerAction('spectate', player.id)
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  Spectate
                </button>
                <button
                  onClick={() => {
                    setSelectedPlayer(player)
                    setActionModal('message')
                  }}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </button>
                <button
                  onClick={() => {
                    setSelectedPlayer(player)
                    setActionModal('warn')
                  }}
                  className="p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 transition-colors"
                  title="Warn Player"
                >
                  <AlertTriangle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedPlayer(player)
                    setActionModal('kick')
                  }}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                  title="Kick Player"
                >
                  <Ban className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Player History Section */}
      <motion.div
        className="rounded-xl border border-gray-800 bg-gray-900/50 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Player Sessions</h3>
        <p className="text-gray-400 text-sm">
          Player session history will appear here once players connect to the server.
        </p>
      </motion.div>

      {/* Action Modal */}
      {actionModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md mx-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white capitalize">
                {actionModal} - {selectedPlayer.name}
              </h3>
              <button
                onClick={() => {
                  setActionModal(null)
                  setSelectedPlayer(null)
                  setActionReason('')
                }}
                className="p-1 hover:bg-gray-800 rounded"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  {actionModal === 'message' ? 'Message' : 'Reason'}
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={actionModal === 'message' ? 'Enter message to send...' : 'Enter reason...'}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setActionModal(null)
                    setSelectedPlayer(null)
                    setActionReason('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAction(actionModal)}
                  disabled={actionLoading || !actionReason.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                    actionModal === 'message'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : actionModal === 'warn'
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {actionLoading ? 'Sending...' : actionModal === 'message' ? 'Send' : 'Confirm'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
