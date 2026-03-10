"use client";

import { Download, FileImage, FileType2, FileUp, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EXPORT_FORMAT_OPTIONS } from "@/lib/constants";
import type { ExportFormat, StudioSettings } from "@/lib/types";
import { ExportControlPanel } from "@/components/studio/control-panel";
import { cn } from "@/lib/utils";

interface ExportCenterProps {
  settings: StudioSettings;
  onChange: <K extends keyof StudioSettings>(key: K, value: StudioSettings[K]) => void;
  onApplyResolution: (width: number, height: number) => void;
  onExport: (format: ExportFormat) => Promise<void> | void;
  disabled?: boolean;
}

const formatIcons = {
  svg: FileType2,
  png: ImageIcon,
  jpeg: FileImage,
  pdf: FileUp
};

const formatHelp: Record<ExportFormat, string> = {
  svg: "Editable vector output.",
  png: "Best for slides and docs.",
  jpeg: "Smaller raster file.",
  pdf: "Document-style delivery."
};

export function ExportCenter({
  settings,
  onChange,
  onApplyResolution,
  onExport,
  disabled
}: ExportCenterProps) {
  return (
    <section id="output-center" aria-labelledby="output-heading" className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.78fr)]">
      <Card className="overflow-hidden">
        <CardHeader className="gap-3 border-b border-[color:var(--border)] bg-white/35 pb-5 dark:bg-white/3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle id="output-heading">Output center</CardTitle>
              <CardDescription className="mt-2 max-w-xl leading-6">
                One place to choose format, review export settings, and download the final file.
              </CardDescription>
            </div>
            <span className="rounded-full border border-[color:var(--border)] bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--muted-foreground)] dark:bg-white/5">
              centralized
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-4 sm:p-5">
          <section className="space-y-3">
            <p className="text-sm font-semibold">Choose file type</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {EXPORT_FORMAT_OPTIONS.map((option) => {
                const Icon = formatIcons[option.value];
                const isActive = settings.exportFormat === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange("exportFormat", option.value)}
                    className={cn(
                      "rounded-[24px] border p-4 text-left transition",
                      isActive
                        ? "border-sky-500/40 bg-sky-500/10"
                        : "border-[color:var(--border)] bg-white/65 hover:bg-white dark:bg-white/4 dark:hover:bg-white/6"
                    )}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-white/70 dark:bg-white/5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="mt-4 text-base font-semibold">{option.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                      {formatHelp[option.value]}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="rounded-[24px] border border-[color:var(--border)] bg-white/60 p-4 dark:bg-white/4">
            <p className="text-sm font-semibold">Current output</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-[var(--muted-foreground)]">
              <SummaryPill>{settings.exportFormat.toUpperCase()}</SummaryPill>
              <SummaryPill>
                {settings.exportWidth} x {settings.exportHeight}
              </SummaryPill>
              <SummaryPill>{settings.exportScale}x scale</SummaryPill>
              <SummaryPill>{settings.exportPadding}px padding</SummaryPill>
              <SummaryPill>{settings.fileName}</SummaryPill>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-[color:var(--border)] bg-white/60 p-4 dark:bg-white/4">
            <div>
              <p className="text-sm font-semibold">Download ready</p>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                Use the selected format and current output settings.
              </p>
            </div>
            <Button disabled={disabled} onClick={() => onExport(settings.exportFormat)}>
              <Download className="h-4 w-4" />
              Download {settings.exportFormat.toUpperCase()}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ExportControlPanel
        settings={settings}
        onChange={onChange}
        onApplyResolution={onApplyResolution}
      />
    </section>
  );
}

function SummaryPill({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-[color:var(--border)] bg-white/72 px-3 py-1.5 dark:bg-white/5">
      {children}
    </span>
  );
}
