"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/components/media/youtube";

interface VideoPlayerModalProps {
  youtubeId: string;
  title: string;
  description?: string;
  onClose: () => void;
}

export function VideoPlayerModal({ youtubeId, title, description, onClose }: VideoPlayerModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10"
        style={{ backgroundColor: "#0D1F35" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video bg-black">
          <iframe
            src={getYouTubeEmbedUrl(youtubeId, { autoplay: true })}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description && (
            <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-white/70">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
