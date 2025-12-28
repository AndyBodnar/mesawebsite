import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Map",
  description:
    "View real-time player positions and activity on the Black Mesa RP server map.",
  openGraph: {
    title: "Live Map | Black Mesa RP",
    description:
      "View real-time player positions and activity on the Black Mesa RP server map.",
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
