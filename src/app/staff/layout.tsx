'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  ScrollText,
  Map,
  Shield,
  Settings,
  Server,
  AlertTriangle,
  Menu,
  X,
  ChevronRight,
  Loader2,
  LogIn,
} from 'lucide-react'

type StaffRole = 'owner' | 'admin' | 'staff' | 'user'

const navigation = [
  { name: 'Dashboard', href: '/staff', icon: LayoutDashboard, minRole: 'staff' as StaffRole },
  { name: 'Players', href: '/staff/players', icon: Users, minRole: 'staff' as StaffRole },
  { name: 'Logs', href: '/staff/logs', icon: ScrollText, minRole: 'staff' as StaffRole },
  { name: 'Live Map', href: '/staff/map', icon: Map, minRole: 'staff' as StaffRole },
  { name: 'Bans & Warns', href: '/staff/moderation', icon: AlertTriangle, minRole: 'admin' as StaffRole },
  { name: 'Server', href: '/staff/server', icon: Server, minRole: 'admin' as StaffRole },
  { name: 'Admins', href: '/staff/admins', icon: Shield, minRole: 'owner' as StaffRole },
  { name: 'Settings', href: '/staff/settings', icon: Settings, minRole: 'owner' as StaffRole },
]

const roleHierarchy: Record<StaffRole, number> = { user: 0, staff: 1, admin: 2, owner: 3 }
const hasAccess = (userRole: StaffRole, minRole: StaffRole) => roleHierarchy[userRole] >= roleHierarchy[minRole]
const getRoleLabel = (r: StaffRole) => ({ owner: 'Owner', admin: 'Admin', staff: 'Staff', user: 'User' }[r])
const getRoleColor = (r: StaffRole) => ({ owner: 'text-yellow-400', admin: 'text-red-400', staff: 'text-blue-400', user: 'text-gray-400' }[r])

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Staff Panel Access</h1>
          <p className="text-gray-400 mb-6">Login with Discord to access the staff panel.</p>
          <button onClick={() => signIn('discord')} className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg">
            <LogIn className="w-5 h-5" /> Login with Discord
          </button>
        </div>
      </div>
    )
  }

  const staffRole = ((session.user as any)?.staffRole as StaffRole) || 'user'

  if (!hasAccess(staffRole, 'staff')) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need a staff role in Discord to access this panel.</p>
          <Link href="/" className="inline-flex px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg">Return Home</Link>
        </div>
      </div>
    )
  }

  const filteredNav = navigation.filter(item => hasAccess(staffRole, item.minRole))

  return (
    <div className="min-h-screen bg-gray-950">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link href="/staff" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
            <span className="font-bold text-white">Staff Panel</span>
          </Link>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-1">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
                <item.icon className="w-5 h-5" /><span>{item.name}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div><p className="text-sm font-medium text-white">Server Online</p></div>
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
          <button className="lg:hidden text-gray-400 mr-4" onClick={() => setSidebarOpen(true)}><Menu className="w-6 h-6" /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{session.user?.name}</p>
              <p className={`text-xs ${getRoleColor(staffRole)}`}>{getRoleLabel(staffRole)}</p>
            </div>
            {session.user?.image ? <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-purple-500 rounded-full" />}
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
