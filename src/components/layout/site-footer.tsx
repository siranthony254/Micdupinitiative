// src/components/layout/site-footer.tsx
import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";
import {
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  LucideLinkedin
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
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 text-white/70" style={{backgroundColor: '#0D1F35'}}>
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        
        {/* Identity */}
        <div>
          <h3 className="text-white font-semibold">
            Mic’d Up Initiative
          </h3>
          <p className="mt-3 leading-relaxed">
            A mission-driven youth institution committed to transforming campus culture 
            by amplifying authentic culture-shaping voices, talents, and ideas through 
            storytelling, mentorship, research, productions, and public conversations. 
          </p>
          <p className="mt-4 text-xs">
            © {new Date().getFullYear()} Mic’d Up Initiative
          </p>
        </div>

        {/* Programs & Media */}
        <div>
          <h4 className="text-white font-medium mb-3">
            Quick Links
          </h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/Programs/Events" className="hover:underline">Events, Tours &amp; Summits</Link></li>
            <li><Link href="/conversations" className="hover:underline">MUI Conversations</Link></li>
            <li><Link href="/blog" className="hover:underline">Blog</Link></li>
            <li><Link href="/updates" className="hover:underline">Updates</Link></li>
          </ul>
        </div>

        {/* Research & Governance */}
        <div>
          <h4 className="text-white font-medium mb-3">
            The Initiative
          </h4>
          <ul className="space-y-2">
            <li><Link href="/About/Vision-Mission" className="hover:underline">Vision, Mission & How We Work</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/cookie-policy" className="hover:underline">Cookie Policy</Link></li>
            <li><Link href="/data-protection" className="hover:underline">Data Protection Policy</Link></li>
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

          <NewsletterForm />

          {/* Social Platforms */}
          <div className="mt-6">
          <p className="mb-3 text-xs uppercase tracking-wide text-white/50">
            Follow MUI
          </p>

          <div className="flex items-center gap-4">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
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
                      <Icon size={16} />
                    </Link>
                  ))}
                </div>
              </div>
        </div>
      </div>
    </footer>
  );
}
