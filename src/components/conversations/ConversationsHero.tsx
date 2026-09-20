"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Drop your hero images at these paths (public/images/). Add more
// conversations-hero-N.jpg files and extend this array to rotate through
// more than two. Any path that doesn't exist yet is skipped automatically,
// so the hero still looks intentional before the images are uploaded.
const HERO_IMAGES = ["/images/conversations-hero-1.jpg", "/images/conversations-hero-2.jpg"];

export function ConversationsHero() {
  const [failed, setFailed] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = HERO_IMAGES.filter((src) => !failed.includes(src));

  useEffect(() => {
    if (images.length < 2) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const currentIndex = images.length > 0 ? activeIndex % images.length : 0;

  return (
    <div
      className="relative h-[60vh] min-h-[420px] overflow-hidden"
      style={{ backgroundColor: "#0D1F35" }}
    >
      {images.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
            onError={() => setFailed((prev) => (prev.includes(src) ? prev : [...prev, src]))}
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </div>
      ))}

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-amber-300">
            This Semester
          </span>

          <h1 className="mt-4 mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            MUI Conversations
          </h1>

          <p className="mx-auto max-w-3xl text-lg md:text-xl leading-relaxed text-white/90">
            The work is the conversation. The media is how we carry it further —
            campus podcasts, talks, and documentaries, organized the way MUI is
            actually thinking about them.
          </p>
        </div>
      </div>
    </div>
  );
}
