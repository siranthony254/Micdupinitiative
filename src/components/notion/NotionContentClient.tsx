"use client";

import dynamic from "next/dynamic";

const NotionRenderer = dynamic(
  () => import("./NotionRenderer"),
  {
    ssr: false,
    loading: () => (
      <p className="mt-12 text-center text-sm text-white/50">
        Loading content…
      </p>
    ),
  }
);

export default function NotionContentClient(props: any) {
  return <NotionRenderer {...props} />;
}