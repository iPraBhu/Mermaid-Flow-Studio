export type MermaidThemeOption = "default" | "neutral" | "forest" | "dark" | "base";
export type StudioPresetId =
  | "minimal"
  | "modern"
  | "glass"
  | "dark-pro"
  | "presentation"
  | "print-friendly";
export type ExportFormat = "svg" | "png" | "jpeg" | "pdf";
export type BackgroundMode = "transparent" | "white" | "dark" | "custom";
export type FontFamilyOption =
  | "Space Grotesk"
  | "IBM Plex Sans"
  | "Manrope"
  | "DM Sans"
  | "JetBrains Mono";
export type ShadowStyle = "none" | "soft" | "glass" | "depth";
export type TemplateId =
  | "default"
  | "basic-process"
  | "decision-tree"
  | "user-journey"
  | "api-request-lifecycle";

export interface StudioSettings {
  source: string;
  presetId: StudioPresetId;
  mermaidTheme: MermaidThemeOption;
  backgroundMode: BackgroundMode;
  backgroundColor: string;
  accentColor: string;
  fontFamily: FontFamilyOption;
  fontSize: number;
  padding: number;
  nodeSpacing: number;
  rankSpacing: number;
  roundedNodes: boolean;
  shadowStyle: ShadowStyle;
  exportWidth: number;
  exportHeight: number;
  exportScale: number;
  exportPadding: number;
  exportFormat: ExportFormat;
  fileName: string;
  showGrid: boolean;
}

export interface PresetDefinition {
  id: StudioPresetId;
  name: string;
  description: string;
  settings: Partial<StudioSettings>;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  source: string;
}

export interface PreviewState {
  svg: string | null;
  error: string | null;
  isRendering: boolean;
  width: number;
  height: number;
}
