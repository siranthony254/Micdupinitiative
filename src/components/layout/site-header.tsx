"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { MegaMenu } from "./mega-menu";

/* -----------------------------
   Navigation Structure
------------------------------*/
const NAV_ITEMS = [
  {
    label: "About",
    href: "",
    items: [
      {
        title: "Our Story",
        description: "Our origin and journey",
        href: "/About/OurStory",
      },
      {
        title: "Vision & Mission",
        description: "What Mic’d Up stands for",
        href: "/About/Vision-Mission",
      },
      {
        title: "MUI Leadership",
        description: "Founding directors and governance",
        href: "/About/MUI-Leadership",
      },
    ],
  },
  {
    label: "Programs",
    href: "",
    items: [
      {
        title: "Talent & Mentorship",
        description: "Identifying and nurturing voices(coming soon)",
        href: "",
      },
      {
        title: "Leadership Formation",
        description: "Values-driven leadership development (coming soon)",
        href: "",
      },
      {
        title: "Events & Summits",
        description: "Campus dialogues and convenings (coming soon)",
        href: "",
      },
    ],
  },
  {
    label: "Research & Insights",
    href: "",
    items: [
      {
        title: "Campus Reports",
        description: "Original student-focused research(coming soon)",
        href: "",
      },
      {
        title: "Youth Trends",
        description: "Emerging voices and movements(coming soon)",
        href: "",
      },
    ],
  },
  {
    label: "Media",
    href: "",
    items: [
      {
        title: "Campus Podcast",
        description: "Long-form campus conversations",
        href: "/Media/Podcast",
      },
      {
        title: "Voices & Stories",
        description: "Narratives from student life",
        href: "/Media/stories",
      },
      {
        title: "MUC Talks",
        description: "Stage talks and panels",
        href: "/Media/Talks",
      },
      {
        title: "Documentaries",
        description: "Deep-dive visual stories",
        href: "/Media/Documentaries",
      },
    ],
  },
  {
    label: "Get Involved",
    href: "",
    items: [
      {
        title: "Ambassadors",
        description: "Represent Mic’d Up on your campus",
        href: "/Get-Involved/Ambassadors",
      },
      {
        title: "Partners",
        description: "Collaborate with the initiative",
        href: "/Get-Involved/Partnerships",
      },
      {
        title: "Mentors",
        description: "Guide emerging voices",
        href: "/Get-Involved/Mentors",
      },
      {
        title: "Contact Us",
        description: "Get in touch with us",
        href: "/contact",
      },
    ],
  },
];

export function SiteHeader() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileActive, setMobileActive] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActive(label);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setActive(null), 120);
  };

  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center">

        {/* Brand */}
        <Link
          href="/"
          className="font-semibold text-lg tracking-tight text-amber-500"
        >
          Mic’d Up Initiative
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((nav) => (
            <div
              key={nav.label}
              className="relative"
              onMouseEnter={() => handleEnter(nav.label)}
              onMouseLeave={handleLeave}
            >
              <Link
                href={nav.href}
                className={`
                  relative text-sm font-medium transition
                  ${
                    active === nav.label
                      ? "text-amber-400"
                      : "text-white/80 hover:text-white"
                  }
                  after:absolute after:left-0 after:-bottom-1
                  after:h-px after:bg-amber-400 after:transition-all
                  ${
                    active === nav.label
                      ? "after:w-full"
                      : "after:w-0 hover:after:w-full"
                  }
                `}
              >
                {nav.label}
              </Link>

              {active === nav.label && <MegaMenu items={nav.items} />}
            </div>
          ))}

          {/* Desktop CTA */}
          <Link
            href="/mic-the-campus"
            className="
              ml-4 px-4 py-1.5 text-sm rounded-full
              border border-amber-400 text-amber-400
              hover:bg-amber-400 hover:text-black transition
            "
          >
            Mic the Campus
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="ml-auto lg:hidden text-white/80 hover:text-white"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur">
          <div className="px-6 py-5">

            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-amber-500">
                Mic’d Up Initiative
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Nav Items */}
            <div className="space-y-4">
              {NAV_ITEMS.map((nav) => (
                <div key={nav.label}>
                  <button
                    onClick={() =>
                      setMobileActive(
                        mobileActive === nav.label ? null : nav.label
                      )
                    }
                    className="w-full flex items-center justify-between py-3 text-left text-base font-medium"
                  >
                    {nav.label}
                    <ChevronDown
                      size={18}
                      className={`transition ${
                        mobileActive === nav.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileActive === nav.label && (
                    <div className="ml-4 mt-2 space-y-3 border-l border-white/10 pl-4">
                      {nav.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="block text-sm text-white/70 hover:text-white"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile CTA */}
              <Link
                href="/mic-the-campus"
                onClick={() => setMobileOpen(false)}
                className="
                  mt-6 inline-block w-full text-center
                  px-4 py-2 rounded-full
                  border border-amber-400
                  text-amber-400
                  hover:bg-amber-400 hover:text-black
                  transition
                "
              >
                Mic the Campus
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
