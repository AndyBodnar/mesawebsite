import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboards",
  description:
    "View top players and rankings on Black Mesa RP. See who leads in playtime, wealth, and achievements.",
  openGraph: {
    title: "Leaderboards | Black Mesa RP",
    description:
      "View top players and rankings on Black Mesa RP. See who leads in playtime, wealth, and achievements.",
  },
};

export default function LeaderboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
