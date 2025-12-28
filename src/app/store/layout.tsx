import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Support Black Mesa RP and get exclusive in-game perks, vehicles, and cosmetic items.",
  openGraph: {
    title: "Store | Black Mesa RP",
    description:
      "Support Black Mesa RP and get exclusive in-game perks, vehicles, and cosmetic items.",
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
