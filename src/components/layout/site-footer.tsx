// src/components/layout/site-footer.tsx
import Link from "next/link";
import {
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";

const SOCIALS = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCo-eACs6cgB61LLosjSLjtQ",
    icon: Youtube,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/micdupinitiative?igsh=cmo3ZGhpN2k2dHYz",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61578931864569",
    icon: Facebook,
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@micdupinitiative",
    icon: "tiktok",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        
        {/* Identity */}
        <div>
          <h3 className="text-white font-semibold">
            Mic’d Up Initiative
          </h3>
          <p className="mt-3 leading-relaxed">
            A youth-driven platform amplifying authentic campus voices,
            cultivating leadership, and shaping responsible cultural influence.
          </p>
          <p className="mt-4 text-xs">
            © {new Date().getFullYear()} Mic’d Up Initiative
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-medium mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline">HOME</Link></li>
            <li><Link href="/About/OurStory" className="hover:underline">ABOUT MUI</Link></li>
            <li><Link href="/About/Vision-Mission" className="hover:underline">VISION & MISSION</Link></li>
            <li><Link href="/Programs/Events" className="hover:underline">EVENTS & SUMMITS</Link></li>
            <li><Link href="/Programs/campus-tours" className="hover:underline">CAMPUS TOURS</Link></li>
          </ul>
        </div>

        {/* Content & Insights */}
        <div>
          <h4 className="text-white font-medium mb-3">
            Content & Insights
          </h4>
          <ul className="space-y-2">
            <li><Link href="/Media/Podcast" className="hover:underline">PODCAST</Link></li>
            <li><Link href="/Media/Talks" className="hover:underline">TALKS</Link></li>
            <li><Link href="/Media/Documentaries" className="hover:underline">DOCUMENTARIES</Link></li>
            <li><Link href="/Get-Involved/Partnerships" className="hover:underline">PARTNERSHIPS</Link></li>
            <li><Link href="/Get-Involved/Ambassadors" className="hover:underline">AMBASSADORS</Link></li>
          </ul>
        </div>

        {/* Contact & Updates */}
        <div>
          <h4 className="text-white font-medium mb-3">
            Stay Connected
          </h4>
          <p className="mb-3">
            Receive campus insights, stories, and research updates.
          </p>

          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="
                w-full rounded-md px-3 py-2
                bg-white/10 border border-white/20
                text-white placeholder:text-white/50
                focus:outline-none focus:border-white
              "
            />
            <button
              type="submit"
              className="
                px-4 py-2 rounded-md
                bg-white text-black
                text-sm font-medium
                hover:bg-neutral-200 transition
              "
            >
              Join
            </button>
          </form>

          {/* Social Platforms */}
          <div className="mt-6">
            <p className="mb-3 text-xs uppercase tracking-wide text-white/50">
              Follow MUI
            </p>

            <div className="flex items-center gap-4">
              {SOCIALS.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    p-2 rounded-full
                    border border-white/20
                    text-white/60
                    hover:text-white
                    hover:border-white
                    transition
                  "
                >
                  {icon === "tiktok" ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M21 8.5a7.5 7.5 0 01-4.5-1.5v6.2a5.2 5.2 0 11-4.5-5.1v2.2a3 3 0 103 3V2h2a5.5 5.5 0 003 3.5v3z"/>
                    </svg>
                  ) : (
                    // @ts-ignore
                    icon && icon({ size: 16 })
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-4 text-xs">
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/Get-Involved" className="hover:underline">Get Involved</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
