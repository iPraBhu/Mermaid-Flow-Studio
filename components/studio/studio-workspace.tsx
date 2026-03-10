"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import {
  Copy,
  Download,
  Link2,
  Sparkles,
  WandSparkles
} from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_SETTINGS, PRESET_MAP, STUDIO_PRESETS, TEMPLATE_LIBRARY } from "@/lib/constants";
import { renderMermaidDiagram } from "@/lib/mermaid";
import { exportDiagram } from "@/lib/export";
import { parseSharedSettings, buildShareUrl } from "@/lib/share";
import { loadStudioSettings, saveStudioSettings } from "@/lib/storage";
import type { ExportFormat, PreviewState, StudioSettings, TemplateDefinition } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { OfflineIndicator } from "@/components/studio/offline-indicator";
import { ThemeToggle } from "@/components/studio/theme-toggle";
import { EditorPanel } from "@/components/studio/editor-panel";
import { TemplateGallery } from "@/components/studio/template-gallery";
import { PreviewPanel } from "@/components/studio/preview-panel";
import {
  ExportControlPanel,
  StyleControlPanel
} from "@/components/studio/control-panel";
import { ExportDialog } from "@/components/studio/export-dialog";

const initialPreviewState: PreviewState = {
  svg: null,
  error: null,
  isRendering: false,
  width: 0,
  height: 0
};

