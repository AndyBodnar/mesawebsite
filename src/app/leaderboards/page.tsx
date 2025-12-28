"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Car, Clock, Crown, DollarSign, Medal, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

const categories = [
  { id: "playtime", label: "Playtime", icon: Clock },
  { id: "wealth", label: "Richest", icon: DollarSign },
  { id: "vehicles", label: "Car Collection", icon: Car },
  { id: "reputation", label: "Reputation", icon: Target },
];

const timeframes = ["Weekly", "Monthly", "All Time"];

const leaderboard = [
  { rank: 1, name: "GangsterRP", value: "2,456 hours" },
  { rank: 2, name: "BusinessMan", value: "2,134 hours" },
  { rank: 3, name: "ChiefMiller", value: "1,987 hours" },
  { rank: 4, name: "RacerX", value: "1,765 hours" },
  { rank: 5, name: "MedicJane", value: "1,654 hours" },
  { rank: 6, name: "PlayerOne", value: "1,543 hours" },
  { rank: 7, name: "TruckerBob", value: "1,432 hours" },
  { rank: 8, name: "TaxiDude", value: "1,321 hours" },
  { rank: 9, name: "FisherMan", value: "1,210 hours" },
  { rank: 10, name: "NewPlayer", value: "987 hours" },
];

const podiumColors: Record<number, string> = {
  1: "from-amber-400 to-yellow-500",
  2: "from-zinc-300 to-zinc-500",
  3: "from-amber-600 to-amber-800",
};

const podiumIcons: Record<number, typeof Crown | typeof Medal> = {
  1: Crown,
  2: Medal,
  3: Medal,
};

export default function LeaderboardsPage() {
  const [activeCategory, setActiveCategory] = useState("playtime");
  const [activeTimeframe, setActiveTimeframe] = useState("Weekly");

  const podium = useMemo(() => leaderboard.slice(0, 3), []);

  return (
    <div className="relative">
      <main className="wrap">
        <aside className="sidebar">
          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hd">
              <h3>Category</h3>
            </div>
            <div className="bd">
              <div className="filters">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={cn("chip inline-flex items-center gap-2", activeCategory === cat.id && "on")}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <cat.icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="hd">
              <h3>Timeframe</h3>
            </div>
            <div className="bd">
              <div className="filters">
                {timeframes.map((range) => (
                  <button
                    key={range}
                    type="button"
                    className={cn("chip", activeTimeframe === range && "on")}
                    onClick={() => setActiveTimeframe(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="hd">
              <h3>Highlights</h3>
              <span className="text-xs text-white/50">Live</span>
            </div>
            <div className="bd">
              <div className="hotlist">
                <div className="hot">
                  <div className="l">
                    <div className="t">Top 10</div>
                    <div className="m">Weekly climbers</div>
                  </div>
                  <div className="spark" aria-hidden="true" />
                </div>
                <div className="hot">
                  <div className="l">
                    <div className="t">Rising Stars</div>
                    <div className="m">Fastest gains</div>
                  </div>
                  <div className="spark" aria-hidden="true" />
                </div>
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Stats &gt; Leaderboards</div>

          <div className="headRow">
            <div>
              <h1>Leaderboards</h1>
              <div className="desc">Ranked performance across the entire city.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary" type="button">
                <Trophy className="h-4 w-4" />
                Season 9
              </button>
              <button className="btn" type="button">
                {activeTimeframe}
              </button>
            </div>
          </div>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bd">
              <div className="grid gap-4 md:grid-cols-3">
                {podium.map((player, index) => {
                  const rank = player.rank;
                  const Icon = podiumIcons[rank] || Medal;
                  return (
                    <motion.div
                      key={player.rank}
                      className="rounded-[16px] border border-white/10 bg-black/35 p-4 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <div className={cn("mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br", podiumColors[rank])}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm uppercase tracking-[0.28em] text-white/50">#{rank}</div>
                      <div className="mt-2 text-lg font-semibold text-white">{player.name}</div>
                      <div className="text-sm text-white/60">{player.value}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          <StaggerContainer className="threads">
            {leaderboard.map((player) => (
              <StaggerItem key={player.rank}>
                <motion.div className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                  <div className={cn("heat", player.rank <= 3 && "green", player.rank > 6 && "dim")} />
                  <div className="avatar">{player.name.charAt(0)}</div>
                  <div className="meta">
                    <div className="titleRow">
                      <div className="tTitle">{player.name}</div>
                      <div className="tag">Rank #{player.rank}</div>
                      <div className="tag">{categories.find((cat) => cat.id === activeCategory)?.label}</div>
                    </div>
                    <div className="sub">
                      <span>Season 9 tracking</span>
                      <span>
                        Updated <strong>{activeTimeframe}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <Trophy className="h-4 w-4" />
                      <span>{player.value}</span>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </main>
    </div>
  );
}
