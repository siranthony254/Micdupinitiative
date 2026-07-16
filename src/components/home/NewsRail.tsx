'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!isPaused) {
      controls.start({
        x: -10000,
        transition: {
          duration: 120,
          ease: 'linear',
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [controls, isPaused]);

  const filteredUpdates = updates.filter(update => update.showInRail);
  const hasUpdates = filteredUpdates.length > 0;

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
            className="flex items-center gap-8 py-3"
            animate={controls}
            style={{ x }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {hasUpdates ? (
              /* Duplicate updates multiple times for seamless looping */
              [...filteredUpdates, ...filteredUpdates, ...filteredUpdates, ...filteredUpdates].map((update, index) => (
                <button
                  key={`${update._id}-${index}`}
                  onClick={() => onUpdateClick(update)}
                  className="flex-shrink-0 px-4 py-2 hover:bg-[#B8962E] transition-colors rounded cursor-pointer"
                >
                  <span className="text-[#0a192f] font-medium text-sm">
                    {update.title}
                  </span>
                </button>
              ))
            ) : (
              /* Show default message when no updates */
              <>
                <span className="flex-shrink-0 px-4 py-2 text-[#0a192f] font-medium text-sm">
                  No recent updates. Check later
                </span>
                <span className="flex-shrink-0 px-4 py-2 text-[#0a192f] font-medium text-sm">
                  No recent updates. Check later
                </span>
                <span className="flex-shrink-0 px-4 py-2 text-[#0a192f] font-medium text-sm">
                  No recent updates. Check later
                </span>
                <span className="flex-shrink-0 px-4 py-2 text-[#0a192f] font-medium text-sm">
                  No recent updates. Check later
                </span>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
