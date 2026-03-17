"use client";

import { useState, useCallback } from "react";
import { Copy, Expand, FileUp, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EditorPanelProps {
  source: string;
  onSourceChange: (value: string) => void;
  onCopy: () => void;
  onReset: () => void;
  onImport: () => void;
}

function EditorBody({
  source,
  onSourceChange,
  onCopy,
  onReset,
  onImport,
  fullscreen = false
}: EditorPanelProps & { fullscreen?: boolean }) {
  return (
    <div className={cn("space-y-4", fullscreen && "flex h-full min-h-0 flex-col")}>
      <div className="flex flex-col gap-3 rounded-[24px] border border-[color:var(--border)] bg-white/55 p-3 dark:bg-white/4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium">Editor actions</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Import a draft, copy the current source, or reset to the default example.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={onImport}>
            <FileUp className="h-4 w-4" />
            Import
          </Button>
          <Button variant="secondary" size="sm" onClick={onCopy}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-[26px] border border-[color:var(--border)] bg-[#08111f] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
          fullscreen && "flex min-h-0 flex-1 flex-col"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 text-xs uppercase tracking-[0.24em] text-slate-400">
          <span>source.mmd</span>
          <span>Editable</span>
        </div>
        <div className={cn("relative", fullscreen && "flex min-h-0 flex-1")}>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-11 border-r border-white/8 bg-white/[0.03]" />
          <Textarea
            aria-label="Mermaid source editor"
            className={cn(
              "rounded-none border-0 bg-transparent py-5 pl-14 pr-5 text-[13px] leading-7 text-slate-100 shadow-none placeholder:text-slate-500 focus-visible:ring-0",
              fullscreen ? "min-h-0 flex-1 resize-none" : "min-h-[420px]"
            )}
            placeholder="Paste Mermaid flowchart syntax here..."
            spellCheck={false}
            value={source}
            onChange={(event) => onSourceChange(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted-foreground)]">
          Keep the source short and structural. Use styling controls for presentation changes.
        </p>
        <span className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
          Mermaid flowchart
        </span>
      </div>
    </div>
  );
}

export function EditorPanel({
  source,
  onSourceChange,
  onCopy,
  onReset,
  onImport
}: EditorPanelProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const lineCount = source.split("\n").length;

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
      <Card className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0.2))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
        <CardHeader className="gap-4 border-b border-[color:var(--border)] bg-white/35 pb-5 dark:bg-white/3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>Mermaid editor</CardTitle>
                <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)] dark:bg-white/5">
                  autosave
                </span>
              </div>
              <CardDescription className="max-w-md leading-6">
                Write or paste Mermaid flowchart syntax in a cleaner code-focused surface.
              </CardDescription>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setFullscreen(true)}>
              <Expand className="h-4 w-4" />
              Fullscreen
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <span className="rounded-full border border-[color:var(--border)] bg-white/65 px-3 py-1 dark:bg-white/4">
              {lineCount} lines
            </span>
            <span className="rounded-full border border-[color:var(--border)] bg-white/65 px-3 py-1 dark:bg-white/4">
              Mermaid flowchart source
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <EditorBody
            source={source}
            onSourceChange={onSourceChange}
            onCopy={onCopy}
            onReset={onReset}
            onImport={onImport}
          />
        </CardContent>
      </Card>

      {fullscreen && (
        <Dialog open={true} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="flex h-[min(92vh,960px)] w-[min(96vw,1200px)] max-w-none flex-col overflow-hidden p-5 md:p-6">
            <div className="mb-2 flex items-start justify-between gap-4">
              <DialogHeader className="text-left">
                <DialogTitle>Fullscreen editor</DialogTitle>
                <DialogDescription>
                  Edit Mermaid source in a larger workspace without leaving the studio.
                </DialogDescription>
              </DialogHeader>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleCloseFullscreen}
                className="shrink-0 self-start"
                aria-label="Close fullscreen editor"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <EditorBody
                source={source}
                onSourceChange={onSourceChange}
                onCopy={onCopy}
                onReset={onReset}
                onImport={onImport}
                fullscreen
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
