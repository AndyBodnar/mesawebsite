"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Link as LinkIcon, Image, List, Code, Send, Eye } from "lucide-react";

export default function NewThreadPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const category = {
    name: "General Discussion",
    slug: "general",
  };

  const formatButtons = [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: LinkIcon, label: "Link" },
    { icon: Image, label: "Image" },
    { icon: List, label: "List" },
    { icon: Code, label: "Code" },
  ];

  return (
    <div className="relative">
      <main className="wrap">
        <aside className="sidebar">
          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hd">
              <h3>Posting Guidelines</h3>
            </div>
            <div className="bd space-y-2 text-xs text-white/60">
              <p>Keep it respectful and on topic.</p>
              <p>Use clear titles and avoid duplicates.</p>
              <p>Share context and details for better replies.</p>
            </div>
          </motion.section>

          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="hd">
              <h3>Formatting</h3>
            </div>
            <div className="bd">
              <div className="filters">
                {formatButtons.map((btn) => (
                  <div key={btn.label} className="chip">
                    <btn.icon className="h-3 w-3" />
                    {btn.label}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">
            <Link href="/forums">Forums</Link> &gt; <Link href={`/forums/${category.slug}`}>{category.name}</Link> &gt; New Thread
          </div>

          <div className="headRow">
            <div>
              <h1>Create New Thread</h1>
              <div className="desc">Start a new discussion inside {category.name}.</div>
            </div>
            <div className="toolbar">
              <button className="btn" onClick={() => setIsPreview(false)}>
                Write
              </button>
              <button className="btn" onClick={() => setIsPreview(true)}>
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>
          </div>

          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bd space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-white/60">Thread Title</label>
                <Input
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-white/60">Content</label>
                {isPreview ? (
                  <div className="mt-2 rounded-[14px] border border-white/10 bg-black/35 p-4 text-sm text-white/70">
                    {content ? content : "Nothing to preview yet."}
                  </div>
                ) : (
                  <Textarea
                    placeholder="Write your thread content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    className="mt-2 min-h-48"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link href={`/forums/${category.slug}`} className="btn">
                  Cancel
                </Link>
                <button className="btn primary" disabled={!title.trim() || !content.trim()}>
                  <Send className="h-4 w-4" />
                  Create Thread
                </button>
              </div>
            </div>
          </motion.section>
        </section>
      </main>
    </div>
  );
}
