import Image from "next/image";
import { MediaItem } from "@/components/media/types/media";

interface Props extends MediaItem {}

export function ExternalMediaCard({
  title,
  description,
  campus,
  duration,
  thumbnail,
  platform,
  externalUrl,
  comingSoon,
}: Props) {
  return (
    <a
      href={externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">

        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover transition group-hover:scale-105"
        />

        {comingSoon && (
          <span className="absolute top-3 left-3 text-xs px-2 py-1 bg-black/70 rounded">
            Coming Soon
          </span>
        )}

        <span className="absolute bottom-3 right-3 text-xs px-2 py-1 bg-black/70 rounded">
          {platform}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-medium">{title}</h3>

      <p className="mt-1 text-sm text-white/60">
        {campus}
        {duration && ` • ${duration}`}
      </p>

      <p className="mt-2 text-sm text-white/70 line-clamp-2">
        {description}
      </p>
    </a>
  );
}
