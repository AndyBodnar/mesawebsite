"use client";

import { motion } from "framer-motion";
import { Calendar, Heart, MessageSquare, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

const user = {
  id: "1",
  name: "GangsterRP",
  role: "VIP",
  joinDate: "March 2023",
  lastSeen: "Online",
  bio: "Veteran roleplayer since 2019. I love creating immersive stories and building connections with the community.",
  stats: { posts: 456, likes: 1234, characters: 3, playtime: "1,234 hours" },
  badges: ["Early Supporter", "VIP", "Top Contributor", "1000 Posts"],
};

const characters = [
  { id: "1", name: "Marcus \"Viper\" Johnson", faction: "Ballas", status: "Active", lastSeen: "2 days ago" },
  { id: "2", name: "James Rodriguez", faction: "Mechanic", status: "Active", lastSeen: "5 days ago" },
  { id: "3", name: "Lena Graves", faction: "Civilian", status: "Inactive", lastSeen: "3 weeks ago" },
];

const activity = [
  { id: "1", type: "Forum", detail: "Posted in What's your favorite RP moment?", time: "2 hours ago", icon: MessageSquare },
  { id: "2", type: "Reaction", detail: "Liked Winter Event 2024", time: "5 hours ago", icon: Heart },
  { id: "3", type: "Profile", detail: "Updated character Marcus Johnson", time: "1 day ago", icon: User },
];

const roleTags: Record<string, string> = {
  VIP: "hot",
  ADMIN: "hot",
  MEMBER: "",
};

export default function ProfilePage() {
  return (
    <div className="relative">
      <main className="wrap">
        <aside className="sidebar">
          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bd space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-[16px] border border-white/10 bg-black/50 text-center text-2xl font-semibold leading-[64px] text-white">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xl font-semibold text-white">{user.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className={cn("tag", roleTags[user.role])}>{user.role}</div>
                    <div className="inline-flex items-center gap-2 text-xs text-white/50">
                      <span className="pulse-dot" />
                      {user.lastSeen}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/60">{user.bio}</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn primary" type="button">
                  Message
                </button>
                <button className="btn" type="button">
                  Follow
                </button>
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
              <h3>Stats</h3>
            </div>
            <div className="bd grid grid-cols-2 gap-3 text-center text-sm">
              <div className="rounded-[14px] border border-white/10 bg-black/35 p-3">
                <div className="text-lg font-semibold text-white">{user.stats.posts}</div>
                <div className="text-white/50">Posts</div>
              </div>
              <div className="rounded-[14px] border border-white/10 bg-black/35 p-3">
                <div className="text-lg font-semibold text-white">{user.stats.likes}</div>
                <div className="text-white/50">Likes</div>
              </div>
              <div className="rounded-[14px] border border-white/10 bg-black/35 p-3">
                <div className="text-lg font-semibold text-white">{user.stats.characters}</div>
                <div className="text-white/50">Characters</div>
              </div>
              <div className="rounded-[14px] border border-white/10 bg-black/35 p-3">
                <div className="text-sm font-semibold text-white">{user.stats.playtime}</div>
                <div className="text-white/50">Playtime</div>
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
              <h3>Badges</h3>
            </div>
            <div className="bd flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <div key={badge} className="tag">
                  {badge}
                </div>
              ))}
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Profile &gt; {user.name}</div>

          <div className="headRow">
            <div>
              <h1>{user.name}</h1>
              <div className="desc">Roleplay record, characters, and community footprint.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary" type="button">
                Edit Profile
              </button>
              <button className="btn" type="button">
                Share
              </button>
            </div>
          </div>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bd">
              <div className="titleRow">
                <div className="tag hot">About</div>
                <div className="tag">Joined {user.joinDate}</div>
              </div>
              <p className="mt-3 text-sm text-white/70">{user.bio}</p>
            </div>
          </motion.section>

          <StaggerContainer className="threads">
            {characters.map((character) => (
              <StaggerItem key={character.id}>
                <motion.div className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                  <div className={cn("heat", character.status === "Active" ? "green" : "dim")} />
                  <div className="avatar">{character.name.charAt(0)}</div>
                  <div className="meta">
                    <div className="titleRow">
                      <div className="tTitle">{character.name}</div>
                      <div className="tag">{character.faction}</div>
                      <div className={cn("tag", character.status === "Active" && "hot")}>{character.status}</div>
                    </div>
                    <div className="sub">
                      <span>Last seen {character.lastSeen}</span>
                      <span>Character file active</span>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <Users className="h-4 w-4" />
                      <span>{character.faction}</span>
                    </div>
                    <div className="stat">
                      <Calendar className="h-4 w-4" />
                      <span>{character.lastSeen}</span>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <StaggerContainer className="threads">
            {activity.map((item) => (
              <StaggerItem key={item.id}>
                <motion.div className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                  <div className="heat dim" />
                  <div className="avatar">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="meta">
                    <div className="titleRow">
                      <div className="tTitle">{item.detail}</div>
                      <div className="tag">{item.type}</div>
                    </div>
                    <div className="sub">
                      <span>Activity feed</span>
                      <span>Updated recently</span>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <MessageSquare className="h-4 w-4" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </main>
    </div>
  );
}
