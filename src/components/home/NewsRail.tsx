'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import type { SanityUpdate } from '@/types/update';

interface NewsRailProps {
  updates: SanityUpdate[];
  onUpdateClick: (update: SanityUpdate) => void;
}

export function NewsRail({ updates, onUpdateClick }: NewsRailProps) {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContentWidth(containerRef.current.scrollWidth / 2);
    }
  }, [updates]);

  useEffect(() => {
    if (!isPaused && contentWidth > 0) {
      controls.start({
        x: -contentWidth,
        transition: {
          duration: Math.max(contentWidth / 50, 30), // Slower speed: 50px per second, minimum 30s
          ease: 'linear',
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [controls, isPaused, contentWidth]);

  const filteredUpdates = updates.filter(update => update.showInRail);
  const hasUpdates = filteredUpdates.length > 0;

  // Create enough duplicates to fill at least 2 full cycles for seamless looping
  const displayItems = hasUpdates ? filteredUpdates : [{ _id: 'no-updates', title: 'No recent updates. Check later' } as any];
  const duplicatedItems = [...displayItems, ...displayItems, ...displayItems, ...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-amber-100 overflow-hidden shadow-lg border-t border-amber-200">
      <div className="flex items-center h-16">
        {/* FROM MUI Label - Modern Card Style */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-[#D4AF37] px-6 py-4 font-bold text-xs tracking-[0.2em] whitespace-nowrap z-10 relative shadow-md rounded-r-2xl ml-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
            FROM MUI
          </div>
        </div>

        {/* Animated Rail */}
        <div className="flex-1 overflow-hidden relative px-4">
          <motion.div
            ref={containerRef}
            className="flex items-center gap-6 py-4"
            animate={controls}
            style={{ x }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {duplicatedItems.map((item, index) => (
              hasUpdates ? (
                <button
                  key={`${item._id}-${index}`}
                  onClick={() => onUpdateClick(item)}
                  className="flex-shrink-0 px-5 py-2.5 bg-white/60 backdrop-blur-sm hover:bg-white/90 hover:shadow-md transition-all duration-300 rounded-xl cursor-pointer border border-amber-200 hover:border-amber-300 group"
                >
                  <span className="text-[#0a192f] font-semibold text-sm group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </span>
                </button>
              ) : (
                <span
                  key={`no-updates-${index}`}
                  className="flex-shrink-0 px-5 py-2.5 text-[#0a192f]/60 font-medium text-sm italic"
                >
                  {item.title}
                </span>
              )
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
