import type { Metadata, Viewport } from "next";
import { Inter, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blackmesarp.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Black Mesa RP - FiveM Roleplay Community",
    template: "%s | Black Mesa RP",
  },
  description:
    "Experience immersive roleplay in Los Santos. Custom scripts, active community, 500+ vehicles, and endless possibilities. Join Black Mesa RP today!",
  keywords: [
    "FiveM",
    "GTA V",
    "Roleplay",
    "RP",
    "Black Mesa",
    "Gaming",
    "GTAV RP",
    "FiveM Server",
    "Los Santos",
    "QBCore",
    "GTA Roleplay",
    "FiveM Community",
  ],
  authors: [{ name: "Black Mesa RP" }],
  creator: "Black Mesa RP",
  publisher: "Black Mesa RP",
  category: "Gaming",
  classification: "Gaming Community",
  applicationName: "Black Mesa RP",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Black Mesa RP",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Black Mesa RP",
    title: "Black Mesa RP - FiveM Roleplay Community",
    description:
      "Experience immersive roleplay in Los Santos. Custom scripts, active community, and endless possibilities.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Black Mesa RP - FiveM Roleplay Community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Black Mesa RP - FiveM Roleplay Community",
    description:
      "Experience immersive roleplay in Los Santos. Custom scripts, active community, and endless possibilities.",
    images: ["/opengraph-image"],
    creator: "@blackmesarp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png" },
    ],
  },
  other: {
    "fivem:connect": "5.78.74.196:30120",
    "discord:server": "https://discord.gg/blackmesarp",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Black Mesa RP",
  description: "A FiveM Roleplay Community offering immersive roleplay in Los Santos",
  url: baseUrl,
  logo: `${baseUrl}/icons/icon-512.png`,
  sameAs: [
    "https://discord.gg/blackmesarp",
    "https://www.tiktok.com/@blackmesarp",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${baseUrl}/tickets`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${marker.variable} font-sans antialiased safe-top safe-bottom`}>
        <SessionProvider>
          <div className="relative min-h-screen">
            <div className="plane" aria-hidden="true" />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main className="relative flex-1 pt-20 md:pt-24">{children}</main>
              <Footer />
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
