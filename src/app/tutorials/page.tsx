"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

const tutorials = [
  {
    id: "getting-started",
    title: "Getting Started with Black Mesa RP",
    category: "Basics",
    duration: "10 min",
    views: 4523,
    difficulty: "Beginner",
  },
  {
    id: "character-creation",
    title: "How to Create Your First Character",
    category: "Characters",
    duration: "8 min",
    views: 3241,
    difficulty: "Beginner",
  },
  {
    id: "economy",
    title: "Understanding the Economy System",
    category: "Economy",
    duration: "15 min",
    views: 2876,
    difficulty: "Intermediate",
  },
  {
    id: "leo-training",
    title: "LEO Training Guide",
    category: "LEO",
    duration: "25 min",
    views: 1923,
    difficulty: "Advanced",
  },
  {
    id: "gang-rp",
    title: "Gang RP Best Practices",
    category: "Roleplay",
    duration: "12 min",
    views: 2145,
    difficulty: "Intermediate",
  },
  {
    id: "vehicle-mechanics",
    title: "Vehicle Mechanics and Customization",
    category: "Vehicles",
    duration: "18 min",
    views: 1654,
    difficulty: "Intermediate",
  },
];

const categories = ["All", "Basics", "Characters", "Economy", "LEO", "Roleplay", "Vehicles"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const difficultyClasses: Record<string, string> = {
  Beginner: "",
  Intermediate: "",
  Advanced: "hot",
};

export default function TutorialsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tutorials.filter((tut) => {
      const matchesQuery =
        !q ||
        tut.title.toLowerCase().includes(q) ||
        tut.category.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "All" || tut.category === activeCategory;
      const matchesDifficulty = activeDifficulty === "All" || tut.difficulty === activeDifficulty;
      return matchesQuery && matchesCategory && matchesDifficulty;
    });
  }, [query, activeCategory, activeDifficulty]);

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
              <h3>Search</h3>
              <span className="text-xs text-white/50">Ctrl K</span>
            </div>
            <div className="bd">
              <div className="search">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tutorials, topics, tags..."
                />
                <div className="k">CTRL</div>
                <div className="k">K</div>
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
              <h3>Categories</h3>
            </div>
            <div className="bd">
              <div className="filters">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={cn("chip", activeCategory === cat && "on")}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
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
              <h3>Difficulty</h3>
            </div>
            <div className="bd">
              <div className="filters">
                {difficulties.map((level) => (
                  <button
                    key={level}
                    className={cn("chip", activeDifficulty === level && "on")}
                    onClick={() => setActiveDifficulty(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="hd">
              <h3>Quick Start</h3>
              <span className="text-xs text-white/50">New</span>
            </div>
            <div className="bd">
              <div className="hotlist">
                <div className="hot">
                  <div className="l">
                    <div className="t">Server Basics</div>
                    <div className="m">Connect, create, and spawn</div>
                  </div>
                  <div className="spark" aria-hidden="true" />
                </div>
                <div className="hot">
                  <div className="l">
                    <div className="t">RP Etiquette</div>
                    <div className="m">Rules that matter most</div>
                  </div>
                  <div className="spark" aria-hidden="true" />
                </div>
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Guides &gt; Tutorials</div>

          <div className="headRow">
            <div>
              <h1>Tutorials</h1>
              <div className="desc">Guides, SOPs, and walkthroughs for every path.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary">Browse Guides</button>
              <button className="btn">New Player Path</button>
            </div>
          </div>

          <StaggerContainer className="threads">
            {filtered.map((tut) => (
              <StaggerItem key={tut.id}>
                <Link href={`/tutorials/${tut.id}`}>
                  <motion.div
                    className="thread"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={cn("heat", tut.views > 3000 && "green")} />
                    <div className="avatar">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="meta">
                      <div className="titleRow">
                        <div className="tTitle">{tut.title}</div>
                        <div className="tag">{tut.category}</div>
                        <div className={cn("tag", difficultyClasses[tut.difficulty])}>{tut.difficulty}</div>
                      </div>
                      <div className="sub">
                        <span>Estimated time {tut.duration}</span>
                        <span>
                          Views <strong>{tut.views.toLocaleString()}</strong>
                        </span>
                      </div>
                    </div>
                    <div className="stats">
                      <div className="stat">
                        <Clock className="h-4 w-4" />
                        <span>{tut.duration}</span>
                      </div>
                      <div className="stat">
                        <Eye className="h-4 w-4" />
                        <span>{tut.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="pager">
            <div>Showing 1-{filtered.length} of {tutorials.length} tutorials</div>
            <div className="pages">
              <div className="page on">1</div>
              <div className="page">2</div>
              <div className="page">3</div>
              <div className="page">&gt;</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
