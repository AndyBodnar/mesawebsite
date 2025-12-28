"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
  { id: "1", title: "Winter Car Meet 2024", date: "Dec 22, 2024", time: "8:00 PM EST", location: "LS Customs", attendees: 45, category: "Community" },
  { id: "2", title: "LSPD Ride-Along Program", date: "Dec 23, 2024", time: "6:00 PM EST", location: "Mission Row PD", attendees: 12, category: "LEO" },
  { id: "3", title: "New Year's Eve Party", date: "Dec 31, 2024", time: "11:00 PM EST", location: "Diamond Casino", attendees: 89, category: "Community" },
  { id: "4", title: "Gang Warfare Tournament", date: "Jan 5, 2025", time: "7:00 PM EST", location: "Grove Street", attendees: 34, category: "Competition" },
];

const categories = ["All", "Community", "LEO", "Competition"];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return events;
    return events.filter((event) => event.category === activeCategory);
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
          <div className="crumbs">Events</div>

          <div className="headRow">
            <div>
              <h1>Events</h1>
              <div className="desc">Upcoming community operations and live schedules.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary">
                <Plus className="h-4 w-4" />
                Create Event
              </button>
            </div>
          </div>

          <div className="threads">
            {filtered.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <motion.div className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                  <div className={cn("heat", event.category === "LEO" && "green")} />
                  <div className="avatar">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="meta">
                    <div className="titleRow">
                      <div className="tTitle">{event.title}</div>
                      <div className="tag">{event.category}</div>
                    </div>
                    <div className="sub">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {event.date} - {event.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees}</span>
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
