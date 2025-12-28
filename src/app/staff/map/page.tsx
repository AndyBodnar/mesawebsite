'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  RefreshCw,
  Users,
  MapPin,
  Wifi,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Flame,
} from 'lucide-react'
import { useMapPlayers, useServerInfo } from '@/hooks'
import { cn } from '@/lib/utils'

interface Player {
  id: number
  name: string
  x: number
  y: number
  z: number
  heading?: number
  health?: number
  armor?: number
  job?: string | null
  ping?: number
}

interface HeatPoint {
  x: number
  y: number
  intensity: number
}

// GTA V map bounds (approximate)
const MAP_BOUNDS = {
  minX: -4000,
  maxX: 4500,
  minY: -4000,
  maxY: 8000,
}

// Convert GTA coordinates to map percentage
function coordToPercent(x: number, y: number): { left: number; top: number } {
  const left = ((x - MAP_BOUNDS.minX) / (MAP_BOUNDS.maxX - MAP_BOUNDS.minX)) * 100
  const top = 100 - ((y - MAP_BOUNDS.minY) / (MAP_BOUNDS.maxY - MAP_BOUNDS.minY)) * 100
  return { left: Math.max(0, Math.min(100, left)), top: Math.max(0, Math.min(100, top)) }
}

// Calculate heat map points from player positions
function calculateHeatMap(players: Player[]): HeatPoint[] {
  if (players.length === 0) return []

  const grid: Map<string, { x: number; y: number; count: number }> = new Map()

  // Group players into grid cells
  players.forEach(player => {
    if (player.x === 0 && player.y === 0) return // Skip players without position data

    const gridX = Math.floor(player.x / 500) * 500
    const gridY = Math.floor(player.y / 500) * 500
    const key = `${gridX},${gridY}`

    const existing = grid.get(key)
    if (existing) {
      existing.count++
    } else {
      grid.set(key, { x: gridX + 250, y: gridY + 250, count: 1 })
    }
  })

  // Convert to heat points with intensity
  const maxCount = Math.max(...Array.from(grid.values()).map(g => g.count), 1)

  return Array.from(grid.values()).map(g => ({
    x: g.x,
    y: g.y,
    intensity: g.count / maxCount,
  }))
}

