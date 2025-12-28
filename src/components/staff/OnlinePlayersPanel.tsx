'use client'

import { useState } from 'react'
import { Users, Search, MoreVertical, Shield, Ban, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Player {
  id: number
  name: string
  identifier: string
  ping: number
  playtime?: string
  job?: string
}

interface OnlinePlayersPanelProps {
  players?: Player[]
  loading?: boolean
  onPlayerAction?: (playerId: number, action: string) => void
}

export function OnlinePlayersPanel({ players, loading, onPlayerAction }: OnlinePlayersPanelProps) {
  const [search, setSearch] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)

  const filteredPlayers = players?.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.identifier.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900/50">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-white">Online Players</span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-24 mb-1" />
                <div className="h-3 bg-gray-700 rounded w-16" />
              </div>
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
            <Users className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-white">Online Players</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
              {players?.length || 0}
            </span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {filteredPlayers && filteredPlayers.length > 0 ? (
          filteredPlayers.map((player) => (
            <div
              key={player.id}
              className={cn(
                'flex items-center gap-3 p-3 hover:bg-gray-800/50 cursor-pointer border-b border-gray-800/50 last:border-0',
                selectedPlayer === player.id && 'bg-gray-800/50'
              )}
              onClick={() => setSelectedPlayer(selectedPlayer === player.id ? null : player.id)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{player.name}</span>
                  <span className="text-xs text-gray-500">ID: {player.id}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className={cn('px-1.5 py-0.5 rounded', player.ping < 50 ? 'bg-green-500/20 text-green-400' : player.ping < 100 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400')}>
                    {player.ping}ms
                  </span>
                  {player.job && <span>{player.job}</span>}
                </div>
              </div>

              {selectedPlayer === player.id && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onPlayerAction?.(player.id, 'spectate')
                    }}
                    className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                    title="Spectate"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onPlayerAction?.(player.id, 'warn')
                    }}
                    className="p-1.5 hover:bg-yellow-500/20 rounded-lg text-gray-400 hover:text-yellow-400"
                    title="Warn"
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onPlayerAction?.(player.id, 'ban')
                    }}
                    className="p-1.5 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400"
                    title="Ban"
                  >
                    <Ban className="h-4 w-4" />
                  </button>
                </div>
              )}

              {selectedPlayer !== player.id && (
                <MoreVertical className="h-4 w-4 text-gray-500" />
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            {search ? 'No players found matching your search' : 'No players online'}
          </div>
        )}
      </div>
    </div>
  )
}
