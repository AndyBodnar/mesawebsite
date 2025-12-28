import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizations",
  description:
    "Explore player organizations on Black Mesa RP. From gangs to businesses, find or create your crew.",
  openGraph: {
    title: "Organizations | Black Mesa RP",
    description:
      "Explore player organizations on Black Mesa RP. From gangs to businesses, find or create your crew.",
  },
};

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
