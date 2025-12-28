"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Newspaper, Calendar, Clock, Eye, MessageSquare, Share2, Send } from "lucide-react";

const article = {
  id: "1",
  title: "Black Mesa RP 3.0 - The Biggest Update Yet",
  slug: "black-mesa-rp-3-update",
  category: "Update",
  author: { id: "1", name: "Admin", avatar: "", role: "ADMIN" },
  publishedAt: "December 18, 2024",
  readTime: "5 min read",
  views: 4523,
  likes: 234,
  content: `We are launching Black Mesa RP 3.0, the biggest update in our server's history.

What's new in 3.0

- Revamped economy system with dynamic pricing
- New jobs and careers across Los Santos
- Custom vehicles and quality of life improvements

The update goes live December 20th at 6 PM EST. Update your FiveM client before connecting.

Thank you for shaping 3.0 with your feedback. See you in the city.`,
};

const comments = [
  {
    id: "1",
    author: { id: "2", name: "PlayerOne", avatar: "", role: "VIP" },
    content: "This is huge. The dynamic pricing sounds great.",
    createdAt: "2 hours ago",
    likes: 12,
  },
  {
    id: "2",
    author: { id: "3", name: "GangsterRP", avatar: "", role: "MEMBER" },
    content: "Fishing finally. Time to become a fisherman.",
    createdAt: "1 hour ago",
    likes: 8,
  },
  {
    id: "3",
    author: { id: "4", name: "ChiefMiller", avatar: "", role: "MODERATOR" },
    content: "Great work dev team. The inventory update is smooth.",
    createdAt: "45 minutes ago",
    likes: 15,
  },
];

const relatedArticles = [
  { title: "Winter Event 2024 - Snow, Presents and More", slug: "winter-event-2024", category: "Event" },
  { title: "New Business System - Own Your Empire", slug: "new-business-system", category: "Feature" },
  { title: "Server Rules Update - December 2024", slug: "rules-update-december", category: "Important" },
];

export default function ArticlePage() {
  const [comment, setComment] = useState("");

  return (
    <div className="relative">
      <main className="wrap">
        <section className="main">
          <div className="crumbs">
            <Link href="/news">News</Link> &gt; {article.title}
          </div>

          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bd space-y-3">
              <div className="titleRow">
                <div className="tag">{article.category}</div>
              </div>
              <h1 className="text-3xl font-semibold text-white/90">{article.title}</h1>
              <div className="sub">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {article.publishedAt}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {article.views} views
                </span>
              </div>
            </div>
          </motion.section>

          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="bd space-y-3 text-sm text-white/70">
              {article.content.split("\n").map((line, index) => (
                <p key={`${article.id}-${index}`}>{line}</p>
              ))}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-white/50">{article.likes} likes</div>
                <button className="btn">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </motion.section>

          <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
            <MessageSquare className="h-4 w-4" />
            Comments ({comments.length})
          </div>

          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bd">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Write a comment"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    className="min-h-20"
                  />
                  <div className="flex justify-end">
                    <button className="btn primary" disabled={!comment.trim()}>
                      <Send className="h-4 w-4" />
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <div className="space-y-4">
            {comments.map((item, index) => (
              <motion.section
                key={item.id}
                className="panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bd">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.author.avatar} />
                      <AvatarFallback>{item.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-white/50">
                        <span className="text-white/80">{item.author.name}</span>
                        <span>{item.createdAt}</span>
                      </div>
                      <p className="mt-2 text-sm text-white/70">{item.content}</p>
                      <div className="mt-2 text-xs text-white/50">{item.likes} likes</div>
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        </section>

        <aside className="sidebar">
          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hd">
              <h3>Article Stats</h3>
            </div>
            <div className="bd space-y-3 text-sm text-white/60">
              <div className="flex items-center justify-between">
                <span>Views</span>
                <span className="text-white">{article.views}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Likes</span>
                <span className="text-white">{article.likes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Comments</span>
                <span className="text-white">{comments.length}</span>
              </div>
            </div>
          </motion.section>

          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="hd">
              <h3>Related</h3>
            </div>
            <div className="bd space-y-3">
              {relatedArticles.map((item) => (
                <Link key={item.slug} href={`/news/${item.slug}`} className="hot">
                  <div className="l">
                    <div className="t">{item.title}</div>
                    <div className="m">{item.category}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        </aside>
      </main>
    </div>
  );
}
