"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Heart, Plus, Loader2, ImageOff, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface GalleryUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface GalleryItem {
  id: string;
  type: string;
  url: string;
  caption: string | null;
  approved: boolean;
  featured: boolean;
  likes: number;
  createdAt: string;
  userId: string;
  User: GalleryUser;
  _count: { GalleryComment: number };
}

interface GalleryResponse {
  items: GalleryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const categories = ["All", "image", "video", "artwork"];

const categoryLabels: Record<string, string> = {
  All: "All",
  image: "Screenshots",
  video: "Videos",
  artwork: "Artwork",
};
export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  useEffect(() => {
    async function fetchGallery() {
      setLoading(true);
      try {
        const typeParam = activeCategory !== "All" ? `&type=${activeCategory}` : "";
        const res = await fetch(`/api/gallery?page=${pagination.page}&limit=20${typeParam}`);
        if (!res.ok) {
          throw new Error("Failed to load gallery");
        }
        const data: GalleryResponse = await res.json();
        setItems(data.items);
        setPagination(data.pagination);
      } catch {
        setError("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, [activeCategory, pagination.page]);

  if (loading && items.length === 0) {
    return (
      <div className="relative">
        <main className="wrap">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-white/50" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <main className="wrap">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <ImageOff className="h-12 w-12 text-red-500" />
            <p className="text-white/70">{error}</p>
          </div>
        </main>
      </div>
    );
  }
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
                    onClick={() => {
                      setActiveCategory(cat);
                      setPagination(p => ({ ...p, page: 1 }));
                    }}
                  >
                    {categoryLabels[cat] || cat}
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
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <ImageOff className="h-12 w-12 text-white/30" />
              <p className="text-white/50">No gallery items yet</p>
            </div>
          ) : (
            <div className="threads">
              {items.map((item) => (
                <motion.div key={item.id} className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                  <div className={cn("heat", item.featured && "green")} />
                  <div className="avatar">
                    {item.type === "video" ? (
                      <span>V</span>
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="meta">
                    <div className="titleRow">
                      <div className="tTitle">{item.caption || "Untitled"}</div>
                      <div className="tag">{categoryLabels[item.type] || item.type}</div>
                      {item.featured && <div className="tag hot">Featured</div>}
                    </div>
                    <div className="sub">
                      <span>by <strong>{item.User?.name || "Unknown"}</strong></span>
                      <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <Heart className="h-4 w-4" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="stat">
                      <MessageSquare className="h-4 w-4" />
                      <span>{item._count.GalleryComment}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          {pagination.pages > 1 && (
            <div className="pager">
              <div>Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} items</div>
              <div className="pages">
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={cn("page", pagination.page === p && "on")}
                    onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                  >
                    {p}
                  </button>
                ))}
                {pagination.pages > 5 && (
                  <button
                    className="page"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, pagination.pages) }))}
                  >
                    &gt;
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
