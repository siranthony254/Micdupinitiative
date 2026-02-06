"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Youtube,
  Music2,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { MediaItem } from "./types/media";

interface ExternalMediaCardProps extends Partial<MediaItem> {}

export function ExternalMediaCard({
  title,
  description,
  duration,
  thumbnail,
  comingSoon,
  externalUrl,
  youtubeId,
  social,
}: ExternalMediaCardProps) {
  const isYouTube = !!youtubeId;
  const primaryHref =
    externalUrl ??
    (isYouTube ? `https://www.youtube.com/watch?v=${youtubeId}` : undefined);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-black border border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* ======================
          MEDIA PREVIEW
      ====================== */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail || "/images/placeholder.png"}
          alt={title || "media thumbnail"}
          fill
          className="object-cover transition-opacity duration-300 ease-out group-hover:opacity-0"
        />

        {isYouTube && youtubeId && (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}`}
            title={title || "YouTube video"}
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
            allow="autoplay; encrypted-media"
          />
        )}

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100 group-hover:opacity-70 transition-opacity duration-300" />

        {/* Play button */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-md transition-transform duration-300 group-hover:scale-95">
            <Play className="h-5 w-5 ml-0.5" />
          </div>
        </div>

        {/* Duration */}
        {duration && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-[11px] font-medium text-white">
            {duration}
          </span>
        )}
      </div>

      {/* ======================
          CONTENT
      ====================== */}
      <div className="p-4">
        {title && (
          <h3 className="text-sm font-semibold leading-snug text-white">
            {title}
          </h3>
        )}

        {description && (
          <p className="mt-1 text-xs leading-relaxed text-white/60 line-clamp-2">
            {description}
          </p>
        )}

        {/* PLATFORM ICON BAR */}
        {social && (
          <div className="mt-3 flex items-center gap-3">
            {social.youtube && <IconLink href={social.youtube} icon={<Youtube />} />}
            {social.spotify && <IconLink href={social.spotify} icon={<Music2 />} />}
            {social.instagram && <IconLink href={social.instagram} icon={<Instagram />} />}
            {social.x && <IconLink href={social.x} icon={<Twitter />} />}
            {social.linkedin && <IconLink href={social.linkedin} icon={<Linkedin />} />}
          </div>
        )}
      </div>

      {/* ======================
          COMING SOON
      ====================== */}
      {comingSoon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 text-sm font-medium text-white">
          Coming soon
        </div>
      )}

      {/* ======================
          PRIMARY CLICK LAYER
      ====================== */}
      {!comingSoon && primaryHref && (
        <Link
          href={primaryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
        />
      )}
    </div>
  );
}

function IconLink({
  href,
  icon,
}: {
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white/50 hover:text-white transition-colors duration-200"
    >
      <span className="flex h-4 w-4 items-center justify-center">
        {icon}
      </span>
    </Link>
  );
}
