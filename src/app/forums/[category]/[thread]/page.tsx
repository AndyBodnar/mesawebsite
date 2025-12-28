"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Eye,
  Pin,
  Lock,
  Clock,
  Share2,
  Flag,
  Quote,
  Reply,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

const thread = {
  id: "1",
  title: "Welcome to the General Discussion!",
  slug: "welcome-general",
  pinned: true,
  locked: false,
  category: { name: "General Discussion", slug: "general" },
  author: {
    id: "1",
    name: "Admin",
    avatar: "",
    role: "ADMIN",
    joinDate: "Jan 2023",
    postCount: 1234,
  },
  createdAt: "2 days ago",
  views: 1234,
  content: `Welcome to the Black Mesa RP General Discussion forum!

This is the place to chat about anything and everything related to our community. Whether you want to share your experiences, ask questions, or just hang out with fellow players, this is the spot.

Some ground rules:
- Be respectful to all community members
- No spam or self-promotion
- Keep discussions on-topic
- Have fun!

We are excited to have you here. Feel free to introduce yourself and start exploring the community!`,
};

const posts = [
  {
    id: "1",
    author: {
      id: "2",
      name: "PlayerOne",
      avatar: "",
      role: "VIP",
      joinDate: "Mar 2023",
      postCount: 456,
    },
    content:
      "This is awesome! I have been looking for a community like this for ages. The roleplay here is top-notch and everyone is welcoming. Cannot wait to get more involved!",
    createdAt: "1 day ago",
    reactions: { likes: 12, hearts: 5 },
  },
  {
    id: "2",
    author: {
      id: "3",
      name: "GangsterRP",
      avatar: "",
      role: "MEMBER",
      joinDate: "Jun 2023",
      postCount: 89,
    },
    content:
      "Thanks for the warm welcome! I just joined last week and I am already having a blast. The gang RP here is incredible - the attention to detail in the scripts is amazing.",
    createdAt: "20 hours ago",
    reactions: { likes: 8, hearts: 3 },
  },
  {
    id: "3",
    author: {
      id: "4",
      name: "ChiefMiller",
      avatar: "",
      role: "MODERATOR",
      joinDate: "Feb 2023",
      postCount: 789,
    },
    content:
      "Great to see so many new faces around here. Check out the tutorials section for getting started and join our Discord for real-time updates. Do not hesitate to ask questions - we are all here to help.",
    createdAt: "15 hours ago",
    reactions: { likes: 25, hearts: 10 },
  },
  {
    id: "4",
    author: {
      id: "5",
      name: "NewPlayer",
      avatar: "",
      role: "MEMBER",
      joinDate: "Dec 2024",
      postCount: 3,
    },
    content:
      "Just found this community through a friend's recommendation. The setup process was smooth and I am already approved. See you in Los Santos soon!",
    createdAt: "5 minutes ago",
    reactions: { likes: 2, hearts: 1 },
  },
];

const roleColors: Record<string, string> = {
  ADMIN: "text-red-400",
  SUPERADMIN: "text-red-400",
  MODERATOR: "text-green-400",
  VIP: "text-purple-400",
  MEMBER: "text-white/60",
};

export default function ThreadPage() {
  const [replyContent, setReplyContent] = useState("");

  return (
    <div className="relative">
      <main className="wrap">
        <aside className="sidebar">
          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hd">
              <h3>Thread Intel</h3>
            </div>
            <div className="bd space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between rounded-[14px] border border-white/10 bg-black/40 px-3 py-2">
                <span>Views</span>
                <span className="text-white">{thread.views}</span>
              </div>
              <div className="flex items-center justify-between rounded-[14px] border border-white/10 bg-black/40 px-3 py-2">
                <span>Replies</span>
                <span className="text-white">{posts.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-[14px] border border-white/10 bg-black/40 px-3 py-2">
                <span>Status</span>
                <span className="text-white">{thread.locked ? "Locked" : "Open"}</span>
              </div>
            </div>
          </motion.section>

          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="hd">
              <h3>Actions</h3>
            </div>
            <div className="bd space-y-2">
              <button className="btn w-full justify-between">
                Share <Share2 className="h-4 w-4" />
              </button>
              <button className="btn w-full justify-between">
                Quote <Quote className="h-4 w-4" />
              </button>
              <button className="btn w-full justify-between">
                Report <Flag className="h-4 w-4" />
              </button>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">
            <Link href="/forums">Forums</Link> &gt; <Link href={`/forums/${thread.category.slug}`}>{thread.category.name}</Link> &gt; {thread.title}
          </div>

          <div className="headRow">
            <div>
              <h1>{thread.title}</h1>
              <div className="desc">Thread initiated by {thread.author.name}</div>
            </div>
            <div className="toolbar">
              {!thread.locked && (
                <button className="btn primary">
                  <Reply className="h-4 w-4" />
                  Reply
                </button>
              )}
            </div>
          </div>

          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hd">
              <h3>Thread Overview</h3>
              <div className="flex items-center gap-2 text-xs text-white/50">
                {thread.pinned && (
                  <span className="tag hot">
                    <Pin className="h-3 w-3" /> Pinned
                  </span>
                )}
                {thread.locked && (
                  <span className="tag lock">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                )}
              </div>
            </div>
            <div className="bd">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={thread.author.avatar} />
                  <AvatarFallback>{thread.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className={cn("text-sm font-semibold", roleColors[thread.author.role])}>
                    {thread.author.name}
                  </div>
                  <div className="text-xs text-white/50">
                    Joined {thread.author.joinDate} - {thread.author.postCount} posts
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                {thread.content.split("\n").map((line, index) => (
                  <p key={`${thread.id}-line-${index}`}>{line}</p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/50">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {thread.createdAt}
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {thread.views} views
                </span>
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {posts.length} replies
                </span>
              </div>
            </div>
          </motion.section>

          <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
            <MessageSquare className="h-4 w-4" />
            Replies
          </div>

          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.section
                key={post.id}
                className="panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bd">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-semibold", roleColors[post.author.role])}>{post.author.name}</span>
                          <span>Joined {post.author.joinDate}</span>
                        </div>
                        <span>#{index + 1} - {post.createdAt}</span>
                      </div>
                      <p className="mt-3 text-sm text-white/70">{post.content}</p>
                      <div className="mt-4 flex items-center gap-3 text-xs text-white/50">
                        <span>{post.reactions.likes} likes</span>
                        <span>{post.reactions.hearts} hearts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          {!thread.locked && (
            <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="hd">
                <h3>Post a Reply</h3>
              </div>
              <div className="bd">
                <Textarea
                  placeholder="Write your reply"
                  value={replyContent}
                  onChange={(event) => setReplyContent(event.target.value)}
                  className="min-h-32"
                />
                <div className="mt-3 flex items-center justify-between text-xs text-white/50">
                  <span>Markdown supported</span>
                  <button className="btn primary" disabled={!replyContent.trim()}>
                    <Send className="h-4 w-4" />
                    Post Reply
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </section>
      </main>
    </div>
  );
}
