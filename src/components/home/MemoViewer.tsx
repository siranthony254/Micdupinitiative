'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import type { SanityUpdate } from '@/types/update';

interface MemoViewerProps {
  update: SanityUpdate | null;
  onClose: () => void;
}

export function MemoViewer({ update, onClose }: MemoViewerProps) {
  if (!update) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white max-w-2xl w-full max-h-[90vh] overflow-auto rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Memo Header */}
          <div className="bg-[#0a192f] text-white p-6 border-b-4 border-[#D4AF37]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[#D4AF37] text-sm font-semibold mb-1">
                  {update.memoReference || 'MUI MEMORANDUM'}
                </div>
                <h2 className="text-xl font-bold">{update.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/70">
              {update.memoSender && (
                <div>
                  <span className="text-[#D4AF37]">From:</span> {update.memoSender}
                </div>
              )}
              {update.publishedAt && (
                <div>
                  <span className="text-[#D4AF37]">Date:</span>{' '}
                  {new Date(update.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Memo Content */}
          <div className="p-8 bg-[#f5f5f5]">
            {update.memoContent ? (
              <div className="prose prose-lg max-w-none">
                <PortableText value={update.memoContent} />
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                <PortableText value={update.content} />
              </div>
            )}
          </div>

          {/* Memo Footer */}
          <div className="bg-[#0a192f] text-white p-4 text-center text-sm">
            <div className="text-[#D4AF37] font-semibold mb-1">MIC'D UP INITIATIVE</div>
            <div className="text-white/60">Official Memorandum</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
