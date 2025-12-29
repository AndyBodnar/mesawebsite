"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { TypeSelector, PrioritySelector } from "@/components/tickets";

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
      router.push("/tickets/"+ticket.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/tickets" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" />Back to Tickets
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create New Ticket</h1>
          <p className="text-white/50 mb-8">Submit a support request and we will get back to you shortly.</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {error && (<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">{error}</div>)}

          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Ticket Type *</label>
              <TypeSelector value={type} onChange={setType} disabled={submitting} />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Priority</label>
              <PrioritySelector value={priority} onChange={setPriority} disabled={submitting} />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Subject *</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of your issue" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/20" disabled={submitting} />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Message *</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Provide details about your issue..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/20 resize-none" rows={6} disabled={submitting} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/tickets" className="px-4 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors">Cancel</Link>
            <button type="submit" disabled={submitting || !type || !subject.trim() || !message.trim()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit Ticket
            </button>
          </div>
        </motion.form>
      </main>
    </div>
  );
}
