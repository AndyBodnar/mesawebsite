import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover upcoming community events, car meets, roleplay scenarios, and special activities on Black Mesa RP.",
  openGraph: {
    title: "Events | Black Mesa RP",
    description:
      "Discover upcoming community events, car meets, roleplay scenarios, and special activities on Black Mesa RP.",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
