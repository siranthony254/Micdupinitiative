import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { getOptimizedImageProps } from "@/lib/performance";
import type { SanityUpdate } from "@/types/update";

const bounce = {
  hidden: { opacity: 0, y: 28 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20
    }
  },
  hover: {
    y: -8,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 10
    }
  }
};

interface UpdateCardProps {
  update: SanityUpdate;
  index?: number;
}

export function UpdateCard({ update, index = 0 }: UpdateCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'podcast':
        return '🎙️';
      case 'blog':
        return '📝';
      case 'event':
        return '📅';
      case 'tour':
        return '🎓';
      case 'general':
        return '📢';
      case 'announcement':
        return '📣';
      case 'partnership':
        return '🤝';
      case 'mentorship':
        return '👥';
      default:
        return '📢';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'podcast':
        return 'text-purple-400 border-purple-400/20 bg-purple-400/5';
      case 'blog':
        return 'text-blue-400 border-blue-400/20 bg-blue-400/5';
      case 'event':
        return 'text-green-400 border-green-400/20 bg-green-400/5';
      case 'tour':
        return 'text-orange-400 border-orange-400/20 bg-orange-400/5';
      case 'general':
        return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
      case 'announcement':
        return 'text-red-400 border-red-400/20 bg-red-400/5';
      case 'partnership':
        return 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5';
      case 'mentorship':
        return 'text-pink-400 border-pink-400/20 bg-pink-400/5';
      default:
        return 'text-amber-400 border-amber-400/20 bg-amber-400/5';
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'podcast':
        return 'Podcast Episode';
      case 'blog':
        return 'Blog Post';
      case 'event':
        return 'Event';
      case 'tour':
        return 'Campus Tour';
      case 'general':
        return 'General Update';
      case 'announcement':
        return 'Announcement';
      case 'partnership':
        return 'Partnership';
      case 'mentorship':
        return 'Mentorship';
      default:
        return 'Update';
    }
  };

  return (
    <motion.div
      variants={bounce}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover="hover"
      className="group"
    >
      {update.link ? (
        <Link href={update.link} className="block h-full">
          <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
            {/* Type Badge */}
            <div className="mb-4 flex items-center justify-between">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getTypeColor(update.type)}`}>
                <span className="text-base">{getTypeIcon(update.type)}</span>
                <span>{getTypeDisplayName(update.type)}</span>
              </div>
              {update.featured && (
                <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-300">
                  Featured
                </span>
              )}
            </div>

            {/* Image */}
            {update.image && (
              <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-white/5">
                <Image
                  {...getOptimizedImageProps(
                    urlFor(update.image).width(400).height(225).url(),
                    400,
                    225
                  )}
                  alt={update.image.alt || update.title}
                  fill
                />
              </div>
            )}

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
                {update.title}
              </h3>
              
              <p className="text-white/70 line-clamp-2 leading-relaxed">
                {update.description}
              </p>

              {/* Date */}
              <div className="flex items-center justify-between text-sm text-white/50">
                <span>
                  {new Date(update.publishedAt || new Date()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className="text-amber-400 group-hover:text-amber-300 transition-colors">
                  →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
          {/* Type Badge */}
          <div className="mb-4 flex items-center justify-between">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getTypeColor(update.type)}`}>
              <span className="text-base">{getTypeIcon(update.type)}</span>
              <span>{getTypeDisplayName(update.type)}</span>
            </div>
            {update.featured && (
              <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-xs font-medium text-amber-300">
                Featured
              </span>
            )}
          </div>

          {/* Image */}
          {update.image && (
            <div className="mb-4 aspect-video rounded-lg overflow-hidden bg-white/5">
              <Image
                src={urlFor(update.image).width(400).height(225).url()}
                alt={update.image.alt || update.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">
              {update.title}
            </h3>
            
            <p className="text-white/70 line-clamp-2 leading-relaxed">
              {update.description}
            </p>

            {/* Date */}
            <div className="flex items-center justify-between text-sm text-white/50">
              <span>
                {new Date(update.publishedAt || new Date()).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
