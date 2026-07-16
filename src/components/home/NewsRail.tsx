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
    <div className="w-full bg-[#D4AF37] overflow-hidden border-t-4 border-emerald-600">
      <div className="flex items-center">
        {/* FROM MUI Label */}
        <div className="bg-emerald-600 text-[#D4AF37] px-6 py-3 font-bold text-sm tracking-wider whitespace-nowrap z-10 relative">
          FROM MUI
        </div>

        {/* Animated Rail */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            ref={containerRef}
            className="flex items-center gap-8 py-3"
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
                  className="flex-shrink-0 px-4 py-2 hover:bg-[#B8962E] transition-colors rounded cursor-pointer"
                >
                  <span className="text-[#0a192f] font-medium text-sm">
                    {item.title}
                  </span>
                </button>
              ) : (
                <span
                  key={`no-updates-${index}`}
                  className="flex-shrink-0 px-4 py-2 text-[#0a192f] font-medium text-sm"
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
