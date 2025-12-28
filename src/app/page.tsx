"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gamepad2,
  Users,
  Shield,
  Skull,
  Building2,
  Car,
  MessageSquare,
  Calendar,
  ShoppingBag,
  Map,
  ChevronRight,
  Play,
  Zap,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Gamepad2,
    title: "Custom Framework",
    description: "Built on QBox with 100+ custom scripts for unique gameplay you won't find anywhere else.",
  },
  {
    icon: Users,
    title: "Active Community",
    description: "Hundreds of active roleplayers with 24/7 staff support ensuring quality RP.",
  },
  {
    icon: Shield,
    title: "LEO Departments",
    description: "LSPD, BCSO, SAHP with full training programs and realistic procedures.",
  },
  {
    icon: Skull,
    title: "Criminal Enterprises",
    description: "Build your empire with drug operations, heists, and territorial control.",
  },
  {
    icon: Building2,
    title: "Business Ownership",
    description: "Own and operate businesses from car dealerships to nightclubs.",
  },
  {
    icon: Car,
    title: "Custom Vehicles",
    description: "500+ custom vehicles with realistic handling and modifications.",
  },
];

const quickLinks = [
  { icon: MessageSquare, label: "Forums", href: "/forums" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: ShoppingBag, label: "Store", href: "/store" },
  { icon: Map, label: "Live Map", href: "/map" },
];

// Signature SVG Component with sequential letter write animation
function SignatureSVG() {
  // Letters with their x positions (calculated for proper spacing)
  const blackLetters = [
    { char: 'B', x: 10 },
    { char: 'l', x: 130 },
    { char: 'a', x: 195 },
    { char: 'c', x: 310 },
    { char: 'k', x: 410 },
  ];
  const mesaLetters = [
    { char: 'M', x: 560 },
    { char: 'e', x: 730 },
    { char: 's', x: 850 },
    { char: 'a', x: 960 },
  ];

  return (
    <svg
      className="w-full max-w-[760px] h-auto drop-shadow-[0_0_18px_rgba(255,255,255,0.10)]"
      viewBox="0 0 1100 260"
      role="img"
      aria-label="Black Mesa"
    >
      <defs>
        <filter id="rough" x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* Black letters - white fill */}
      {blackLetters.map((letter, i) => (
        <text
          key={`black-${i}`}
          x={letter.x}
          y="160"
          filter="url(#rough)"
          className={`sig-letter sig-letter-${i}`}
          style={{
            fontFamily: 'var(--font-marker), "Permanent Marker", cursive',
            fontSize: '190px',
            fontWeight: 400,
            dominantBaseline: 'middle',
          }}
        >
          {letter.char}
        </text>
      ))}

      {/* Mesa letters - red fill */}
      {mesaLetters.map((letter, i) => (
        <text
          key={`mesa-${i}`}
          x={letter.x}
          y="160"
          filter="url(#rough)"
          className={`sig-letter sig-letter-mesa sig-letter-${i + 5}`}
          style={{
            fontFamily: 'var(--font-marker), "Permanent Marker", cursive',
            fontSize: '190px',
            fontWeight: 400,
            dominantBaseline: 'middle',
          }}
        >
          {letter.char}
        </text>
      ))}

      {/* Ink splatter */}
      <g className="splatter" style={{ filter: 'drop-shadow(0 0 14px rgba(255,255,255,0.10))' }}>
        <circle cx="200" cy="210" r="7" fill="rgba(245,247,255,0.92)" />
        <circle cx="240" cy="228" r="4" fill="rgba(245,247,255,0.75)" />
        <circle cx="550" cy="220" r="6" fill="#b1121c" />
        <circle cx="800" cy="230" r="3.5" fill="#b1121c" />
      </g>
    </svg>
  );
}

export default function Home() {
  const [playerCount, setPlayerCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch player count from FiveM API
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/server/players');
        const data = await res.json();
        setPlayerCount(data.count || 0);
      } catch {
        setPlayerCount(42); // Fallback
      }
    }
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Coming Soon Banner */}
      <div className="coming-soon-banner">
        <span className="coming-soon-text">COMING SOON</span>
      </div>

      {/* Drifting Grid Background */}
      <div className="grid-bg" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 sm:px-6">
        <div className="relative z-10 max-w-[1200px] w-full">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 lg:gap-16 items-center">

            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Online Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full glass-button text-xs uppercase tracking-wider text-gray-400 mb-6"
              >
                <span className="pulse-dot" />
                Server Online · Join Now
              </motion.div>

              {/* Signature Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4 mb-6" aria-label="Black Mesa RP">
                <SignatureSVG />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2 }}
                  className="text-lg sm:text-2xl tracking-[0.35em] uppercase text-gray-400 px-3 py-2 rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm shadow-[0_14px_30px_rgba(0,0,0,0.5)] sm:-translate-y-1"
                >
                  RP
                </motion.div>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-400 leading-relaxed max-w-[520px] mb-9"
              >
                A live, persistent Los Santos roleplay environment built like a system, not a sandbox. Custom mechanics, controlled chaos, real consequences.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  size="lg"
                  className="glass-button btn-primary text-base px-6 py-6 gap-2 group"
                  asChild
                >
                  <Link href="fivem://connect/5.78.74.196:30120">
                    <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    Connect to Server
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-button text-base px-6 py-6 gap-2"
                  asChild
                >
                  <Link href="/tutorials">
                    Getting Started
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right - Status Panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="glass-card rounded-2xl p-7 self-center"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Live Telemetry
                </h3>
                <span className="pulse-dot" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/40 border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-2xl font-bold mb-1 text-green-400">ONLINE</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest">Status</div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-2xl font-bold mb-1">
                    {playerCount !== null ? `${playerCount} / 64` : '-- / 64'}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest">Players</div>
                </div>
                <div className="bg-black/40 border border-white/10 rounded-xl p-5 text-center">
                  <div className="text-2xl font-bold mb-1">28ms</div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest">Ping</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-red-500 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Quick Links Bar */}
      <section className="relative py-6 border-y border-white/5 bg-black/60">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-2 px-5 py-2.5 glass-button rounded-full group text-sm"
                >
                  <link.icon className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 sm:py-32">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="glass-button mb-4 text-xs uppercase tracking-wider" variant="outline">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">Black Mesa RP</span>?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Everything you need for the ultimate roleplay experience
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-7 group cursor-pointer hover:border-red-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-red-500/30 transition-all">
                  <feature.icon className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-red-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-y border-white/5 bg-black/40">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Custom Vehicles" },
              { value: "100+", label: "Custom Scripts" },
              { value: "24/7", label: "Active Staff" },
              { value: "1000+", label: "Community Members" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 sm:p-16 text-center max-w-4xl mx-auto"
          >
            <Badge className="glass-button mb-6 text-xs uppercase tracking-wider" variant="outline">
              Ready to Join?
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Start Your Journey <span className="gradient-text">Today</span>
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Join hundreds of players already creating unforgettable stories in Los Santos.
              Your adventure awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="glass-button btn-primary text-base px-10 py-6 gap-2 glow"
                asChild
              >
                <Link href="fivem://connect/5.78.74.196:30120">
                  <Play className="h-4 w-4" />
                  Connect to Server
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass-button text-base px-10 py-6"
                asChild
              >
                <Link href="https://discord.gg/blackmesarp" target="_blank">
                  Join Discord
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
