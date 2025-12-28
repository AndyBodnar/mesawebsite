"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Plus, Loader2, CalendarOff, X, Server, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

interface EventUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string | null;
  type: string;
  startTime: string;
  endTime: string | null;
  recurring: string | null;
  maxAttendees: number | null;
  createdAt: string;
  authorId: string;
  User: EventUser;
  _count: { EventRsvp: number };
}

export default function EventsPage() {
  const { data: session } = useSession();
  const [serverEvents, setServerEvents] = useState<Event[]>([]);
  const [communityEvents, setCommunityEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState<"Server" | "Community">("Community");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const isAdmin = session?.user && ["ADMIN", "SUPERADMIN"].includes((session.user as { role?: string }).role || "");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const [serverRes, communityRes] = await Promise.all([
          fetch("/api/events?type=Server&upcoming=true"),
          fetch("/api/events?type=Community&upcoming=true"),
        ]);

        if (!serverRes.ok || !communityRes.ok) {
          throw new Error("Failed to fetch events");
        }

        const serverData = await serverRes.json();
        const communityData = await communityRes.json();

        setServerEvents(serverData);
        setCommunityEvents(communityData);
      } catch {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  function openCreateModal(type: "Server" | "Community") {
    setCreateType(type);
    setShowCreate(true);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setLocation("");
    setStartTime("");
    setEndTime("");
    setMaxAttendees("");
    setCreateError(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !startTime) {
      setCreateError("Please fill in all required fields");
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          location: location || null,
          startTime,
          endTime: endTime || null,
          type: createType,
          maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create event");
      }

      const newEvent = await res.json();

      if (createType === "Server") {
        setServerEvents((prev) => [...prev, newEvent].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()));
      } else {
        setCommunityEvents((prev) => [...prev, newEvent].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()));
      }

      setShowCreate(false);
      resetForm();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
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
            <CalendarOff className="h-12 w-12 text-red-500" />
            <p className="text-white/70">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Create {createType} Event</h2>
                <button onClick={() => setShowCreate(false)} className="text-white/50 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {createError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                    {createError}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-white/70 mb-2">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Event title"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                    disabled={creating}
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Event description"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20 resize-none"
                    disabled={creating}
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Event location"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                    disabled={creating}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Start Time *</label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/20"
                      disabled={creating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">End Time</label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/20"
                      disabled={creating}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Max Attendees</label>
                  <input
                    type="number"
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(e.target.value)}
                    placeholder="Leave empty for unlimited"
                    min="1"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                    disabled={creating}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="btn flex-1"
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !title.trim() || !description.trim() || !startTime}
                    className="btn primary flex-1 flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Create Event
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="wrap">
        <section className="main full">
          <div className="crumbs">Events</div>

          <div className="headRow">
            <div>
              <h1>Events</h1>
              <div className="desc">Upcoming server and community events.</div>
            </div>
          </div>

          {/* Server Events Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-semibold">Server Events</h2>
                <span className="text-sm text-white/50">Official events by staff</span>
              </div>
              {isAdmin && (
                <button className="btn primary" onClick={() => openCreateModal("Server")}>
                  <Plus className="h-4 w-4" />
                  Create Server Event
                </button>
              )}
            </div>

            {serverEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-lg border border-white/10">
                <CalendarOff className="h-8 w-8 text-white/30 mb-2" />
                <p className="text-white/50">No upcoming server events</p>
              </div>
            ) : (
              <div className="threads">
                {serverEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <motion.div className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                      <div className="heat green" />
                      <div className="avatar">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="meta">
                        <div className="titleRow">
                          <div className="tTitle">{event.title}</div>
                          <div className="tag hot">Server</div>
                        </div>
                        <div className="sub">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {format(new Date(event.startTime), "MMM d, yyyy - h:mm a")}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="stats">
                        <div className="stat">
                          <Users className="h-4 w-4" />
                          <span>{event._count.EventRsvp}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Community Events Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <UsersRound className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Community Events</h2>
                <span className="text-sm text-white/50">Events by community members</span>
              </div>
              {session?.user && (
                <button className="btn primary" onClick={() => openCreateModal("Community")}>
                  <Plus className="h-4 w-4" />
                  Create Community Event
                </button>
              )}
            </div>

            {communityEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-lg border border-white/10">
                <CalendarOff className="h-8 w-8 text-white/30 mb-2" />
                <p className="text-white/50">No upcoming community events</p>
              </div>
            ) : (
              <div className="threads">
                {communityEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <motion.div className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                      <div className="heat" />
                      <div className="avatar">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="meta">
                        <div className="titleRow">
                          <div className="tTitle">{event.title}</div>
                          <div className="tag">Community</div>
                        </div>
                        <div className="sub">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {format(new Date(event.startTime), "MMM d, yyyy - h:mm a")}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="stats">
                        <div className="stat">
                          <Users className="h-4 w-4" />
                          <span>{event._count.EventRsvp}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
