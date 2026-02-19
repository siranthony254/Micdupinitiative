"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
      {
        title: "Tools of Influence",
        description: "MUI's framework for cultural impact",
        href: "/About/Tools-of-Influence",
      },
    ],
  },
  {
    label: "Initiatives",
    items: [
      {
        title: "Campus Listening & Dialogue Tours",
        description:
          "We visit campuses to listen, learn, and amplify student voices",
        href: "/Programs/campus-tours",
      },
      {
        title: "Mentorship & Leadership",
        description:
          "Identifying and nurturing voices for global impact",
        href: "/Get-Involved/ment-lead",
      },
      {
        title: "Events & Summits",
        description: "Campus dialogues and convenings",
        href: "/Programs/Events",
      },
    ],
  },
  {
    label: "Research & Insights",
    items: [
      {
        title: "Blogs",
        description: "Brief, timely takes on campus culture and youth trends",
        href: "/blog",
      },
    ],
  },
  {
    label: "Media",
    items: [
      {
        title: "Campus Podcast",
        description: "Long-form campus conversations",
        href: "/Media/Podcast",
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
    <header className="sticky top-0 z-50 bg-black text-white border-b border-white/10">
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
    src="/logo.jpeg"
    alt="Mic’d Up Initiative Logo"
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
              onMouseEnter={() => handleEnter(nav.label)}
              onMouseLeave={handleLeave}
            >
              <Link
                href={nav.href || "#"}
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

          <Link
            href="/mic-the-campus"
            className="ml-4 px-4 py-1.5 text-sm rounded-full border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition"
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

              <Link
                href="/mic-the-campus"
                onClick={() => setMobileOpen(false)}
                className="mt-6 inline-block w-full text-center px-4 py-2 rounded-full border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition"
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
