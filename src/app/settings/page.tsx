"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Camera, Palette, Save, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const notificationOptions = [
  "Forum replies",
  "Direct messages",
  "Event reminders",
  "News updates",
  "Ticket updates",
];

const privacyOptions = [
  "Show online status",
  "Allow direct messages",
  "Show profile publicly",
  "Show playtime",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
    "Forum replies": true,
    "Direct messages": true,
    "Event reminders": true,
    "News updates": false,
    "Ticket updates": true,
  });
  const [privacyPrefs, setPrivacyPrefs] = useState<Record<string, boolean>>({
    "Show online status": true,
    "Allow direct messages": true,
    "Show profile publicly": true,
    "Show playtime": false,
  });

  const togglePref = (type: "notifications" | "privacy", key: string) => {
    if (type === "notifications") {
      setNotificationPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
      return;
    }
    setPrivacyPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeTitle = useMemo(
    () => tabs.find((tab) => tab.id === activeTab)?.label ?? "Settings",
    [activeTab]
  );

  return (
    <div className="relative">
      <main className="wrap">
        <aside className="sidebar">
          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hd">
              <h3>Settings</h3>
            </div>
            <div className="bd">
              <div className="filters">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={cn("chip inline-flex items-center gap-2", activeTab === tab.id && "on")}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="hd">
              <h3>Account Status</h3>
            </div>
            <div className="bd space-y-2 text-sm text-white/60">
              <div className="flex items-center justify-between">
                <span>Role</span>
                <span className="text-white">VIP</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Linked</span>
                <span className="text-white">Discord</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last login</span>
                <span className="text-white">2 hours ago</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="hd">
              <h3>Security</h3>
            </div>
            <div className="bd space-y-2 text-sm text-white/60">
              <div>Two factor authentication is recommended.</div>
              <button className="btn w-full justify-center" type="button">
                Enable 2FA
              </button>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Profile &gt; Settings</div>

          <div className="headRow">
            <div>
              <h1>{activeTitle}</h1>
              <div className="desc">Personalize how you show up across the site.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary" type="button">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bd">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="relative h-24 w-24 overflow-hidden rounded-[18px] border border-white/10 bg-black/40">
                      <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white">G</div>
                      <button
                        type="button"
                        className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.28em] text-white/50">Profile Picture</div>
                      <div className="mt-1 text-white/70">PNG or JPG, max 4MB</div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.28em] text-white/50">Display Name</label>
                      <Input defaultValue="GangsterRP" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-[0.28em] text-white/50">Email</label>
                      <Input defaultValue="user@example.com" disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.28em] text-white/50">Bio</label>
                    <Textarea defaultValue="Veteran roleplayer since 2019..." rows={4} />
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-3">
                  {notificationOptions.map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-[14px] border border-white/10 bg-black/35 px-4 py-3">
                      <span className="text-sm text-white/70">{item}</span>
                      <button
                        type="button"
                        aria-pressed={notificationPrefs[item]}
                        onClick={() => togglePref("notifications", item)}
                        className={cn(
                          "relative h-6 w-12 rounded-full border border-white/10 transition",
                          notificationPrefs[item] ? "bg-red-500/70" : "bg-black/60"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-1 block h-4 w-4 rounded-full bg-white transition",
                            notificationPrefs[item] ? "right-1" : "left-1"
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="space-y-3">
                  {privacyOptions.map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-[14px] border border-white/10 bg-black/35 px-4 py-3">
                      <span className="text-sm text-white/70">{item}</span>
                      <button
                        type="button"
                        aria-pressed={privacyPrefs[item]}
                        onClick={() => togglePref("privacy", item)}
                        className={cn(
                          "relative h-6 w-12 rounded-full border border-white/10 transition",
                          privacyPrefs[item] ? "bg-red-500/70" : "bg-black/60"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-1 block h-4 w-4 rounded-full bg-white transition",
                            privacyPrefs[item] ? "right-1" : "left-1"
                          )}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-4">
                  <div className="text-sm text-white/70">Theme</div>
                  <div className="flex flex-wrap gap-3">
                    <button type="button" className="h-12 w-12 rounded-[12px] border border-red-500/60 bg-black/70" />
                    <button type="button" className="h-12 w-12 rounded-[12px] border border-white/10 bg-white" />
                    <button type="button" className="h-12 w-12 rounded-[12px] border border-white/10 bg-gradient-to-br from-black to-zinc-700" />
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        </section>
      </main>
    </div>
  );
}

