'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Users, MapPin, Wifi } from 'lucide-react'
import { useMapPlayers, useServerInfo } from '@/hooks'

export default function StaffMapPage() {
  const { data: playersData, loading: playersLoading, refetch } = useMapPlayers()
  const { data: serverInfo } = useServerInfo()
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)

  const players = playersData?.players || []
  const hasPlayers = players.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Map</h1>
          <p className="text-gray-400">
            {players.length} players online • Real-time tracking
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Map Container */}
        <motion.div
          className="relative rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden"
          style={{ minHeight: '600px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {playersLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : !hasPlayers ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <Wifi className="h-12 w-12 mb-4 animate-pulse" />
              <p className="text-lg">Waiting on data stream</p>
              <p className="text-sm mt-1 text-gray-600">Player positions will appear when players connect</p>
            </div>
          ) : (
            <div className="absolute inset-0 bg-[url('/map/gtav-map.jpg')] bg-cover bg-center">
              {/* Player markers would go here */}
              {players.map((player: any, index: number) => (
                <div
                  key={player.id || index}
                  className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform"
                  style={{
                    left: `${((player.x || 0) + 4000) / 80}%`,
                    top: `${100 - ((player.y || 0) + 4000) / 80}%`,
                  }}
                  onClick={() => setSelectedPlayer(player)}
                  title={player.name}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Player List Sidebar */}
        <motion.div
          className="rounded-xl border border-gray-800 bg-gray-900/50 p-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Online Players
          </h3>

          {!hasPlayers ? (
            <p className="text-gray-500 text-sm">No players online</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {players.map((player: any, index: number) => (
                <div
                  key={player.id || index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPlayer?.id === player.id
                      ? 'bg-blue-600/20 border border-blue-500/50'
                      : 'bg-gray-800/50 hover:bg-gray-800'
                  }`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{player.name || 'Unknown'}</span>
                    <span className="text-xs text-gray-400">ID: {player.id}</span>
                  </div>
                  {player.job && (
                    <span className="text-xs text-blue-400">{player.job}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Selected Player Info */}
          {selectedPlayer && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-sm font-medium text-white mb-2">Selected Player</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">Name: <span className="text-white">{selectedPlayer.name}</span></p>
                <p className="text-gray-400">ID: <span className="text-white">{selectedPlayer.id}</span></p>
                {selectedPlayer.job && (
                  <p className="text-gray-400">Job: <span className="text-white">{selectedPlayer.job}</span></p>
                )}
                <p className="text-gray-400">
                  Position: <span className="text-white">
                    {selectedPlayer.x?.toFixed(0)}, {selectedPlayer.y?.toFixed(0)}, {selectedPlayer.z?.toFixed(0)}
                  </span>
                </p>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                  Teleport To
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                  Spectate
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
