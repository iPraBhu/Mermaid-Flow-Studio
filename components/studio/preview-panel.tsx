"use client";

import { useRef, useState } from "react";
import {
  Expand,
  LoaderCircle,
  Minus,
  Move,
  Plus,
  RefreshCcw,
  ScanSearch
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PreviewState, StudioSettings } from "@/lib/types";
import { clamp, cn } from "@/lib/utils";

interface PreviewPanelProps {
  preview: PreviewState;
  settings: StudioSettings;
}

function DiagramSurface({
  preview,
  settings,
  fullscreen = false
}: PreviewPanelProps & { fullscreen?: boolean }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const framePadding = 48;
  const contentWidth = preview.width ? preview.width + framePadding : 0;
  const contentHeight = preview.height ? preview.height + framePadding : 0;
  const scaledWidth = contentWidth ? contentWidth * zoom : 0;
  const scaledHeight = contentHeight ? contentHeight * zoom : 0;

  const applyFit = () => {
    const viewport = viewportRef.current;
    if (!viewport || !contentWidth || !contentHeight) {
      return;
    }

    const availableWidth = viewport.clientWidth - 48;
    const availableHeight = viewport.clientHeight - 48;
    const nextZoom = clamp(
      Math.min(availableWidth / contentWidth, availableHeight / contentHeight),
      0.35,
      2.2
    );

    setZoom(nextZoom);
    viewport.scrollTo({
      left: Math.max((contentWidth * nextZoom - viewport.clientWidth) / 2, 0),
      top: Math.max((contentHeight * nextZoom - viewport.clientHeight) / 2, 0),
      behavior: "smooth"
    });
  };

  const adjustZoom = (direction: 1 | -1) => {
    setZoom((current) => clamp(Number((current + direction * 0.1).toFixed(2)), 0.35, 3));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const startX = event.clientX;
    const startY = event.clientY;
    const initialLeft = viewport.scrollLeft;
    const initialTop = viewport.scrollTop;
    viewport.setPointerCapture(event.pointerId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      viewport.scrollLeft = initialLeft - (moveEvent.clientX - startX);
      viewport.scrollTop = initialTop - (moveEvent.clientY - startY);
    };

    const onPointerUp = () => {
      viewport.releasePointerCapture(event.pointerId);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
    };

    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
  };

  const background = (() => {
    switch (settings.backgroundMode) {
      case "white":
        return "#ffffff";
      case "dark":
        return "#050816";
      case "custom":
        return settings.backgroundColor;
      case "transparent":
      default:
        return "transparent";
    }
  })();

  return (
    <div className={cn("space-y-4", fullscreen && "flex h-full min-h-0 flex-col")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white/65 px-3 py-2 text-xs text-[var(--muted-foreground)] dark:bg-white/5">
          <Move className="h-3.5 w-3.5" />
          Drag to pan
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="icon" onClick={() => adjustZoom(-1)}>
            <Minus className="h-4 w-4" />
            <span className="sr-only">Zoom out</span>
          </Button>
          <Button variant="secondary" size="icon" onClick={() => adjustZoom(1)}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Zoom in</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={applyFit}>
            <ScanSearch className="h-4 w-4" />
            Fit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setZoom(1)}>
            <RefreshCcw className="h-4 w-4" />
            {Math.round(zoom * 100)}%
          </Button>
        </div>
      </div>
      <div
        ref={viewportRef}
        className={cn(
          "hide-scrollbar relative overflow-auto rounded-[28px] border border-[color:var(--border)] bg-white/45 p-6 dark:bg-white/3",
          fullscreen ? "min-h-0 flex-1" : "min-h-[360px]",
          settings.showGrid && "surface-grid"
        )}
        onPointerDown={handlePointerDown}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/25 to-transparent dark:from-white/3" />
        <div
          className={cn(
            "relative flex items-center justify-center",
            fullscreen ? "min-h-full min-w-0" : "min-h-[300px] min-w-max"
          )}
        >
          {preview.svg ? (
            <div
              className="relative shrink-0 transition-[width,height] duration-200"
              style={{
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`
              }}
            >
              <div
                className="surface-card-strong mermaid absolute left-0 top-0 overflow-hidden rounded-[28px] p-6 transition-transform duration-200"
                style={{
                  width: `${contentWidth}px`,
                  height: `${contentHeight}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  background:
                    background === "transparent"
                      ? "rgba(255,255,255,0.84)"
                      : background
                }}
                dangerouslySetInnerHTML={{ __html: preview.svg }}
              />
            </div>
          ) : (
            <div className="surface-card-strong flex min-h-[260px] w-full max-w-2xl items-center justify-center p-10 text-center text-[var(--muted-foreground)]">
              Paste Mermaid flowchart text to render a diagram preview.
            </div>
          )}
          {preview.isRendering ? (
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-medium text-sky-700 dark:text-sky-200">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Updating preview
            </div>
          ) : null}
        </div>
      </div>
      {preview.error ? (
        <div className="rounded-[22px] border border-rose-500/20 bg-rose-500/8 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {preview.error}
        </div>
      ) : null}
      {fullscreen ? null : (
        <p className="text-sm text-[var(--muted-foreground)]">
          Preview rendering happens entirely in your browser, so nothing leaves the device.
        </p>
      )}
    </div>
  );
}

export function PreviewPanel({ preview, settings }: PreviewPanelProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const previewKey = preview.svg
    ? `${preview.width}-${preview.height}-${preview.svg.length}`
    : "empty";

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle>Live preview</CardTitle>
            <CardDescription>
              Inspect the final composition, zoom in, and pan across large diagrams before export.
            </CardDescription>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setFullscreen(true)}>
            <Expand className="h-4 w-4" />
            Fullscreen
          </Button>
        </CardHeader>
        <CardContent>
          <DiagramSurface key={previewKey} preview={preview} settings={settings} />
        </CardContent>
      </Card>
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="flex h-[min(92vh,960px)] w-[min(96vw,1200px)] max-w-none flex-col overflow-hidden p-5 md:p-6">
          <DialogHeader className="mb-2">
            <DialogTitle>Fullscreen preview</DialogTitle>
            <DialogDescription>
              Use fit and zoom controls to inspect export composition in detail.
            </DialogDescription>
          </DialogHeader>
          <DiagramSurface
            key={`${previewKey}-fullscreen`}
            preview={preview}
            settings={settings}
            fullscreen
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
