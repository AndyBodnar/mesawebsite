"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const featuredArticle = {
  id: "1",
  title: "Black Mesa RP 3.0 - The Biggest Update Yet",
  slug: "black-mesa-rp-3-update",
  excerpt:
    "We are launching Black Mesa RP 3.0 with a revamped economy, new jobs, custom vehicles, and more. This update represents months of development and community feedback.",
  category: "Update",
  author: { name: "Admin" },
  publishedAt: "December 18, 2024",
  readTime: "5 min read",
  views: 4523,
  comments: 89,
  featured: true,
};

const articles = [
  {
    id: "2",
    title: "Winter Event 2024 - Snow, Presents, and More",
    slug: "winter-event-2024",
    excerpt:
      "The holiday season is here. Join the annual winter event featuring snow across Los Santos and exclusive rewards.",
    category: "Event",
    author: { name: "EventTeam" },
    publishedAt: "December 15, 2024",
    readTime: "3 min read",
    views: 2341,
    comments: 45,
  },
  {
    id: "3",
    title: "LSPD Recruitment Drive Now Open",
    slug: "lspd-recruitment-2024",
    excerpt:
      "The Los Santos Police Department is looking for dedicated officers to join the force. Applications are open.",
    category: "Announcement",
    author: { name: "ChiefMiller" },
    publishedAt: "December 12, 2024",
    readTime: "4 min read",
    views: 1876,
    comments: 34,
  },
  {
    id: "4",
    title: "New Business System - Own Your Empire",
    slug: "new-business-system",
    excerpt:
      "Players can now purchase and manage businesses in Los Santos. Build a criminal empire or legitimate operation.",
    category: "Feature",
    author: { name: "DevTeam" },
    publishedAt: "December 10, 2024",
    readTime: "6 min read",
    views: 3245,
    comments: 67,
  },
  {
    id: "5",
    title: "Community Spotlight: The Ballas",
    slug: "community-spotlight-ballas",
    excerpt:
      "We are featuring The Ballas, one of our most active and immersive gang organizations. Learn their story.",
    category: "Community",
    author: { name: "Media" },
    publishedAt: "December 8, 2024",
    readTime: "7 min read",
    views: 1567,
    comments: 23,
  },
  {
    id: "6",
    title: "Server Rules Update - December 2024",
    slug: "rules-update-december",
    excerpt:
      "Important updates to server rules. All players should review the changes for continued compliance.",
    category: "Important",
    author: { name: "Admin" },
    publishedAt: "December 5, 2024",
    readTime: "4 min read",
    views: 2890,
    comments: 12,
  },
];

const categories = ["All", "Update", "Event", "Announcement", "Feature", "Community", "Important"];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="relative">
      <main className="wrap">
        <aside className="sidebar">
          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hd">
              <h3>News Filters</h3>
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

          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="hd">
              <h3>Signals</h3>
            </div>
            <div className="bd space-y-3 text-sm text-white/60">
              <div className="hot">
                <div className="l">
                  <div className="t">Trending</div>
                  <div className="m">Most read this week</div>
                </div>
                <div className="spark" />
              </div>
              <div className="hot">
                <div className="l">
                  <div className="t">Featured</div>
                  <div className="m">Pinned announcements</div>
                </div>
                <div className="spark" />
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">News</div>

          <div className="headRow">
            <div>
              <h1>News</h1>
              <div className="desc">Dispatches, changelogs, and staff announcements.</div>
            </div>
            <div className="toolbar">
              <button className="btn">
                <TrendingUp className="h-4 w-4" />
                Trending
              </button>
              <button className="btn">
                <Star className="h-4 w-4" />
                Featured
              </button>
            </div>
          </div>

          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bd">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-[18px] border border-white/10 bg-white/5">
                  <Newspaper className="h-10 w-10 text-white/40" />
                </div>
                <div className="flex-1">
                  <div className="titleRow">
                    <div className="tag hot">Featured</div>
                    <div className="tag">{featuredArticle.category}</div>
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-white/90">
                    <Link href={`/news/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
                  </h2>
                  <p className="mt-2 text-sm text-white/60">{featuredArticle.excerpt}</p>
                  <div className="mt-3 text-xs text-white/50">
                    {featuredArticle.publishedAt} - {featuredArticle.readTime} - {featuredArticle.views} views
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <div className="threads">
            {filtered.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <motion.div className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                  <div className={cn("heat", article.views > 2500 && "green")} />
                  <div className="avatar">
                    <Newspaper className="h-4 w-4" />
                  </div>
                  <div className="meta">
                    <div className="titleRow">
                      <div className="tTitle">{article.title}</div>
                      <div className="tag">{article.category}</div>
                    </div>
                    <div className="sub">
                      <span>{article.excerpt}</span>
                      <span>
                        <strong>{article.author.name}</strong> - {article.publishedAt} - {article.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <span>{article.views}</span>
                    </div>
                    <div className="stat">
                      <span>{article.comments}</span>
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
