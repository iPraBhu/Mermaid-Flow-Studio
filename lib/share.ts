import type { StudioSettings } from "@/lib/types";

const PARAM_KEY = "mfs";

function encodeBase64(input: string) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window.btoa(binary);
}

function decodeBase64(input: string) {
  const binary = window.atob(input);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function buildShareUrl(settings: StudioSettings) {
  if (typeof window === "undefined") {
    return "";
  }

  const payload = encodeBase64(
    JSON.stringify({
      source: settings.source,
      presetId: settings.presetId,
      mermaidTheme: settings.mermaidTheme,
      backgroundMode: settings.backgroundMode,
      backgroundColor: settings.backgroundColor,
      accentColor: settings.accentColor,
      fontFamily: settings.fontFamily,
      fontSize: settings.fontSize,
      padding: settings.padding,
      nodeSpacing: settings.nodeSpacing,
      rankSpacing: settings.rankSpacing,
      roundedNodes: settings.roundedNodes,
      shadowStyle: settings.shadowStyle,
      showGrid: settings.showGrid
    })
  );

  const url = new URL(window.location.href);
  url.searchParams.set(PARAM_KEY, payload);
  return url.toString();
}

export function parseSharedSettings() {
  if (typeof window === "undefined") {
    return null;
  }

  const url = new URL(window.location.href);
  const payload = url.searchParams.get(PARAM_KEY);

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64(payload));
  } catch {
    return null;
  }
}
