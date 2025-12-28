import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications",
  description:
    "Apply for whitelisted roles on Black Mesa RP. Join LEO, EMS, staff, or other specialized positions.",
  openGraph: {
    title: "Applications | Black Mesa RP",
    description:
      "Apply for whitelisted roles on Black Mesa RP. Join LEO, EMS, staff, or other specialized positions.",
  },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
