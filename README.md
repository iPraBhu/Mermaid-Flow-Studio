# Mermaid Flow Studio

Mermaid Flow Studio is an offline-first Mermaid flowchart editor built with Next.js, TypeScript, Tailwind CSS, and Mermaid.js. It renders diagrams client-side, persists local drafts, supports starter templates and visual presets, and exports SVG, PNG, JPEG, and PDF directly in the browser.

## Features

- Live Mermaid flowchart editing with local autosave
- Starter templates for process, decision, journey, and API lifecycle flows
- Presets for Minimal, Modern, Glass, Dark Pro, Presentation, and Print Friendly styles
- Zoomable preview with fullscreen mode
- Client-side exports for SVG, PNG, JPEG, and PDF
- Shareable local state via encoded query params
- PWA-style offline support with a service worker and manifest
- Responsive landing page and studio workspace for desktop and mobile

## Tech stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Radix UI primitives with shadcn-style wrappers
- Mermaid.js for rendering
- jsPDF for PDF export
- Sonner for toast notifications

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

## Offline support

- `public/sw.js` caches the app shell and same-origin runtime assets.
- After the first successful load, the editor, preview, and export workflow remain usable offline.
- `public/offline.html` provides a fallback screen if navigation fails before the app is cached.

## Export details

- SVG export wraps the rendered Mermaid output in an export frame for padding, background, and optional card shadow treatment.
- PNG and JPEG exports rasterize the framed SVG at the chosen scale multiplier.
- PDF export embeds the rendered diagram onto a page sized to the configured export width and height.

## Project structure

```text
app/
components/
  providers/
  studio/
  ui/
lib/
public/
```

## Notes

- Mermaid rendering happens only in client components.
- Core functionality does not require a backend.
- Local drafts and settings are stored in `localStorage`.
