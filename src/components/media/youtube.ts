interface YouTubeEmbedOptions {
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  mute?: boolean;
}

export function getYouTubeEmbedUrl(
  videoId: string,
  options: YouTubeEmbedOptions = {}
) {
  const { autoplay = false, controls = true, loop = false, mute = false } = options;
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    controls: controls ? "1" : "0",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    iv_load_policy: "3",
  });

  if (mute) {
    params.set("mute", "1");
  }

  if (loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
