"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Pin, Lock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const threads = [
  {
    id: "1",
    title: "Welcome to the General Discussion!",
    slug: "welcome-general",
    pinned: true,
    locked: false,
    author: { name: "Admin" },
    createdAt: "2 days ago",
    replies: 45,
    views: 1234,
    lastReply: { author: "NewPlayer", time: "5 minutes ago" },
    tags: ["staff", "hot"],
  },
  {
    id: "2",
    title: "What's your favorite RP moment so far?",
    slug: "favorite-rp-moment",
    pinned: false,
    locked: false,
    author: { name: "PlayerOne" },
    createdAt: "3 hours ago",
    replies: 23,
    views: 456,
    lastReply: { author: "GangsterRP", time: "15 minutes ago" },
    hot: true,
    tags: ["hot", "new"],
  },
  {
    id: "3",
    title: "Looking for business partners",
    slug: "business-partners",
    pinned: false,
    locked: false,
    author: { name: "BusinessMan" },
    createdAt: "1 day ago",
    replies: 12,
    views: 234,
    lastReply: { author: "InvestorX", time: "2 hours ago" },
    tags: ["market"],
  },
  {
    id: "4",
    title: "Car meet this Saturday!",
    slug: "car-meet-saturday",
    pinned: false,
    locked: false,
    author: { name: "CarGuy" },
    createdAt: "5 hours ago",
    replies: 34,
    views: 567,
    lastReply: { author: "RacerX", time: "30 minutes ago" },
    tags: ["events", "new"],
  },
  {
    id: "5",
    title: "Old thread - no longer relevant",
    slug: "old-thread",
    pinned: false,
    locked: true,
    author: { name: "OldUser" },
    createdAt: "30 days ago",
    replies: 89,
    views: 2345,
    lastReply: { author: "Moderator", time: "7 days ago" },
    tags: ["locked"],
  },
];

const filters = [
  { id: "all", label: "All" },
  { id: "hot", label: "Hot" },
  { id: "new", label: "New" },
  { id: "staff", label: "Staff" },
  { id: "events", label: "Events" },
  { id: "market", label: "Market" },
];

const hotLanes = [
  {
    title: "Priority Announcements",
    meta: "Staff updates and rule changes",
  },
  {
    title: "Active Investigations",
    meta: "Cases, evidence, warrants",
  },
  {
    title: "Player Market",
    meta: "Deals, services, crews",
  },
];

export default function CategoryPage() {
  const category = {
    name: "General Discussion",
    description: "Talk about anything related to Black Mesa RP. Keep it tight, keep it real.",
    slug: "general",
  };

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filteredThreads = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return threads.filter((thread) => {
      const matchesQuery = !lowered || thread.title.toLowerCase().includes(lowered);
      const matchesFilter =
        activeFilter === "all" ||
        thread.tags.includes(activeFilter) ||
        (activeFilter === "hot" && thread.hot);
      return matchesQuery && matchesFilter;
    });
  }, [query, activeFilter]);

  return (
    <div className="relative">
      <main className="wrap">
        <aside className="sidebar">
          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hd">
              <h3>Thread Search</h3>
              <span className="text-xs text-white/50">CTRL K</span>
            </div>
            <div className="bd">
              <div className="search">
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search discussions, tags, people"
                />
                <div className="k">CTRL</div>
                <div className="k">K</div>
              </div>
              <div className="filters">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    className={cn("chip", activeFilter === filter.id && "on")}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="hd">
              <h3>Hot Lanes</h3>
              <span className="text-xs text-white/50">Live</span>
            </div>
            <div className="bd">
              <div className="hotlist">
                {hotLanes.map((lane) => (
                  <div className="hot" key={lane.title}>
                    <div className="l">
                      <div className="t">{lane.title}</div>
                      <div className="m">{lane.meta}</div>
                    </div>
                    <div className="spark" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Forums &gt; {category.name}</div>

          <div className="headRow">
            <div>
              <h1>{category.name}</h1>
              <div className="desc">{category.description}</div>
            </div>
            <div className="toolbar">
              <button className="btn primary">
                <Plus className="h-4 w-4" />
                New Thread
              </button>
              <button className="btn">Sort: Activity</button>
            </div>
          </div>

          <div className="threads">
            {filteredThreads.map((thread) => (
              <Link key={thread.id} href={`/forums/${category.slug}/${thread.slug}`}>
                <motion.div
                  className="thread"
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={cn("heat", thread.hot && "green", thread.locked && "dim")} />
                  <div className="avatar">{thread.author.name.charAt(0)}</div>
                  <div className="meta">
                    <div className="titleRow">
                      {thread.pinned && <Pin className="h-4 w-4 text-red-400" />}
                      {thread.locked && <Lock className="h-4 w-4 text-white/40" />}
                      {thread.hot && <Flame className="h-4 w-4 text-red-400" />}
                      <div className="tTitle">{thread.title}</div>
                      {thread.tags.includes("staff") && <div className="tag hot">Staff</div>}
                      {thread.pinned && <div className="tag">Pinned</div>}
                      {thread.locked && <div className="tag lock">Locked</div>}
                    </div>
                    <div className="sub">
                      <span>
                        <strong>{thread.author.name}</strong> - {thread.createdAt}
                      </span>
                      {thread.lastReply && (
                        <span>
                          Last reply by <strong>{thread.lastReply.author}</strong> - {thread.lastReply.time}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <span>{thread.replies}</span>
                    </div>
                    <div className="stat">
                      <span>{thread.views}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="pager">
            <div>Showing 1-5 of 124 threads</div>
            <div className="pages">
              <div className="page on">1</div>
              <div className="page">2</div>
              <div className="page">3</div>
              <div className="page">Next</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
