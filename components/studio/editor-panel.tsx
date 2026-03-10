"use client";

import { Copy, FileUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface EditorPanelProps {
  source: string;
  onSourceChange: (value: string) => void;
  onCopy: () => void;
  onReset: () => void;
  onImport: () => void;
}

export function EditorPanel({
  source,
  onSourceChange,
  onCopy,
  onReset,
  onImport
}: EditorPanelProps) {
  const lineCount = source.split("\n").length;

  return (
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

      <CardContent className="space-y-4 p-4 sm:p-5">
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

        <div className="overflow-hidden rounded-[26px] border border-[color:var(--border)] bg-[#08111f] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 text-xs uppercase tracking-[0.24em] text-slate-400">
            <span>source.mmd</span>
            <span>Editable</span>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-11 border-r border-white/8 bg-white/[0.03]" />
            <Textarea
              aria-label="Mermaid source editor"
              className="min-h-[420px] rounded-none border-0 bg-transparent py-5 pl-14 pr-5 text-[13px] leading-7 text-slate-100 shadow-none placeholder:text-slate-500 focus-visible:ring-0"
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
      </CardContent>
    </Card>
  );
}
