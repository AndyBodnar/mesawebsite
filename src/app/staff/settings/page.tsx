'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
  Save,
  RefreshCw,
  Wifi,
} from 'lucide-react'

export default function StaffSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    darkMode: true,
    compactView: false,
  })

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Configure staff panel preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <motion.div
          className="rounded-xl border border-gray-800 bg-gray-900/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Settings className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">General</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Auto Refresh</p>
                <p className="text-sm text-gray-400">Automatically refresh dashboard data</p>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, autoRefresh: !s.autoRefresh }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.autoRefresh ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {settings.autoRefresh && (
              <div>
                <label className="text-sm text-gray-400">Refresh Interval (seconds)</label>
                <input
                  type="number"
                  value={settings.refreshInterval}
                  onChange={(e) => setSettings(s => ({ ...s, refreshInterval: parseInt(e.target.value) || 30 }))}
                  min={5}
                  max={300}
                  className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Compact View</p>
                <p className="text-sm text-gray-400">Use smaller UI elements</p>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, compactView: !s.compactView }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.compactView ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.compactView ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="rounded-xl border border-gray-800 bg-gray-900/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Bell className="h-5 w-5 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Enable Notifications</p>
                <p className="text-sm text-gray-400">Receive alerts for important events</p>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, notifications: !s.notifications }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.notifications ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-300">Player reports</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-300">Server warnings</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-300">Player connections</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* API Settings */}
        <motion.div
          className="rounded-xl border border-gray-800 bg-gray-900/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Database className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">API Connection</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">API URL</label>
              <input
                type="text"
                value={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}
                disabled
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-green-400">Connected</span>
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          className="rounded-xl border border-gray-800 bg-gray-900/50 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Session Timeout (minutes)</label>
              <input
                type="number"
                defaultValue={60}
                min={5}
                max={480}
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <Key className="h-4 w-4" />
              Regenerate API Key
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
