// Socket hooks - real-time updates
export {
  useSocket,
  useLiveMap,
  useLiveLogs,
  useStaffPanel,
  useLoadingScreen,
} from './useSocket'

// API hooks - REST calls
export {
  useLogs,
  useLogsByCategory,
  useLogStats,
  useOnlinePlayers,
  usePlayer,
  usePlayerHistory,
  usePlayerSearch,
  useMapPlayers,
  useServerInfo,
  useMapBlips,
  useLoadingConfig,
  useActiveLoading,
  useDashboard,
  // Server hooks
  useResources,
  useServerHealth,
  // Moderation hooks (Wasabi)
  useBans,
  useWarns,
  useAuditLog,
  // txAdmin hooks
  useTxPlayers,
  useTxActions,
  useTxBans,
  useTxWarns,
  useTxAdmins,
  useTxStats,
} from './useApi'