export function StudioWorkspace() {
  const [settings, setSettings] = useState<StudioSettings>(DEFAULT_SETTINGS);
  const [preview, setPreview] = useState<PreviewState>(initialPreviewState);
  const [hydrated, setHydrated] = useState(false);
  const [mobileTab, setMobileTab] = useState("editor");
  const [desktopTab, setDesktopTab] = useState("style");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const renderRun = useRef(0);

  const updateSetting = <K extends keyof StudioSettings>(
    key: K,
    value: StudioSettings[K]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value
    }));
  };

  const applyPreset = (presetId: StudioSettings["presetId"]) => {
    const preset = PRESET_MAP[presetId];

    startTransition(() => {
      setSettings((current) => ({
        ...current,
        ...preset.settings,
        presetId
      }));
    });
  };

  const applyTemplate = (template: TemplateDefinition) => {
    startTransition(() => {
      setSettings((current) => ({
        ...current,
        source: template.source,
        fileName: template.name.toLowerCase().replaceAll(/\s+/g, "-")
      }));
    });
    toast.success(`${template.name} loaded`);
  };

  const applyResolution = (width: number, height: number) => {
    setSettings((current) => ({
      ...current,
      exportWidth: width,
      exportHeight: height
    }));
  };

  const cycleBeautifyPreset = () => {
    const currentIndex = STUDIO_PRESETS.findIndex((preset) => preset.id === settings.presetId);
    const nextPreset = STUDIO_PRESETS[(currentIndex + 1) % STUDIO_PRESETS.length];
    applyPreset(nextPreset.id);
    toast.success(`${nextPreset.name} preset applied`);
  };

  useEffect(() => {
    const stored = loadStudioSettings();
    const shared = parseSharedSettings();
    const nextSettings = {
      ...DEFAULT_SETTINGS,
      ...stored,
      ...shared
    } as StudioSettings;

    const timeoutId = window.setTimeout(() => {
      setSettings(nextSettings);
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      saveStudioSettings(settings);
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [hydrated, settings]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const currentRun = renderRun.current + 1;
    renderRun.current = currentRun;

    const timeoutId = window.setTimeout(() => {
      setPreview((current) => ({
        ...current,
        isRendering: true,
        error: null
      }));

      renderMermaidDiagram(settings.source, settings)
        .then((result) => {
          if (renderRun.current !== currentRun) {
            return;
          }

          setPreview({
            svg: result.svg,
            error: null,
            isRendering: false,
            width: result.width,
            height: result.height
          });
        })
        .catch((error: unknown) => {
          if (renderRun.current !== currentRun) {
            return;
          }

          setPreview((current) => ({
            ...current,
            error:
              error instanceof Error
                ? error.message
                : "Mermaid could not parse the diagram source.",
            isRendering: false
          }));
        });
    }, 260);

    return () => window.clearTimeout(timeoutId);
  }, [hydrated, settings]);

  const handleCopySource = async () => {
    await navigator.clipboard.writeText(settings.source);
    toast.success("Mermaid source copied");
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    toast.success("Editor reset to the default example");
  };

  const handleShare = async () => {
    const shareUrl = buildShareUrl(settings);
    if (!shareUrl) {
      toast.error("Share link is not available yet");
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied");
  };

  const handleExport = async (format: ExportFormat) => {
    if (!preview.svg) {
      toast.error("Render a valid diagram before exporting");
      return;
    }

    try {
      updateSetting("exportFormat", format);
      await exportDiagram(preview.svg, settings, format);
      toast.success(`${format.toUpperCase()} export downloaded`);
      setExportDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "The export could not be generated."
      );
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    setSettings((current) => ({
      ...current,
      source: text,
      fileName: file.name.replace(/\.[^.]+$/, "") || current.fileName
    }));
    event.target.value = "";
    toast.success(`${file.name} imported`);
  };

  return (
    <section
      id="studio"
      aria-labelledby="studio-heading"
      className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
    >
      <div className="surface-card-strong overflow-hidden p-4 sm:p-6 lg:p-8">
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.mmd,.mermaid,text/plain"
          className="hidden"
          onChange={handleImportFile}
        />
        <div className="flex flex-col gap-5 border-b border-[color:var(--border)] pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <OfflineIndicator />
                <span className="rounded-full border border-[color:var(--border)] bg-white/65 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)] dark:bg-white/5">
                  Browser based workflow
                </span>
              </div>
              <div>
                <h2 id="studio-heading" className="text-3xl font-semibold tracking-tight">
                  Mermaid Flow Studio
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted-foreground)] md:text-lg">
                  Compose flowcharts in Mermaid syntax, refine the visual treatment, and export
                  presentation-ready diagrams without sending source to a server.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              <Button variant="secondary" onClick={cycleBeautifyPreset}>
                <WandSparkles className="h-4 w-4" />
                Beautify
              </Button>
              <Button variant="secondary" onClick={handleShare}>
                <Link2 className="h-4 w-4" />
                Share
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Quick export</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleExport("svg")}>SVG</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("png")}>PNG</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("jpeg")}>JPEG</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>
                    Custom export settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-[26px] border border-[color:var(--border)] bg-white/70 p-4 dark:bg-white/5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Workspace status
                  </p>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {preview.error
                      ? "The current Mermaid source has a syntax issue."
                      : preview.isRendering
                        ? "Preview is updating with the latest source and style settings."
                        : "Preview is synced and ready for export."}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Metric label="Preset" value={PRESET_MAP[settings.presetId].name} />
                <Metric label="Canvas" value={`${settings.exportWidth}x${settings.exportHeight}`} />
                <Metric label="Scale" value={`${settings.exportScale}x`} />
              </div>
            </div>
            {preview.error ? (
              <p className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/8 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                {preview.error}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 lg:hidden">
          <Tabs value={mobileTab} onValueChange={setMobileTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="space-y-6">
              <EditorPanel
                source={settings.source}
                onSourceChange={(value) => updateSetting("source", value)}
                onCopy={handleCopySource}
                onReset={handleReset}
                onImport={handleImportClick}
              />
              <TemplateGallery templates={TEMPLATE_LIBRARY} onSelectTemplate={applyTemplate} />
            </TabsContent>
            <TabsContent value="style">
              <StyleControlPanel
                settings={settings}
                onChange={updateSetting}
                onApplyPreset={applyPreset}
                onBeautify={cycleBeautifyPreset}
              />
            </TabsContent>
            <TabsContent value="preview">
              <PreviewPanel preview={preview} settings={settings} />
            </TabsContent>
            <TabsContent value="export">
              <ExportControlPanel
                settings={settings}
                onChange={updateSetting}
                onApplyResolution={applyResolution}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 hidden gap-6 lg:grid">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
            <EditorPanel
              source={settings.source}
              onSourceChange={(value) => updateSetting("source", value)}
              onCopy={handleCopySource}
              onReset={handleReset}
              onImport={handleImportClick}
            />
            <PreviewPanel preview={preview} settings={settings} />
          </div>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,380px)]">
            <TemplateGallery templates={TEMPLATE_LIBRARY} onSelectTemplate={applyTemplate} />
            <Tabs value={desktopTab} onValueChange={setDesktopTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>
              <TabsContent value="style" className="mt-0">
                <StyleControlPanel
                  settings={settings}
                  onChange={updateSetting}
                  onApplyPreset={applyPreset}
                  onBeautify={cycleBeautifyPreset}
                />
              </TabsContent>
              <TabsContent value="export" className="mt-0">
                <ExportControlPanel
                  settings={settings}
                  onChange={updateSetting}
                  onApplyResolution={applyResolution}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="pointer-events-none sticky bottom-4 mt-6 lg:hidden">
          <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-[24px] border border-[color:var(--border)] bg-[var(--surface-strong)] p-3 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <Button variant="secondary" size="sm" onClick={handleCopySource}>
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShare}>
              <Link2 className="h-4 w-4" />
              Share
            </Button>
            <Button size="sm" onClick={() => setExportDialogOpen(true)}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <ExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          settings={settings}
          onChange={updateSetting}
          onApplyResolution={applyResolution}
          onExport={handleExport}
          disabled={!preview.svg}
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-full border border-[color:var(--border)] bg-[var(--surface-strong)] px-3 py-2 dark:bg-white/5">
      <span className="mr-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
        {label}
      </span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
