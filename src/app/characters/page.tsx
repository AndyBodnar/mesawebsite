"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Plus, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const characters = [
  { id: "1", name: "Marcus \"Viper\" Johnson", player: "GangsterRP", faction: "Ballas", status: "Active", likes: 234 },
  { id: "2", name: "Officer James Miller", player: "ChiefMiller", faction: "LSPD", status: "Active", likes: 456 },
  { id: "3", name: "Dr. Sarah Chen", player: "Medic_Jane", faction: "Pillbox Medical", status: "Active", likes: 189 },
  { id: "4", name: "Tony \"Big T\" Romano", player: "BusinessMan", faction: "Independent", status: "Active", likes: 312 },
];

const factions = ["All", "Ballas", "LSPD", "Pillbox Medical", "Independent"];

export default function CharactersPage() {
  const [query, setQuery] = useState("");
  const [activeFaction, setActiveFaction] = useState("All");

  const filtered = useMemo(() => {
    return characters.filter((char) => {
      const matchQuery = !query.trim() || char.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchFaction = activeFaction === "All" || char.faction === activeFaction;
      return matchQuery && matchFaction;
    });
  }, [query, activeFaction]);

  return (
    <div className="relative">
      <main className="wrap">
        <aside className="sidebar">
          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hd">
              <h3>Search</h3>
            </div>
            <div className="bd">
              <div className="search">
                <Search className="h-4 w-4 text-white/40" />
                <input
                  placeholder="Search characters"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="filters">
                {factions.map((faction) => (
                  <button
                    key={faction}
                    className={cn("chip", activeFaction === faction && "on")}
                    onClick={() => setActiveFaction(faction)}
                  >
                    {faction}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Characters</div>

          <div className="headRow">
            <div>
              <h1>Characters</h1>
              <div className="desc">Public character profiles and RP history.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary">
                <Plus className="h-4 w-4" />
                Create
              </button>
            </div>
          </div>

          <div className="threads">
            {filtered.map((char) => (
              <Link key={char.id} href={`/characters/${char.id}`}>
                <motion.div className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                  <div className={cn("heat", char.likes > 300 && "green")} />
                  <div className="avatar">{char.name.charAt(0)}</div>
                  <div className="meta">
                    <div className="titleRow">
                      <div className="tTitle">{char.name}</div>
                      <div className="tag">{char.faction}</div>
                    </div>
                    <div className="sub">
                      <span>by <strong>{char.player}</strong></span>
                      <span>Status: <strong>{char.status}</strong></span>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <Heart className="h-4 w-4" />
                      <span>{char.likes}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
