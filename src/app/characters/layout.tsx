import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Characters",
  description:
    "Explore character profiles from Black Mesa RP. Discover the stories of Los Santos residents.",
  openGraph: {
    title: "Characters | Black Mesa RP",
    description:
      "Explore character profiles from Black Mesa RP. Discover the stories of Los Santos residents.",
  },
};

export default function CharactersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
