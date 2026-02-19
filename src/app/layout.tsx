// src/app/(site)/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import  { SiteFooter }from "@/components/layout/site-footer";


export const metadata: Metadata = {
  title: {
    default: "Mic’d Up Initiative",
    template: "%s | Mic’d Up Initiative",
  },
  description:
    "Mic’d Up Initiative (MUI) is a campus-based platform amplifying authentic voices, fostering mentorship, and shaping culture across higher education institutions.",
  keywords: [
    "Mic’d Up Initiative",
    "Mic’d Up Initiative Kenya",
    "Mic’d Up Initiative Africa",
    "Mic’d Up Initiative | Campus Media, Research & Mentorship Platform in Kenya",
    "campus talks",
    "African ideas",
    "student conversations",
    "public speaking",
    "documentaries",
    "podcasts",
    "university events",
    "African Universitis",
    "Campus Podcasts",
    
  ],
  authors: [{ name: "Mic’d Up Initiative" }],
  creator: "Mic’d Up Initiative",
  publisher: "Mic’d Up Initiative",

  metadataBase: new URL("https://micdupinitiative.site"), 

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://micdupinitiative.site",
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
