'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Search,
  Plus,
  MoreVertical,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Wifi,
} from 'lucide-react'

// This would come from API
const mockAdmins: any[] = []

export default function StaffAdminsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading] = useState(false)

  const admins = mockAdmins.filter(admin =>
    admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.discordId?.includes(searchQuery)
  )

  const hasData = admins.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Management</h1>
          <p className="text-gray-400">Manage admin permissions and roles</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          Add Admin
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or Discord ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Role Overview */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Super Admins</span>
          </div>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Admins</span>
          </div>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Moderators</span>
          </div>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
        <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Support</span>
          </div>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
      </motion.div>

      {/* Admin List */}
      <motion.div
        className="rounded-xl border border-gray-800 bg-gray-900/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Staff Members</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Wifi className="h-8 w-8 mb-3 animate-pulse" />
            <p className="text-lg">Waiting on data stream</p>
            <p className="text-sm mt-1 text-gray-600">Staff members will appear when synced</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {admins.map((admin, index) => (
              <div key={admin.id || index} className="p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {admin.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="font-medium text-white">{admin.name}</p>
                    <p className="text-sm text-gray-400">{admin.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {admin.online ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-400">
                      {admin.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
