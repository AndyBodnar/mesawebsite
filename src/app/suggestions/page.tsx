"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Plus, Sparkles, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

const suggestions = [
  {
    id: "1",
    title: "Add more civilian jobs",
    author: "CivMain",
    votes: 156,
    comments: 23,
    status: "Under Review",
    category: "Jobs",
    created: "3 days ago",
  },
  {
    id: "2",
    title: "Custom license plates for VIP",
    author: "VIPPlayer",
    votes: 89,
    comments: 12,
    status: "Planned",
    category: "Vehicles",
    created: "1 week ago",
  },
  {
    id: "3",
    title: "Add fishing minigame",
    author: "FisherMan",
    votes: 234,
    comments: 45,
    status: "Implemented",
    category: "Activities",
    created: "2 weeks ago",
  },
  {
    id: "4",
    title: "Remove vehicle speed limits",
    author: "SpeedDemon",
    votes: -45,
    comments: 67,
    status: "Declined",
    category: "Vehicles",
    created: "4 weeks ago",
  },
  {
    id: "5",
    title: "More customization for houses",
    author: "Decorator",
    votes: 123,
    comments: 34,
    status: "Under Review",
    category: "Housing",
    created: "5 days ago",
  },
];

const statusFilters = ["All", "Under Review", "Planned", "Implemented", "Declined"];
const categories = ["All", "Jobs", "Vehicles", "Activities", "Housing"];

const statusClasses: Record<string, string> = {
  "Under Review": "hot",
  Planned: "",
  Implemented: "",
  Declined: "lock",
};

export default function SuggestionsPage() {
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suggestions.filter((sug) => {
      const matchesQuery =
        !q ||
        sug.title.toLowerCase().includes(q) ||
        sug.author.toLowerCase().includes(q) ||
        sug.category.toLowerCase().includes(q);
      const matchesStatus = activeStatus === "All" || sug.status === activeStatus;
      const matchesCategory = activeCategory === "All" || sug.category === activeCategory;
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [query, activeStatus, activeCategory]);

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
              <h3>Suggestion Search</h3>
              <span className="text-xs text-white/50">Ctrl K</span>
            </div>
            <div className="bd">
              <div className="search">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search ideas, categories, users..."
                />
                <div className="k">CTRL</div>
                <div className="k">K</div>
              </div>
              <div className="filters">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    className={cn("chip", activeStatus === status && "on")}
                    onClick={() => setActiveStatus(status)}
                  >
                    {status}
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
              <h3>Top Lanes</h3>
              <span className="text-xs text-white/50">Weekly</span>
            </div>
            <div className="bd">
              <div className="hotlist">
                <div className="hot">
                  <div className="l">
                    <div className="t">Most Upvoted</div>
                    <div className="m">Community-backed ideas</div>
                  </div>
                  <div className="spark" aria-hidden="true" />
                </div>
                <div className="hot">
                  <div className="l">
                    <div className="t">Staff Review</div>
                    <div className="m">Ideas under evaluation</div>
                  </div>
                  <div className="spark" aria-hidden="true" />
                </div>
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Community &gt; Suggestions</div>

          <div className="headRow">
            <div>
              <h1>Suggestions</h1>
              <div className="desc">Shape the roadmap with ideas the staff can actually ship.</div>
            </div>
            <div className="toolbar">
              <Link className="btn primary" href="/suggestions/new">
                <Plus className="h-4 w-4" />
                New Suggestion
              </Link>
              <button className="btn">Top This Week</button>
            </div>
          </div>

          <StaggerContainer className="threads">
            {filtered.map((sug) => (
              <StaggerItem key={sug.id}>
                <Link href={`/suggestions/${sug.id}`}>
                  <motion.div
                    className="thread"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={cn("heat", sug.votes >= 100 && "green", sug.votes < 0 && "dim")} />
                    <div className="avatar">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="meta">
                      <div className="titleRow">
                        <div className="tTitle">{sug.title}</div>
                        <div className="tag">{sug.category}</div>
                        <div className={cn("tag", statusClasses[sug.status])}>{sug.status}</div>
                      </div>
                      <div className="sub">
                        <span>
                          <strong>{sug.author}</strong> - {sug.created}
                        </span>
                        <span>Votes sync nightly</span>
                      </div>
                    </div>
                    <div className="stats">
                      <div className={cn("stat", sug.votes < 0 ? "text-red-400" : "text-green-400")}>
                        <ThumbsUp className="h-4 w-4" />
                        <span>{sug.votes}</span>
                      </div>
                      <div className="stat">
                        <MessageSquare className="h-4 w-4" />
                        <span>{sug.comments}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="pager">
            <div>Showing 1-{filtered.length} of {suggestions.length} suggestions</div>
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
