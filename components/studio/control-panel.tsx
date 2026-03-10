"use client";

import { Palette, Sparkles } from "lucide-react";
import {
  ACCENT_PRESETS,
  BACKGROUND_MODE_OPTIONS,
  FONT_FAMILY_OPTIONS,
  MERMAID_THEME_OPTIONS,
  PRESET_MAP,
  RESOLUTION_PRESETS,
  STUDIO_PRESETS
} from "@/lib/constants";
import type { BackgroundMode, StudioPresetId, StudioSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface StyleControlPanelProps {
  settings: StudioSettings;
  onChange: <K extends keyof StudioSettings>(key: K, value: StudioSettings[K]) => void;
  onApplyPreset: (presetId: StudioPresetId) => void;
  onBeautify: () => void;
}

export function StyleControlPanel({
  settings,
  onChange,
  onApplyPreset,
  onBeautify
}: StyleControlPanelProps) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Beautify controls</CardTitle>
            <CardDescription>
              Tune Mermaid styling and export framing without touching syntax.
            </CardDescription>
          </div>
          <Button variant="secondary" size="sm" onClick={onBeautify}>
            <Sparkles className="h-4 w-4" />
            Beautify
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Palette className="h-4 w-4" />
            Presets
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {STUDIO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset.id)}
                className={cn(
                  "rounded-[22px] border p-3 text-left transition",
                  settings.presetId === preset.id
                    ? "border-sky-500/45 bg-sky-500/10"
                    : "border-[color:var(--border)] bg-white/70 hover:bg-white dark:bg-white/5 dark:hover:bg-white/8"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{preset.name}</span>
                  {settings.presetId === preset.id ? (
                    <span className="rounded-full bg-sky-500/15 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-sky-700 dark:text-sky-200">
                      Active
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mermaid-theme">Mermaid theme</Label>
            <Select
              value={settings.mermaidTheme}
              onValueChange={(value) =>
                onChange("mermaidTheme", value as StudioSettings["mermaidTheme"])
              }
            >
              <SelectTrigger id="mermaid-theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MERMAID_THEME_OPTIONS.map((theme) => (
                  <SelectItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="font-family">Font family</Label>
            <Select
              value={settings.fontFamily}
              onValueChange={(value) =>
                onChange("fontFamily", value as StudioSettings["fontFamily"])
              }
            >
              <SelectTrigger id="font-family">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONT_FAMILY_OPTIONS.map((fontFamily) => (
                  <SelectItem key={fontFamily} value={fontFamily}>
                    {fontFamily}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="background-mode">Background</Label>
            <Select
              value={settings.backgroundMode}
              onValueChange={(value) =>
                onChange("backgroundMode", value as BackgroundMode)
              }
            >
              <SelectTrigger id="background-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BACKGROUND_MODE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shadow-style">Export presentation</Label>
            <Select
              value={settings.shadowStyle}
              onValueChange={(value) =>
                onChange("shadowStyle", value as StudioSettings["shadowStyle"])
              }
            >
              <SelectTrigger id="shadow-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Flat</SelectItem>
                <SelectItem value="soft">Soft card</SelectItem>
                <SelectItem value="glass">Glass card</SelectItem>
                <SelectItem value="depth">Depth shadow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="accent-color">Accent color</Label>
            <Input
              id="accent-color"
              type="color"
              className="h-11 w-24 rounded-2xl p-2"
              value={settings.accentColor}
              onChange={(event) => onChange("accentColor", event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {ACCENT_PRESETS.map((accent) => (
              <button
                key={accent}
                type="button"
                className={cn(
                  "h-10 w-10 rounded-2xl border transition hover:scale-105",
                  settings.accentColor === accent
                    ? "border-sky-500 ring-2 ring-sky-500/30"
                    : "border-white/50 dark:border-white/10"
                )}
                style={{ backgroundColor: accent }}
                onClick={() => onChange("accentColor", accent)}
              >
                <span className="sr-only">{accent}</span>
              </button>
            ))}
          </div>
          {settings.backgroundMode === "custom" ? (
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="background-color">Canvas color</Label>
              <Input
                id="background-color"
                type="color"
                className="h-11 w-24 rounded-2xl p-2"
                value={settings.backgroundColor}
                onChange={(event) => onChange("backgroundColor", event.target.value)}
              />
            </div>
          ) : null}
        </section>

        <section className="space-y-5">
          <SliderRow
            label="Font size"
            value={settings.fontSize}
            min={12}
            max={24}
            step={1}
            suffix="px"
            onChange={(value) => onChange("fontSize", value)}
          />
          <SliderRow
            label="Diagram padding"
            value={settings.padding}
            min={16}
            max={88}
            step={2}
            suffix="px"
            onChange={(value) => onChange("padding", value)}
          />
          <SliderRow
            label="Node spacing"
            value={settings.nodeSpacing}
            min={24}
            max={84}
            step={2}
            suffix="px"
            onChange={(value) => onChange("nodeSpacing", value)}
          />
          <SliderRow
            label="Rank spacing"
            value={settings.rankSpacing}
            min={24}
            max={92}
            step={2}
            suffix="px"
            onChange={(value) => onChange("rankSpacing", value)}
          />
        </section>

        <section className="space-y-4">
          <ToggleRow
            title="Rounded nodes"
            description="Smooth card-like nodes for modern exports."
            checked={settings.roundedNodes}
            onCheckedChange={(checked) => onChange("roundedNodes", checked)}
          />
          <ToggleRow
            title="Preview grid"
            description="Keep the viewport grid visible while composing."
            checked={settings.showGrid}
            onCheckedChange={(checked) => onChange("showGrid", checked)}
          />
        </section>

        <div className="rounded-[24px] border border-[color:var(--border)] bg-slate-950 px-4 py-4 text-sm text-slate-200">
          <p className="font-semibold text-white">{PRESET_MAP[settings.presetId].name} preset</p>
          <p className="mt-2 leading-6 text-slate-400">
            {PRESET_MAP[settings.presetId].description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface ExportControlPanelProps {
  settings: StudioSettings;
  onChange: <K extends keyof StudioSettings>(key: K, value: StudioSettings[K]) => void;
  onApplyResolution: (width: number, height: number) => void;
}

export function ExportControlPanel({
  settings,
  onChange,
  onApplyResolution
}: ExportControlPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Output settings</CardTitle>
        <CardDescription>
          Optional. Adjust size, scale, padding, and file naming before downloading.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Resolution presets</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {RESOLUTION_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="secondary"
                size="sm"
                className="justify-between"
                onClick={() => onApplyResolution(preset.width, preset.height)}
              >
                <span>{preset.label}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {preset.width}x{preset.height}
                </span>
              </Button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledNumberInput
            id="export-width"
            label="Width"
            value={settings.exportWidth}
            min={320}
            onChange={(value) => onChange("exportWidth", value)}
          />
          <LabeledNumberInput
            id="export-height"
            label="Height"
            value={settings.exportHeight}
            min={240}
            onChange={(value) => onChange("exportHeight", value)}
          />
          <LabeledNumberInput
            id="export-scale"
            label="Scale"
            value={settings.exportScale}
            min={1}
            max={4}
            onChange={(value) => onChange("exportScale", value)}
          />
          <LabeledNumberInput
            id="export-padding"
            label="Margin"
            value={settings.exportPadding}
            min={0}
            max={120}
            onChange={(value) => onChange("exportPadding", value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file-name">File name</Label>
          <Input
            id="file-name"
            value={settings.fileName}
            onChange={(event) => onChange("fileName", event.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <Label>{label}</Label>
        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-xs text-white dark:bg-white dark:text-slate-950">
          {value}
          {suffix}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(nextValue) => onChange(nextValue[0] ?? value)}
      />
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4 dark:bg-white/5">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function LabeledNumberInput({
  id,
  label,
  value,
  min,
  max,
  onChange
}: {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
