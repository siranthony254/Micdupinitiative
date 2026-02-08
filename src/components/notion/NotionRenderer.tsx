// src/components/notion/NotionRenderer.tsx
"use client";

import { NotionRenderer } from "react-notion-x";
import "react-notion-x/src/styles.css";

export default function NotionContent({ recordMap }: { recordMap: any }) {
  if (!recordMap || Object.keys(recordMap).length === 0) {
    return (
      <p className="text-center mt-8 text-gray-400">
        No content available for this post.
      </p>
    );
  }

  return <NotionRenderer recordMap={recordMap} fullPage={false} />;
}
