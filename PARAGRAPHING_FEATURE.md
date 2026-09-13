# Paragraphing Feature for Blog System

## Current State

The blog's Portable Text content supports a set of named paragraph styles,
defined as block styles on `blockContent` (`src/sanity/schemaTypes/blockContentType.ts`)
and rendered by `src/components/blog/PortableTextComponents.tsx`:

- Normal
- Lead
- Large
- Small
- Muted
- Highlight

In Sanity Studio, an editor selects one of these from the block-style dropdown
in the Portable Text editor (the same place you'd pick "H1" or "Quote"). Each
style maps to a distinct Tailwind-styled `<p>` in `PortableTextComponents.tsx`.

Standard Portable Text features are also supported: H1–H4 headings,
blockquotes, bullet/numbered lists, bold/italic marks, and links.

## Not implemented

`src/components/blog/ParagraphBlock.tsx` defines a richer paragraph component
with per-paragraph alignment, background color, text color, margin, and a
drop-cap option. It is not wired into the schema (there's no corresponding
Studio field for any of those options) and is not invoked by
`PortableTextComponents.tsx`, so none of that configurability is available to
editors or visible on the site today. Treat it as a prototype, not a shipped
feature.

## Extending this

To add a new named style (e.g. another accent color):
1. Add it to the `styles` array in `blockContentType.ts`.
2. Add a matching entry under `block` in `PortableTextComponents.tsx`.

To actually ship the `ParagraphBlock` options, they'd need to become real
schema fields (likely a custom object type with `style`, `alignment`,
`backgroundColor`, `textColor`, `marginBottom`, `dropCap`) and
`PortableTextComponents.tsx` would need to render that type via
`ParagraphBlock` instead of its current per-style `<p>` renderers.
