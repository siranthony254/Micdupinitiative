// src/app/(site)/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import  { SiteFooter }from "@/components/layout/site-footer";

/**
 * Global SEO Metadata for the Mic’d Up Initiative website. 
 */
export const metadata: Metadata = {
  title: {
    default: "Mic’d Up Initiative",
    template: "%s | Mic’d Up Initiative",
  },
  description:
    "Mic’d Up Initiative is a campus-driven media and ideas platform amplifying bold conversations, talks, documentaries, and stories shaping culture and society.",
  keywords: [
    "Mic’d Up Initiative",
    "campus talks",
    "African ideas",
    "student conversations",
    "public speaking",
    "documentaries",
    "podcasts",
    "university events",
  ],
  authors: [{ name: "Mic’d Up Initiative" }],
  creator: "Mic’d Up Initiative",
  publisher: "Mic’d Up Initiative",

  metadataBase: new URL("https://micdupinitiative.org"), // change when domain is live

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://micdupinitiative.org",
    siteName: "Mic’d Up Initiative",
    title: "Mic’d Up Initiative",
    description:
      "A campus-driven platform amplifying powerful ideas, conversations, and stories.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mic’d Up Initiative",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Mic’d Up Initiative",
    description:
      "Amplifying bold campus conversations and ideas shaping society.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-grey text-orange">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
