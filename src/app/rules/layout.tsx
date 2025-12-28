import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Server Rules",
  description:
    "Read the official Black Mesa RP server rules. Understand our community guidelines and roleplay standards.",
  openGraph: {
    title: "Server Rules | Black Mesa RP",
    description:
      "Read the official Black Mesa RP server rules. Understand our community guidelines and roleplay standards.",
  },
};

export default function RulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
