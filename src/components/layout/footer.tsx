"use client";

import Link from "next/link";
import {
  MessageSquare,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  FileText,
  HelpCircle,
  Users,
  ShoppingBag,
  Sparkles,
  Shield,
} from "lucide-react";

const footerLinks = {
  community: [
    { href: "/forums", label: "Forums", icon: MessageSquare },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
  ],
  resources: [
    { href: "/rules", label: "Server Rules", icon: BookOpen },
    { href: "/tutorials", label: "Tutorials", icon: FileText },
    { href: "/apply", label: "Applications", icon: Users },
    { href: "/suggestions", label: "Suggestions", icon: Sparkles },
  ],
  support: [
    { href: "/tickets", label: "Support Tickets", icon: HelpCircle },
    { href: "https://discord.gg/blackmesarp", label: "Discord", external: true },
    { href: "/store", label: "Donate", icon: ShoppingBag },
    { href: "/staff", label: "Staff Panel", icon: Shield },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
                <div className="absolute inset-0 bg-[radial-gradient(18px_18px_at_30%_30%,rgba(255,255,255,0.16),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(16px_14px_at_70%_20%,rgba(255,45,45,0.35),transparent_55%)]" />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight font-[var(--sig-font)]">
                  Black Mesa
                </div>
                <div className="inline-flex rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.32em] text-white/60">
                  RP
                </div>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Experience immersive roleplay in Los Santos. Custom systems, active staff, and a live community
              pushing stories every night.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="https://discord.gg/blackmesarp"
                target="_blank"
                className="glass-button rounded-xl p-3 text-white/70 transition hover:text-white"
                aria-label="Discord"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </Link>
              <Link
                href="https://www.tiktok.com/@blackmesarp"
                target="_blank"
                className="glass-button rounded-xl p-3 text-white/70 transition hover:text-white"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.28em] text-white/60">Community</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
                  >
                    <link.icon className="h-4 w-4 text-white/40 group-hover:text-white" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.28em] text-white/60">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
                  >
                    <link.icon className="h-4 w-4 text-white/40 group-hover:text-white" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.28em] text-white/60">Support</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    className="group flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
                  >
                    {link.icon && <link.icon className="h-4 w-4 text-white/40 group-hover:text-white" />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.22em] text-white/40 md:flex-row md:items-center md:justify-between">
          <p>Black Mesa RP {new Date().getFullYear()} All rights reserved</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/rules" className="hover:text-white">Rules</Link>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-white/30">
          Built by{" "}
          <Link
            href="https://azdevops.io"
            target="_blank"
            className="text-white/50 hover:text-white transition"
          >
            DevCollective
          </Link>
        </div>
      </div>
    </footer>
  );
}
