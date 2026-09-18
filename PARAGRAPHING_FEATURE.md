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

A richer per-paragraph editor (alignment, background color, text color,
margin, drop-cap) was prototyped once as `ParagraphBlock.tsx`, but it was
never wired into the schema and never invoked by `PortableTextComponents.tsx`
— it was removed during cleanup since it wasn't reachable from anywhere. If
that configurability is wanted later, it needs to be built as real schema
fields (a custom object type with `style`, `alignment`, `backgroundColor`,
`textColor`, `marginBottom`, `dropCap`) with a matching renderer registered
in `PortableTextComponents.tsx` — not resurrected from history as-is, since
it predates the current schema.

## Extending this

To add a new named style (e.g. another accent color):
1. Add it to the `styles` array in `blockContentType.ts`.
2. Add a matching entry under `block` in `PortableTextComponents.tsx`.
