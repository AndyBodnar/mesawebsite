'use client'

import './staff.css'
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
  Loader2,
  LogIn,
  Ban,
} from 'lucide-react'

type StaffRole = 'owner' | 'admin' | 'staff' | 'user'

const navigation = [
  { name: 'Dashboard', href: '/staff', icon: LayoutDashboard, minRole: 'staff' as StaffRole },
  { name: 'Players', href: '/staff/players', icon: Users, minRole: 'staff' as StaffRole },
  { name: 'Logs', href: '/staff/logs', icon: ScrollText, minRole: 'staff' as StaffRole },
  { name: 'Live Map', href: '/staff/map', icon: Map, minRole: 'staff' as StaffRole },
  { name: 'Bans & Warns', href: '/staff/moderation', icon: Ban, minRole: 'admin' as StaffRole },
  { name: 'Server', href: '/staff/server', icon: Server, minRole: 'admin' as StaffRole },
  { name: 'Admins', href: '/staff/admins', icon: Shield, minRole: 'owner' as StaffRole },
  { name: 'Settings', href: '/staff/settings', icon: Settings, minRole: 'owner' as StaffRole },
]

const roleHierarchy: Record<StaffRole, number> = { user: 0, staff: 1, admin: 2, owner: 3 }
const hasAccess = (userRole: StaffRole, minRole: StaffRole) => roleHierarchy[userRole] >= roleHierarchy[minRole]
const getRoleLabel = (r: StaffRole) => ({ owner: 'OWNER', admin: 'ADMIN', staff: 'STAFF', user: 'USER' }[r])

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="staff-loading">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="staff-loading">
        <div className="staff-auth-card">
          <Shield className="w-16 h-16 mx-auto mb-6" style={{ color: '#b1121c' }} />
          <h1>Staff Panel Access</h1>
          <p>Login with Discord to access the staff panel.</p>
          <button onClick={() => signIn('discord')} className="staff-login-btn">
            <LogIn className="w-5 h-5" /> Login with Discord
          </button>
        </div>
      </div>
    )
  }

  const staffRole = ((session.user as any)?.staffRole as StaffRole) || 'user'

  if (!hasAccess(staffRole, 'staff')) {
    return (
      <div className="staff-loading">
        <div className="staff-auth-card">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6" style={{ color: '#ff4455' }} />
          <h1>Access Denied</h1>
          <p>You need a staff role in Discord to access this panel.</p>
          <Link href="/" className="staff-home-btn">Return Home</Link>
        </div>
      </div>
    )
  }

  const filteredNav = navigation.filter(item => hasAccess(staffRole, item.minRole))

  return (
    <div className="staff-app">
      <aside className="staff-rail">
        <div className="staff-sigil" title="Black Mesa"><span>BM</span></div>
        {filteredNav.slice(0, 4).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={`staff-railbtn ${isActive ? "active" : ""}`} title={item.name}>
              <item.icon className="w-4 h-4" />
            </Link>
          )
        })}
        <div style={{ flex: 1 }} />
        <div className="staff-dot" title="Secure link" />
      </aside>

      <aside className={`staff-side ${sidebarOpen ? "staff-side-open" : ""}`}>
        <div className="staff-brand">
          <div className="staff-brand-name">
            <span className="glitch">Black</span> <b className="glitch" style={{ color: '#b1121c' }}>Mesa</b>
          </div>
          <div className="staff-brand-tag">STAFF NODE</div>
        </div>
        
        <nav className="staff-menu">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={`staff-menu-item ${isActive ? "active" : ""}`}>
                <div className="staff-menu-left">
                  <item.icon className="w-4 h-4 opacity-50" />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </nav>
        <div className="staff-side-footer">
          <div className="staff-identity">
            <div className="staff-identity-info">
              <div className="staff-identity-name">{session.user?.name}</div>
              <div className="staff-identity-role">ROLE: {getRoleLabel(staffRole)}</div>
            </div>
            <div className="staff-identity-badge">
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-full h-full rounded-xl object-cover" />
              ) : 'BM'}
            </div>
          </div>
        </div>
        <button className="staff-side-close" onClick={() => setSidebarOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </aside>

      {sidebarOpen && <div className="staff-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="staff-main">
        <div className="staff-top">
          <button className="staff-mobile-menu" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="staff-tabs">
            {filteredNav.slice(0, 7).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className={`staff-tab ${isActive ? "active" : ""}`}>
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className="staff-statusbar">
            <div className="staff-chip"><span className="staff-chip-dot" /><b>SERVER</b> ONLINE</div>
            <div className="staff-chip red">UPLINK <b>LINKED</b></div>
          </div>
        </div>
        {children}
      </main>
    </div>
  )
}
