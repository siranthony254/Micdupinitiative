"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { MegaMenu } from "./mega-menu";

/* -----------------------------
   Navigation Structure

   Centred on Conversations: this semester's actual work leads,
   the wider institutional programme (About, Get Involved) follows,
   and standalone "Campus" / "What's Next" links stay direct rather
   than hiding behind a dropdown for a single destination.
------------------------------*/
const NAV_ITEMS = [
  {
    label: "Conversations",
    href: "/conversations",
    items: [
      {
        title: "Campus Podcast",
        href: "/Media/Podcast",
      },
      {
        title: "MUC Talks",
        href: "/Media/Talks",
      },
      {
        title: "Documentaries",
        href: "/Media/Documentaries",
      },
    ],
  },
  {
    label: "Insights",
    href: "",
    items: [
      {
        title: "Blogs",
        href: "/blog",
      },
      {
        title: "FAQs",
        href: "/research/faqs",
      },
    ],
  },
  {
    label: "Campus",
    href: "/Programs/campus-tours",
    items: [],
  },
  {
    label: "About",
    href: "",
    items: [
      {
        title: "Our Story",
        href: "/About/OurStory",
      },
      {
        title: "Vision & Mission",
        href: "/About/Vision-Mission",
      },
      {
        title: "Tools of Influence",
        href: "/About/Tools-of-Influence",
      },
      {
        title: "MUI Leadership",
        href: "/About/MUI-Leadership",
      },
    ],
  },
  {
    label: "Get Involved",
    href: "",
    items: [
      {
        title: "Ambassadors",
        href: "/Get-Involved/Ambassadors",
      },
      {
        title: "Partners",
        href: "/Get-Involved/Partnerships",
      },
      {
        title: "Mentors",
        href: "/Get-Involved/Mentors",
      },
      {
        title: "Mentorship & Leadership",
        href: "/Get-Involved/ment-lead",
      },
      {
        title: "Contact Us",
        href: "/contact",
      },
    ],
  },
  {
    label: "What's Next",
    href: "/Programs/Events",
    items: [],
  },
];

export function SiteHeader() {
  const pathname = usePathname();

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

  const handleHomeClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 text-white border-b border-white/10" style={{backgroundColor: '#0D1F35'}}>
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center">
        
        {/* Brand with Logo */}
        <Link
          href="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2 font-semibold text-lg tracking-tight text-amber-500"
        >
          {/* Logo */}
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
  <Image
    src="/favicon.ico"
    alt="Mic’d Up Initiative"
    fill
    sizes="32px"
    className="object-cover"
    priority
  />
</div>


          {/* Fallback placeholder if logo removed */}
          {/* Remove this if not needed */}
          {/* <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40" /> */}

          Mic’d Up Initiative
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden lg:flex items-center gap-8">
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`
              relative text-sm font-medium transition
              ${
                pathname === "/"
                  ? "text-amber-400"
                  : "text-white/80 hover:text-white"
              }
              after:absolute after:left-0 after:-bottom-1
              after:h-px after:bg-amber-400 after:transition-all
              ${
                pathname === "/"
                  ? "after:w-full"
                  : "after:w-0 hover:after:w-full"
              }
            `}
          >
            Home
          </Link>

          {NAV_ITEMS.map((nav) => (
            <div
              key={nav.label}
              className="relative"
              onMouseEnter={() => nav.items.length > 0 && handleEnter(nav.label)}
              onMouseLeave={handleLeave}
            >
              <Link
                href={nav.href || "#"}
                className={`
                  relative text-sm font-medium transition
                  ${
                    active === nav.label || pathname === nav.href
                      ? "text-amber-400"
                      : "text-white/80 hover:text-white"
                  }
                  after:absolute after:left-0 after:-bottom-1
                  after:h-px after:bg-amber-400 after:transition-all
                  ${
                    active === nav.label || pathname === nav.href
                      ? "after:w-full"
                      : "after:w-0 hover:after:w-full"
                  }
                `}
              >
                {nav.label}
              </Link>

              {active === nav.label && nav.items.length > 0 && (
                <MegaMenu items={nav.items} />
              )}
            </div>
          ))}
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
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-amber-500">
                Mic’d Up Initiative
              </span>
              <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              title="Close menu"
>
  <X size={24} />
</button>

            </div>

            <div className="space-y-4">
              <Link
                href="/"
                onClick={() => {
                  handleHomeClick();
                  setMobileOpen(false);
                }}
                className="block py-3 text-base font-medium text-white"
              >
                Home
              </Link>

              {NAV_ITEMS.map((nav) =>
                nav.items.length > 0 ? (
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
                      <div className="ml-4 mt-1 space-y-2 border-l border-white/10 pl-4">
                        {nav.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="block text-xs text-white/70 hover:text-white"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={nav.label}
                    href={nav.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-base font-medium text-white"
                  >
                    {nav.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
