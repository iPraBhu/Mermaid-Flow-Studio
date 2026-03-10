import { z } from "zod";
import type { StudioSettings } from "@/lib/types";

export const STORAGE_KEY = "mermaid-flow-studio:v1";

const studioSettingsSchema = z.object({
  source: z.string(),
  presetId: z.string(),
  mermaidTheme: z.string(),
  backgroundMode: z.string(),
  backgroundColor: z.string(),
  accentColor: z.string(),
  fontFamily: z.string(),
  fontSize: z.number(),
  padding: z.number(),
  nodeSpacing: z.number(),
  rankSpacing: z.number(),
  roundedNodes: z.boolean(),
  shadowStyle: z.string(),
  exportWidth: z.number(),
  exportHeight: z.number(),
  exportScale: z.number(),
  exportPadding: z.number(),
  exportFormat: z.string(),
  fileName: z.string(),
  showGrid: z.boolean()
});

export function loadStudioSettings(): Partial<StudioSettings> | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  const parsed = studioSettingsSchema.safeParse(JSON.parse(rawValue));
  if (!parsed.success) {
    return null;
  }

  return parsed.data as Partial<StudioSettings>;
}

export function saveStudioSettings(settings: StudioSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