export default function StaffMapPage() {
  const { data: playersData, loading: playersLoading, refetch } = useMapPlayers()
  const { data: serverInfo } = useServerInfo()
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const players: Player[] = playersData?.players || []
  const hasPlayers = players.length > 0
  const dataSource = (playersData as any)?.source || 'unknown'

  // Calculate heat map
  const heatPoints = useMemo(() => calculateHeatMap(players), [players])

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refetch()
    setTimeout(() => setIsRefreshing(false), 500)
  }, [refetch])

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!mapContainerRef.current) return

    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(err => {
        console.error('Fullscreen error:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3))
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5))
  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Center on player
  const centerOnPlayer = (player: Player) => {
    const { left, top } = coordToPercent(player.x, player.y)
    setPan({ x: 50 - left, y: 50 - top })
    setZoom(2)
    setSelectedPlayer(player)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Map</h1>
          <p className="text-gray-400">
            {players.length} players online
            {dataSource === 'live' && ' - Live tracking'}
            {dataSource === 'basic' && ' - Waiting for position data'}
            {dataSource === 'cached' && ' - Cached data'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
            dataSource === 'live' ? 'bg-green-500/10 text-green-400' :
            dataSource === 'basic' ? 'bg-yellow-500/10 text-yellow-400' :
            'bg-red-500/10 text-red-400'
          )}>
            <div className={cn(
              'w-2 h-2 rounded-full',
              dataSource === 'live' ? 'bg-green-500 animate-pulse' :
              dataSource === 'basic' ? 'bg-yellow-500' :
              'bg-red-500'
            )} />
            {dataSource === 'live' ? 'Live' : dataSource === 'basic' ? 'No Positions' : 'Offline'}
          </div>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              showHeatmap
                ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            )}
            title="Toggle Heatmap"
          >
            <Flame className="h-4 w-4" />
            Hotspots
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Map Container */}
        <motion.div
          ref={mapContainerRef}
          className={cn(
            'relative rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden',
            isFullscreen && 'rounded-none border-none'
          )}
          style={{ minHeight: isFullscreen ? '100vh' : '600px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-900/90 hover:bg-gray-800 text-white rounded-lg border border-gray-700 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-900/90 hover:bg-gray-800 text-white rounded-lg border border-gray-700 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-900/90 hover:bg-gray-800 text-white rounded-lg border border-gray-700 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleResetView}
              className="p-2 bg-gray-900/90 hover:bg-gray-800 text-white rounded-lg border border-gray-700 transition-colors"
              title="Reset View"
            >
              <Crosshair className="h-4 w-4" />
            </button>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute bottom-4 left-4 z-20 px-2 py-1 bg-gray-900/90 text-gray-400 text-xs rounded border border-gray-700">
            {Math.round(zoom * 100)}%
          </div>

          {playersLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                <p className="text-gray-400">Loading map data...</p>
              </div>
            </div>
          ) : (
            <div
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              style={{
                transform: `scale(${zoom}) translate(${pan.x}%, ${pan.y}%)`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease-out',
              }}
            >
              {/* Map Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(/map/gtav-map.jpg)' }}
              />

              {/* Heat Map Overlay */}
              {showHeatmap && heatPoints.length > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <radialGradient id="heatGradient">
                      <stop offset="0%" stopColor="rgba(220, 38, 38, 0.6)" />
                      <stop offset="50%" stopColor="rgba(220, 38, 38, 0.3)" />
                      <stop offset="100%" stopColor="rgba(220, 38, 38, 0)" />
                    </radialGradient>
                  </defs>
                  {heatPoints.map((point, i) => {
                    const { left, top } = coordToPercent(point.x, point.y)
                    const size = 8 + point.intensity * 12 // Size based on intensity
                    return (
                      <circle
                        key={i}
                        cx={`${left}%`}
                        cy={`${top}%`}
                        r={`${size}%`}
                        fill="url(#heatGradient)"
                        opacity={0.4 + point.intensity * 0.4}
                      />
                    )
                  })}
                </svg>
              )}

              {/* Player Markers */}
              {players.map((player, index) => {
                // Skip players without valid position
                if (player.x === 0 && player.y === 0) return null

                const { left, top } = coordToPercent(player.x, player.y)
                const isSelected = selectedPlayer?.id === player.id

                return (
                  <div
                    key={player.id || index}
                    className={cn(
                      'absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200',
                      isSelected ? 'z-10' : 'z-5'
                    )}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    onClick={() => setSelectedPlayer(player)}
                  >
                    {/* Player dot */}
                    <div
                      className={cn(
                        'rounded-full border-2 transition-all',
                        isSelected
                          ? 'w-5 h-5 bg-yellow-500 border-white shadow-lg shadow-yellow-500/50'
                          : 'w-3 h-3 bg-blue-500 border-white hover:scale-150'
                      )}
                    />
                    {/* Player name on hover/select */}
                    {isSelected && (
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900/95 text-white text-xs px-2 py-1 rounded border border-gray-700">
                        {player.name}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* No Players Message */}
          {!playersLoading && !hasPlayers && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-900/80">
              <Wifi className="h-12 w-12 mb-4 animate-pulse" />
              <p className="text-lg">Waiting on data stream</p>
              <p className="text-sm mt-1 text-gray-600">Player positions will appear when players connect</p>
            </div>
          )}
        </motion.div>

        {/* Player List Sidebar */}
        <motion.div
          className={cn(
            'rounded-xl border border-gray-800 bg-gray-900/50 p-4',
            isFullscreen && 'hidden'
          )}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Online Players
            <span className="ml-auto text-sm font-normal text-gray-400">{players.length}</span>
          </h3>

          {!hasPlayers ? (
            <p className="text-gray-500 text-sm">No players online</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {players.map((player, index) => {
                const hasPosition = player.x !== 0 || player.y !== 0

                return (
                  <div
                    key={player.id || index}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer transition-colors',
                      selectedPlayer?.id === player.id
                        ? 'bg-blue-600/20 border border-blue-500/50'
                        : 'bg-gray-800/50 hover:bg-gray-800'
                    )}
                    onClick={() => hasPosition ? centerOnPlayer(player) : setSelectedPlayer(player)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{player.name || 'Unknown'}</span>
                      <div className="flex items-center gap-2">
                        {!hasPosition && (
                          <span className="text-xs text-yellow-500" title="No position data">
                            <MapPin className="h-3 w-3" />
                          </span>
                        )}
                        <span className="text-xs text-gray-400">ID: {player.id}</span>
                      </div>
                    </div>
                    {player.job && (
                      <span className="text-xs text-blue-400">{player.job}</span>
                    )}
                    {player.ping !== undefined && (
                      <span className="text-xs text-gray-500 ml-2">{player.ping}ms</span>
                    )}
                  </div>
                )
              })}
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
                {selectedPlayer.health !== undefined && (
                  <p className="text-gray-400">
                    Health: <span className="text-green-400">{selectedPlayer.health}%</span>
                    {selectedPlayer.armor !== undefined && selectedPlayer.armor > 0 && (
                      <span className="text-blue-400 ml-2">+{selectedPlayer.armor} armor</span>
                    )}
                  </p>
                )}
                {selectedPlayer.ping !== undefined && (
                  <p className="text-gray-400">Ping: <span className="text-white">{selectedPlayer.ping}ms</span></p>
                )}
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

          {/* Heatmap Legend */}
          {showHeatmap && heatPoints.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                <Flame className="h-4 w-4 text-red-500" />
                Hotspot Legend
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-4 h-4 rounded-full bg-red-500/30" />
                <span>Low activity</span>
                <div className="w-4 h-4 rounded-full bg-red-500/60 ml-2" />
                <span>High activity</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
