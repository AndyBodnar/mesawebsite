"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  LogOut,
  User,
  Settings,
  Shield,
  MessageSquare,
  Newspaper,
  ShoppingBag,
  Map,
  Users,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/forums", label: "Forums", icon: MessageSquare },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/store", label: "Store", icon: ShoppingBag },
  { href: "/map", label: "Live Map", icon: Map },
  { href: "/characters", label: "Characters", icon: Users },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/staff", label: "Staff", icon: Shield },
];

const navContainer = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const navItem = {
  hidden: { opacity: 0, y: -6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.05, duration: 0.3 },
  }),
};

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <motion.header className="topbar" variants={navContainer} initial="hidden" animate="visible">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          <div className="logo" aria-hidden="true" />
          <div className="brandname">
            <span className="bm font-signature">Black Mesa</span>
            <span className="rp">RP</span>
          </div>
        </Link>

        <nav className="nav hidden lg:flex" aria-label="Primary">
          {navLinks.map((link, index) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <motion.div
                key={link.href}
                custom={index}
                variants={navItem}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href={link.href} className={cn(isActive && "active") + ""}>
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="right-actions">
          <motion.div className="pill hidden md:inline-flex" whileHover={{ scale: 1.02 }}>
            <span className="pulse-dot" />
            Server Online
          </motion.div>

          {status === "loading" ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="btn"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                    <AvatarFallback>{session.user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{session.user.name}</span>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{session.user.name}</span>
                    <span className="text-xs text-muted-foreground">{session.user.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/profile/${session.user.id}`} className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {(session.user.role === "ADMIN" || session.user.role === "SUPERADMIN") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer text-red-400">
                      <Link href="/staff" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Staff Panel
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-red-400 focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.button
              className="btn"
              onClick={() => signIn("discord")}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </motion.button>
          )}

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <motion.button className="btn" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </motion.button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-80">
              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-4 text-sm uppercase tracking-[0.18em] transition-colors",
                        isActive
                          ? "bg-red-500/15 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
