import { SanityLive } from '@/sanity/lib/live'

export const metadata: Metadata = {
  title: {
    default: "Mic’d Up Initiative",
    template: "%s | Mic’d Up Initiative",
  },
  description:
    "A campus-driven platform amplifying powerful ideas, conversations, and stories. Discover bold campus conversations and ideas shaping society from higher education institutions and beyond. Join us in amplifying the voices of students and fostering a culture of open dialogue and intellectual exchange.",
  keywords: [
    "Mic’d Up Initiative",
    "Mic’d Up Initiative Kenya",
    "Mic’d Up Initiative Africa",
    "Mic’d Up Initiative | Campus Media, Research & Mentorship Platform in Kenya",
    "MUI Kenya",
    "MUI Africa",
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
  manifest: "/site.webmanifest",

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
      "Amplifying bold campus conversations and ideas shaping society from higher education institutions and beyond.",
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
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
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
        <AuthProvider>
          <SiteHeader />
          
          <main className="flex-1">
            {children}
          </main>

          <SiteFooter />

          {/* Cookie Consent Banner */}
          <CookieConsent />

          <SanityLive />
        </AuthProvider>
      </body>
    </html>
  );
}