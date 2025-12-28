'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Ban,
  AlertTriangle,
  Search,
  Plus,
  X,
  Check,
  Clock,
  User,
  Calendar,
  Shield,
  Trash2,
  Edit,
  ChevronDown,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

// Mock data - replace with real API hooks
const MOCK_BANS = [
  {
    id: '1',
    identifier: 'discord:123456789',
    playerName: 'BadPlayer123',
    reason: 'Repeated RDM and VDM violations',
    duration: 7,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    active: true,
    staffName: 'Admin',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    identifier: 'license:abcdef123456',
    playerName: 'Cheater99',
    reason: 'Using mod menu / cheats',
    duration: 0,
    expiresAt: null,
    active: true,
    staffName: 'SuperAdmin',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

const MOCK_WARNINGS = [
  {
    id: '1',
    identifier: 'discord:987654321',
    playerName: 'NewPlayer',
    reason: 'Breaking RP in city center',
    staffName: 'Moderator',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '2',
    identifier: 'discord:555666777',
    playerName: 'RandomDude',
    reason: 'Fail RP - not valuing life',
    staffName: 'Admin',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

type TabType = 'bans' | 'warnings'

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('bans')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [bans, setBans] = useState(MOCK_BANS)
  const [warnings, setWarnings] = useState(MOCK_WARNINGS)

  const filteredBans = useMemo(() => {
    return bans.filter(ban =>
      ban.playerName?.toLowerCase().includes(search.toLowerCase()) ||
      ban.identifier.toLowerCase().includes(search.toLowerCase()) ||
      ban.reason.toLowerCase().includes(search.toLowerCase())
    )
  }, [bans, search])

  const filteredWarnings = useMemo(() => {
    return warnings.filter(warn =>
      warn.playerName?.toLowerCase().includes(search.toLowerCase()) ||
      warn.identifier.toLowerCase().includes(search.toLowerCase()) ||
      warn.reason.toLowerCase().includes(search.toLowerCase())
    )
  }, [warnings, search])

  const handleUnban = (id: string) => {
    setBans(prev => prev.map(ban =>
      ban.id === id ? { ...ban, active: false } : ban
    ))
  }

  const handleDeleteWarning = (id: string) => {
    setWarnings(prev => prev.filter(warn => warn.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Moderation</h1>
          <p className="text-gray-400">Manage bans, warnings, and player discipline</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add {activeTab === 'bans' ? 'Ban' : 'Warning'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Ban className="h-4 w-4 text-red-500" />
            Active Bans
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {bans.filter(b => b.active).length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="h-4 w-4 text-yellow-500" />
            Temporary Bans
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {bans.filter(b => b.active && b.duration > 0).length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Total Warnings
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {warnings.length}
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Shield className="h-4 w-4 text-purple-500" />
            Permanent Bans
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {bans.filter(b => b.active && b.duration === 0).length}
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <motion.div
        className="rounded-xl border border-gray-800 bg-gray-900/50 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('bans')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors',
                activeTab === 'bans'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <Ban className="h-4 w-4" />
              Bans
            </button>
            <button
              onClick={() => setActiveTab('warnings')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded text-sm transition-colors',
                activeTab === 'warnings'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              Warnings
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by player, identifier, or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {activeTab === 'bans' ? (
          <div className="divide-y divide-gray-800">
            {filteredBans.length > 0 ? (
              filteredBans.map((ban) => (
                <div
                  key={ban.id}
                  className={cn(
                    'p-4 hover:bg-gray-800/50 transition-colors',
                    !ban.active && 'opacity-50'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'p-2 rounded-lg',
                      ban.duration === 0 ? 'bg-red-500/10' : 'bg-yellow-500/10'
                    )}>
                      <Ban className={cn(
                        'h-5 w-5',
                        ban.duration === 0 ? 'text-red-500' : 'text-yellow-500'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white">{ban.playerName}</span>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                          {ban.identifier}
                        </span>
                        {ban.duration === 0 ? (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                            Permanent
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                            {ban.duration} days
                          </span>
                        )}
                        {!ban.active && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                            Unbanned
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mt-1">{ban.reason}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          By {ban.staffName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(ban.createdAt, { addSuffix: true })}
                        </span>
                        {ban.expiresAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Expires {format(ban.expiresAt, 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                    {ban.active && (
                      <button
                        onClick={() => handleUnban(ban.id)}
                        className="px-3 py-1.5 text-sm bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                      >
                        Unban
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Ban className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No bans found
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filteredWarnings.length > 0 ? (
              filteredWarnings.map((warn) => (
                <div
                  key={warn.id}
                  className="p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white">{warn.playerName}</span>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                          {warn.identifier}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-1">{warn.reason}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          By {warn.staffName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(warn.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteWarning(warn.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No warnings found
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Add {activeTab === 'bans' ? 'Ban' : 'Warning'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Player Identifier</label>
                <input
                  type="text"
                  placeholder="discord:123456789 or license:abc123"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Reason</label>
                <textarea
                  placeholder="Reason for action..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>
              {activeTab === 'bans' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duration</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                    <option value="0">Permanent</option>
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                    <option value="30">30 Days</option>
                  </select>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  {activeTab === 'bans' ? 'Ban Player' : 'Warn Player'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
