"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Heart, Eye, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Screenshots", "Artwork", "Videos", "Memes"];

const galleryItems = [
  { id: "1", title: "Sunset at Del Perro Pier", author: "PhotoPro", likes: 234, views: 1234, category: "Screenshots" },
  { id: "2", title: "Gang War Scene", author: "GangsterRP", likes: 189, views: 987, category: "Screenshots" },
  { id: "3", title: "Custom Character Art", author: "ArtistX", likes: 456, views: 2341, category: "Artwork" },
  { id: "4", title: "High Speed Chase", author: "ActionCam", likes: 312, views: 1567, category: "Videos" },
  { id: "5", title: "LSPD Group Photo", author: "ChiefMiller", likes: 278, views: 1123, category: "Screenshots" },
  { id: "6", title: "When you forget to brake", author: "MemeLord", likes: 567, views: 3456, category: "Memes" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="relative">
      <main className="wrap">
        <aside className="sidebar">
          <motion.section className="panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hd">
              <h3>Filters</h3>
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
        </aside>

        <section className="main">
          <div className="crumbs">Gallery</div>

          <div className="headRow">
            <div>
              <h1>Gallery</h1>
              <div className="desc">Community screenshots, clips, and artwork.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary">
                <Plus className="h-4 w-4" />
                Upload
              </button>
            </div>
          </div>

          <div className="threads">
            {filtered.map((item) => (
              <motion.div key={item.id} className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                <div className={cn("heat", item.likes > 300 && "green")} />
                <div className="avatar">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div className="meta">
                  <div className="titleRow">
                    <div className="tTitle">{item.title}</div>
                    <div className="tag">{item.category}</div>
                  </div>
                  <div className="sub">
                    <span>by <strong>{item.author}</strong></span>
                  </div>
                </div>
                <div className="stats">
                  <div className="stat">
                    <Heart className="h-4 w-4" />
                    <span>{item.likes}</span>
                  </div>
                  <div className="stat">
                    <Eye className="h-4 w-4" />
                    <span>{item.views}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
