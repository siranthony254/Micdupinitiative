"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Tag = "div" | "section" | "header";

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  /** Extra transition-delay in ms, for staggering siblings. */
  delay?: number;
  as?: Tag;
}

/**
 * A framer-motion-free "fade up once when scrolled into view" wrapper.
 * Replaces the common `motion.div variants={fadeUp} whileInView="visible"`
 * pattern used across the site for purely decorative scroll reveals, so
 * those pages don't need to be client components pulling in the whole
 * framer-motion bundle just for this effect.
 *
 * Respects prefers-reduced-motion: the transition/translate classes only
 * apply under the `motion-safe` variant, so reduced-motion users simply
 * see the content in place with no animation.
 */
export function FadeInSection({ children, className = "", delay = 0, as = "div" }: FadeInSectionProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const combinedClassName = [
    className,
    "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out",
    visible ? "motion-safe:opacity-100 motion-safe:translate-y-0" : "motion-safe:opacity-0 motion-safe:translate-y-7",
  ].join(" ");

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  const setRef = (node: HTMLElement | null) => {
    elRef.current = node;
  };

  if (as === "section") {
    return (
      <section ref={setRef} className={combinedClassName} style={style}>
        {children}
      </section>
    );
  }
  if (as === "header") {
    return (
      <header ref={setRef} className={combinedClassName} style={style}>
        {children}
      </header>
    );
  }
  return (
    <div ref={setRef} className={combinedClassName} style={style}>
      {children}
    </div>
  );
}
