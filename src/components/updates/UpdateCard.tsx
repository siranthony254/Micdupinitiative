import Image from "next/image";
import Link from "next/link";
import { Mic, FileText, Calendar, MapPin, Info, Megaphone, Handshake, Users } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { getOptimizedImageProps } from "@/lib/performance";
import { FadeInSection } from "@/components/FadeInSection";
import type { SanityUpdate } from "@/types/update";

interface UpdateCardProps {
  update: SanityUpdate;
  index?: number;
}

export function UpdateCard({ update, index = 0 }: UpdateCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'podcast':
        return Mic;
      case 'blog':
        return FileText;
      case 'event':
        return Calendar;
      case 'tour':
        return MapPin;
      case 'general':
        return Info;
      case 'announcement':
        return Megaphone;
      case 'partnership':
        return Handshake;
      case 'mentorship':
        return Users;
      default:
        return Megaphone;
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
    <FadeInSection delay={index * 100} className="group transition-transform duration-300 hover:-translate-y-2">
      {update.link ? (
        <Link href={update.link} className="block h-full">
          <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
            {/* Type Badge */}
            <div className="mb-4 flex items-center justify-between">
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getTypeColor(update.type)}`}>
                {(() => { const TypeIcon = getTypeIcon(update.type); return <TypeIcon className="h-3.5 w-3.5" strokeWidth={2} />; })()}
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
              {(() => { const TypeIcon = getTypeIcon(update.type); return <TypeIcon className="h-3.5 w-3.5" strokeWidth={2} />; })()}
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
    </FadeInSection>
  );
}
