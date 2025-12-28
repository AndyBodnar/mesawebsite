import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse screenshots and videos from Black Mesa RP. See the best moments captured by our community.",
  openGraph: {
    title: "Gallery | Black Mesa RP",
    description:
      "Browse screenshots and videos from Black Mesa RP. See the best moments captured by our community.",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
