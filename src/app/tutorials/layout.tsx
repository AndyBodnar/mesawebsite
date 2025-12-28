import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started",
  description:
    "Learn how to get started on Black Mesa RP. Step-by-step guides for new players including installation and first steps.",
  openGraph: {
    title: "Getting Started | Black Mesa RP",
    description:
      "Learn how to get started on Black Mesa RP. Step-by-step guides for new players including installation and first steps.",
  },
};

export default function TutorialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
