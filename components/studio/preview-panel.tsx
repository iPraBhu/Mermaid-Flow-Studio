"use client";

import { useEffect, useEffectEvent, useRef, useState, useCallback } from "react";
import {
  Expand,
  LoaderCircle,
  Minus,
  Move,
  Plus,
  RefreshCcw,
  ScanSearch,
  X
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
  const framePadding = fullscreen ? 56 : 40;
  const contentWidth = preview.width ? preview.width + framePadding : 0;
  const contentHeight = preview.height ? preview.height + framePadding : 0;
  const scaledWidth = contentWidth ? contentWidth * zoom : 0;
  const scaledHeight = contentHeight ? contentHeight * zoom : 0;

  const fitViewport = (behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current;
    if (!viewport || !contentWidth || !contentHeight) {
      return;
    }

    const horizontalInset = fullscreen ? 56 : 44;
    const verticalInset = fullscreen ? 56 : 44;
    const availableWidth = Math.max(viewport.clientWidth - horizontalInset, 160);
    const availableHeight = Math.max(viewport.clientHeight - verticalInset, 160);
    const nextZoom = clamp(
      Math.min(availableWidth / contentWidth, availableHeight / contentHeight),
      0.2,
      2
    );

    setZoom(nextZoom);
    viewport.scrollTo({
      left: Math.max((contentWidth * nextZoom - viewport.clientWidth) / 2, 0),
      top: Math.max((contentHeight * nextZoom - viewport.clientHeight) / 2, 0),
      behavior
    });
  };

  const fitToViewportOnRender = useEffectEvent(() => {
    fitViewport("auto");
  });

  useEffect(() => {
    if (!preview.svg) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      fitToViewportOnRender();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [preview.svg, preview.width, preview.height, fullscreen]);

  const adjustZoom = (direction: 1 | -1) => {
    setZoom((current) => clamp(Number((current + direction * 0.1).toFixed(2)), 0.2, 3));
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
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-white/65 px-3 py-2 dark:bg-white/5">
            <Move className="h-3.5 w-3.5" />
            Drag to pan
          </span>
          {preview.svg ? (
            <span className="rounded-full border border-[color:var(--border)] bg-white/65 px-3 py-2 dark:bg-white/5">
              {preview.width} x {preview.height}
            </span>
          ) : null}
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
          <Button variant="secondary" size="sm" onClick={() => fitViewport()}>
            <ScanSearch className="h-4 w-4" />
            Fit view
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
          "hide-scrollbar relative overflow-auto rounded-[30px] border border-[color:var(--border)] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.32),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.08))] p-5 dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]",
          fullscreen ? "min-h-0 flex-1" : "min-h-[460px]",
          settings.showGrid && "surface-grid"
        )}
        onPointerDown={handlePointerDown}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-b from-white/18 to-transparent dark:from-white/[0.03]" />
        <div
          className={cn(
            "relative flex items-center justify-center",
            fullscreen ? "min-h-full min-w-0" : "min-h-[400px] min-w-max"
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
                className="mermaid absolute left-0 top-0 overflow-hidden rounded-[28px] border border-black/5 p-5 shadow-[0_24px_70px_-34px_rgba(15,23,42,0.4)] transition-transform duration-200 dark:border-white/8"
                style={{
                  width: `${contentWidth}px`,
                  height: `${contentHeight}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  background:
                    background === "transparent"
                      ? "rgba(255,255,255,0.92)"
                      : background
                }}
                dangerouslySetInnerHTML={{ __html: preview.svg }}
              />
            </div>
          ) : (
            <div className="flex min-h-[300px] w-full max-w-2xl flex-col items-center justify-center rounded-[28px] border border-dashed border-[color:var(--border)] bg-white/55 p-10 text-center dark:bg-white/4">
              <p className="text-lg font-semibold tracking-tight">Preview will appear here</p>
              <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted-foreground)]">
                Paste Mermaid flowchart text or load a template to render the diagram.
              </p>
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
          Large diagrams now auto-fit the viewport first, then you can zoom and pan from there.
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

  const handleCloseFullscreen = useCallback(() => {
    setFullscreen(false);
    // Force a delay to ensure state update
    setTimeout(() => setFullscreen(false), 0);
  }, []);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) {
      // Force close
      setFullscreen(false);
    } else {
      setFullscreen(open);
    }
  }, []);

  return (
    <>
      <Card className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,255,255,0.22))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
        <CardHeader className="gap-4 border-b border-[color:var(--border)] bg-white/35 pb-5 dark:bg-white/3">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>Live preview</CardTitle>
                <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)] dark:bg-white/5">
                  fit first
                </span>
              </div>
              <CardDescription className="max-w-md leading-6">
                Inspect the final composition in a cleaner viewport that handles large diagrams
                better by default.
              </CardDescription>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setFullscreen(true)}>
              <Expand className="h-4 w-4" />
              Fullscreen
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <DiagramSurface key={previewKey} preview={preview} settings={settings} />
        </CardContent>
      </Card>

      {fullscreen && (
        <Dialog open={true} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="flex h-[min(92vh,960px)] w-[min(96vw,1280px)] max-w-none flex-col overflow-hidden p-5 md:p-6">
            <div className="mb-2 flex items-start justify-between gap-4">
              <DialogHeader className="text-left">
                <DialogTitle>Fullscreen preview</DialogTitle>
                <DialogDescription>
                  Fit the whole diagram first, then zoom and pan for inspection.
                </DialogDescription>
              </DialogHeader>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleCloseFullscreen}
                className="shrink-0 self-start"
                aria-label="Close fullscreen preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <DiagramSurface
                key={`${previewKey}-fullscreen`}
                preview={preview}
                settings={settings}
                fullscreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
