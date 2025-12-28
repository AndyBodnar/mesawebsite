import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forums",
  description:
    "Join the conversation with the Black Mesa RP community. Discuss roleplay, share stories, and connect with fellow players.",
  openGraph: {
    title: "Forums | Black Mesa RP",
    description:
      "Join the conversation with the Black Mesa RP community. Discuss roleplay, share stories, and connect with fellow players.",
  },
};

export default function ForumsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
