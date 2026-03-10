"use client";

import { Download, FileImage, FileType2, FileUp, Image as ImageIcon } from "lucide-react";
import type { ExportFormat, StudioSettings } from "@/lib/types";
import { EXPORT_FORMAT_OPTIONS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExportControlPanel } from "@/components/studio/control-panel";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function ExportDialog({
  open,
  onOpenChange,
  settings,
  onChange,
  onApplyResolution,
  onExport,
  disabled
}: ExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export diagram</DialogTitle>
          <DialogDescription>
            Adjust output defaults and download a polished export in the format you need.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <ExportControlPanel
            settings={settings}
            onChange={onChange}
            onApplyResolution={onApplyResolution}
          />
          <div className="space-y-4">
            <div className="surface-card p-5">
              <p className="text-sm font-semibold">Live export summary</p>
              <div className="mt-4 grid gap-3 text-sm text-[var(--muted-foreground)]">
                <SummaryRow label="Canvas">
                  {settings.exportWidth} x {settings.exportHeight}px
                </SummaryRow>
                <SummaryRow label="Scale">{settings.exportScale}x raster scale</SummaryRow>
                <SummaryRow label="Margin">{settings.exportPadding}px padding</SummaryRow>
                <SummaryRow label="Background">{settings.backgroundMode}</SummaryRow>
                <SummaryRow label="Preset">{settings.presetId}</SummaryRow>
              </div>
            </div>
            <div className="surface-card p-5">
              <p className="text-sm font-semibold">Formats</p>
              <div className="mt-4 grid gap-2">
                {EXPORT_FORMAT_OPTIONS.map((option) => {
                  const Icon = formatIcons[option.value];
                  return (
                    <Button
                      key={option.value}
                      variant={settings.exportFormat === option.value ? "default" : "secondary"}
                      className="justify-start"
                      onClick={() => onChange("exportFormat", option.value)}
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className="surface-card p-5">
              <Badge className="mb-3">Client-side export</Badge>
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                SVG stays vector. PNG and JPG rasterize at the chosen scale. PDF embeds the rendered
                diagram without requiring a backend.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={disabled} onClick={() => onExport(settings.exportFormat)}>
            <Download className="h-4 w-4" />
            Download {settings.exportFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SummaryRow({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--border)] bg-white/65 px-3 py-2 dark:bg-white/5">
      <span>{label}</span>
      <span className="font-medium text-[var(--foreground)]">{children}</span>
    </div>
  );
}
