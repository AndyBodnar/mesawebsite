"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ticketTypes = [
  { value: "Bug", label: "Bug Report", desc: "Something is broken or not working correctly" },
  { value: "Support", label: "Support Request", desc: "Need help with your account or features" },
  { value: "Report", label: "Player Report", desc: "Report a player for rule violations" },
  { value: "Appeal", label: "Ban Appeal", desc: "Appeal a ban or punishment" },
  { value: "Other", label: "Other", desc: "General inquiries or other issues" },
];

const priorityOptions = [
  { value: "LOW", label: "Low", desc: "Not urgent, can wait" },
  { value: "MEDIUM", label: "Medium", desc: "Normal priority" },
  { value: "HIGH", label: "High", desc: "Important issue" },
  { value: "URGENT", label: "Urgent", desc: "Requires immediate attention" },
];
export default function NewTicketPage() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type || !subject.trim() || !message.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, priority, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create ticket");
      }

      const ticket = await res.json();
      router.push(`/tickets/${ticket.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="relative">
      <main className="wrap">
        <section className="main full">
          <div className="crumbs">
            <Link href="/tickets" className="flex items-center gap-2 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Link>
          </div>

          <div className="headRow">
            <div>
              <h1>Create New Ticket</h1>
              <div className="desc">Submit a support request and we will get back to you shortly.</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="ticket-form">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 mb-6">
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Ticket Type *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ticketTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all",
                      type === t.value
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    )}
                  >
                    <div className="font-medium">{t.label}</div>
                    <div className="text-sm text-white/50">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <div className="flex flex-wrap gap-3">
                {priorityOptions.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={cn(
                      "px-4 py-2 rounded-lg border transition-all",
                      priority === p.value
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20"
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide details about your issue. Include any relevant information like screenshots, error messages, or steps to reproduce."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/40 resize-none focus:outline-none focus:border-white/20"
                rows={6}
                disabled={submitting}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Link href="/tickets" className="btn">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || !type || !subject.trim() || !message.trim()}
                className="btn primary flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Submit Ticket
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
