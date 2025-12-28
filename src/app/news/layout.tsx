import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description:
    "Stay updated with the latest announcements, updates, and community news from Black Mesa RP.",
  openGraph: {
    title: "News | Black Mesa RP",
    description:
      "Stay updated with the latest announcements, updates, and community news from Black Mesa RP.",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
