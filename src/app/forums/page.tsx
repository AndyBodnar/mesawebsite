"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Home, Clock, Heart, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: typeof MessageSquare;
  threadCount: number;
  postCount: number;
  latestThread: { title: string; author: string; time: string; extra?: string };
  tags: string[];
  accent: "red" | "green" | "amber" | "blue";
};

const categories: Category[] = [
  { id: "1", name: "Announcements", slug: "announcements", description: "Official server news, updates, and important information", icon: Home, threadCount: 24, postCount: 156, latestThread: { title: "Server Update v2.5", extra: "New Features", author: "Admin", time: "2 hours ago" }, tags: ["staff"], accent: "red" },
  { id: "2", name: "General Discussion", slug: "general", description: "Talk about anything related to Black Mesa RP", icon: MessageSquare, threadCount: 342, postCount: 2847, latestThread: { title: "What is your favorite RP moment?", author: "PlayerOne", time: "15 minutes ago" }, tags: ["hot"], accent: "amber" },
  { id: "3", name: "Roleplay Stories", slug: "stories", description: "Share your character stories and memorable RP experiences", icon: Heart, threadCount: 89, postCount: 567, latestThread: { title: "The Rise of the Ballas", extra: "Chapter 3", author: "GangsterRP", time: "1 hour ago" }, tags: [], accent: "blue" },
  { id: "4", name: "LEO Discussion", slug: "leo", description: "Law enforcement discussion, training, and coordination", icon: Shield, threadCount: 156, postCount: 1234, latestThread: { title: "LSPD Weekly Briefing", author: "ChiefMiller", time: "3 hours ago" }, tags: ["staff"], accent: "green" },
  { id: "5", name: "Suggestions", slug: "suggestions", description: "Submit ideas to improve the server", icon: Clock, threadCount: 234, postCount: 1890, latestThread: { title: "Add more civilian jobs", author: "CivMain", time: "30 minutes ago" }, tags: ["hot"], accent: "amber" },
  { id: "6", name: "Support", slug: "support", description: "Get help with technical issues and server problems", icon: MessageSquare, threadCount: 567, postCount: 3456, latestThread: { title: "Cannot connect to server", author: "NewPlayer", time: "5 minutes ago" }, tags: [], accent: "red" },
];

const pulseStats = [
  { id: "threads", label: "Total Threads", value: "1,412", barWidth: 64 },
  { id: "posts", label: "Total Posts", value: "10,150", barWidth: 78 },
  { id: "members", label: "Members", value: "2,847", barWidth: 52 },
  { id: "online", label: "Online Now", value: "142", barWidth: 41, live: true },
];

const filterPills = [
  { id: "all", label: "All" },
  { id: "staff", label: "Staff" },
  { id: "hot", label: "Hot" },
  { id: "leo", label: "LEO" },
  { id: "crim", label: "Crim" },
  { id: "support", label: "Support" },
];

const segmentTabs = [
  { id: "categories", label: "Categories" },
  { id: "latest", label: "Latest" },
  { id: "top", label: "Top" },
];

export default function ForumsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("categories");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = categories;
    if (activeFilter !== "all") {
      result = result.filter((cat) => cat.tags.includes(activeFilter) || cat.slug === activeFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((cat) => cat.name.toLowerCase().includes(query) || cat.description.toLowerCase().includes(query));
    }
    return result;
  }, [activeFilter, searchQuery]);

  return (
    <div className="relative">
      <main className="forum-wrap">
        <section className="forum-hero">
          <div>
            <h2>FORUMS</h2>
            <p>Join the conversation with the Black Mesa RP community.</p>
          </div>
          <div className="forum-hero-ctas">
            <div className="forum-spark"><MessageSquare className="h-4 w-4" /><span>Live pulse - Active threads - Moderated</span></div>
            <button className="forum-new-thread-btn"><span className="forum-plus">+</span>New Thread</button>
          </div>
        </section>

        <section className="forum-shell">
          <aside className="forum-left">
            <motion.div className="forum-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="forum-card-inner">
                <div className="forum-section-title"><span>FORUM PULSE</span><div className="forum-mini-tag">Live</div></div>
                <div className="pulse-grid">
                  {pulseStats.map((stat) => (
                    <div key={stat.id} className="pulse-item">
                      <div><div className="pulse-num">{stat.value}</div><div className="pulse-label">{stat.label}</div></div>
                      <div className={cn("pulse-bar", stat.live && "live")}><i style={{ width: `${stat.barWidth}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div className="forum-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <div className="forum-card-inner">
                <div className="forum-section-title"><span>FILTERS</span><div className="forum-mini-tag">Quick</div></div>
                <div className="filter-pills">
                  {filterPills.map((pill) => (<button key={pill.id} className={cn("pill-btn", activeFilter === pill.id && "active")} onClick={() => setActiveFilter(pill.id)}>{pill.label}</button>))}
                </div>
                <div className="forum-search"><Search className="h-4 w-4 opacity-75" /><input type="text" placeholder="Search topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
                <select className="forum-select"><option>Sort: Most Active</option><option>Sort: Newest</option><option>Sort: Most Replies</option></select>
              </div>
            </motion.div>
          </aside>
          <section className="forum-right">
            <motion.div className="forum-content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              <div className="forum-head">
                <div className="forum-head-left"><strong>THREAD INDEX</strong><div className="forum-head-sub">Clean categories - fast scanning - zero fluff</div></div>
                <div className="forum-head-filters">
                  <div className="seg-control">{segmentTabs.map((tab) => (<button key={tab.id} className={cn("seg-btn", activeTab === tab.id && "active")} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>))}</div>
                  <button className="forum-mod-btn">Moderation</button>
                </div>
              </div>
              <div className="forum-list">
                {filtered.map((category, idx) => (
                  <motion.article key={category.id} className={cn("cat-row", `accent-${category.accent}`)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 * idx }}>
                    <div className="cat-edge" aria-hidden="true" />
                    <div className="cat-icon" aria-hidden="true"><category.icon className="h-5 w-5" /></div>
                    <div className="cat-body">
                      <div className="cat-top"><div className="cat-title">{category.name}</div><div className="cat-badges">{category.tags.includes("staff") && <span className="cat-tag hot">STAFF</span>}{category.tags.includes("hot") && <span className="cat-tag">HOT</span>}</div></div>
                      <div className="cat-desc">{category.description}</div>
                      <div className="cat-latest"><span className="latest-label">Latest:</span><b>{category.latestThread.title}</b>{category.latestThread.extra && <span> - {category.latestThread.extra}</span>}<span> - by {category.latestThread.author}</span><span> - {category.latestThread.time}</span></div>
                    </div>
                    <div className="cat-counts"><div className="count-pill"><b>{category.threadCount}</b><span>Threads</span></div><div className="count-pill"><b>{category.postCount}</b><span>Posts</span></div></div>
                    <div className="cat-actions"><Link href={`/forums/${category.slug}`} className="cat-view-btn">View</Link><button className="cat-follow-btn">Follow</button></div>
                  </motion.article>
                ))}
                {filtered.length === 0 && <div className="forum-empty"><p>No categories match your filters.</p></div>}
                <div className="forum-note"><b>Signal over noise:</b> Staff threads are tagged, hot sections surface automatically, and category rows are built for scanning.</div>
              </div>
            </motion.div>
          </section>
        </section>
      </main>
    </div>
  );
}
