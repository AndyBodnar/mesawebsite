"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BookOpen, Check, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

const ruleCategories = [
  {
    id: "general",
    title: "General Rules",
    icon: BookOpen,
    rules: [
      "Respect all players and staff",
      "No harassment or discrimination",
      "English only in public channels",
      "No metagaming or powergaming",
      "Stay in character at all times",
    ],
  },
  {
    id: "combat",
    title: "Combat Rules",
    icon: AlertTriangle,
    rules: [
      "RDM (Random Deathmatch) is prohibited",
      "Must initiate roleplay before combat",
      "No combat logging",
      "Respect NLR (New Life Rule)",
      "No exploiting game mechanics",
    ],
  },
  {
    id: "leo",
    title: "LEO Guidelines",
    icon: Shield,
    rules: [
      "Follow chain of command",
      "Use proper radio etiquette",
      "Pursue realistic police procedures",
      "Document all arrests properly",
      "Attend mandatory training sessions",
    ],
  },
];

const quickNotes = [
  { title: "Zero tolerance for harassment", note: "Immediate staff escalation" },
  { title: "Combat requires RP", note: "Always initiate first" },
  { title: "Report incidents", note: "Use tickets for disputes" },
];

export default function RulesPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [acknowledged, setAcknowledged] = useState(false);

  const active = useMemo(
    () => ruleCategories.find((cat) => cat.id === activeCategory) ?? ruleCategories[0],
    [activeCategory]
  );

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
              <h3>Rule Index</h3>
              <span className="text-xs text-white/50">v2.1</span>
            </div>
            <div className="bd">
              <div className="filters">
                {ruleCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={cn("chip", activeCategory === cat.id && "on")}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.title}
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
              <h3>Acknowledgment</h3>
            </div>
            <div className="bd space-y-3 text-sm text-white/60">
              <div>Version 2.1 - Updated Dec 2024</div>
              <button
                type="button"
                className={cn("btn w-full justify-center", acknowledged && "primary")}
                onClick={() => setAcknowledged(!acknowledged)}
              >
                {acknowledged ? (
                  <>
                    <Check className="h-4 w-4" />
                    Rules Accepted
                  </>
                ) : (
                  "Accept Rules"
                )}
              </button>
            </div>
          </motion.section>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="hd">
              <h3>Quick Notes</h3>
              <span className="text-xs text-white/50">Staff</span>
            </div>
            <div className="bd">
              <div className="hotlist">
                {quickNotes.map((note) => (
                  <div className="hot" key={note.title}>
                    <div className="l">
                      <div className="t">{note.title}</div>
                      <div className="m">{note.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Rules &gt; Server Rules</div>

          <div className="headRow">
            <div>
              <h1>Server Rules</h1>
              <div className="desc">Read, acknowledge, and keep the roleplay clean.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary" type="button">
                Download
              </button>
              <button className="btn" type="button">
                Print
              </button>
            </div>
          </div>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bd">
              <div className="titleRow">
                <div className="tag hot">Section</div>
                <div className="tag">{active.title}</div>
              </div>
              <h2 className="mt-3 text-2xl font-semibold">{active.title}</h2>
              <div className="mt-4 space-y-3">
                {active.rules.map((rule, index) => (
                  <div key={rule} className="flex items-start gap-3 text-sm text-white/70">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/40 text-xs text-white/70">
                      {index + 1}
                    </div>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <StaggerContainer className="threads">
            {ruleCategories.map((cat) => (
              <StaggerItem key={cat.id}>
                <motion.button
                  type="button"
                  className="thread w-full text-left"
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <div className={cn("heat", activeCategory === cat.id && "green")}></div>
                  <div className="avatar">{cat.title.charAt(0)}</div>
                  <div className="meta">
                    <div className="titleRow">
                      <div className="tTitle">{cat.title}</div>
                      <div className="tag">{cat.rules.length} rules</div>
                      <div className={cn("tag", activeCategory === cat.id && "hot")}>Active</div>
                    </div>
                    <div className="sub">
                      <span>Tap to load section details</span>
                      <span>Last updated Dec 2024</span>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <BookOpen className="h-4 w-4" />
                      <span>{cat.rules.length} items</span>
                    </div>
                  </div>
                </motion.button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </main>
    </div>
  );
}
