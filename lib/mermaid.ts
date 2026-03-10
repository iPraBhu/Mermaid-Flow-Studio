import type { MermaidConfig } from "mermaid";
import type { StudioSettings } from "@/lib/types";

const FONT_STACKS: Record<StudioSettings["fontFamily"], string> = {
  "Space Grotesk": '"Space Grotesk", ui-sans-serif, sans-serif',
  "IBM Plex Sans": '"IBM Plex Sans", ui-sans-serif, sans-serif',
  Manrope: '"Manrope", ui-sans-serif, sans-serif',
  "DM Sans": '"DM Sans", ui-sans-serif, sans-serif',
  "JetBrains Mono": '"JetBrains Mono", ui-monospace, monospace'
};

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;

function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((mod) => mod.default);
  }

  return mermaidPromise;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const value = Number.parseInt(expanded, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mixHex(hex: string, mixWith: string, amount: number) {
  const start = hexToRgb(hex);
  const end = hexToRgb(mixWith);

  const r = Math.round(start.r + (end.r - start.r) * amount);
  const g = Math.round(start.g + (end.g - start.g) * amount);
  const b = Math.round(start.b + (end.b - start.b) * amount);

  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function isDark(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 < 150;
}

export function resolveBackground(settings: StudioSettings) {
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
}

function buildMermaidConfig(settings: StudioSettings): MermaidConfig {
  const accent = settings.accentColor;
  const surface = resolveBackground(settings) === "transparent" ? "#ffffff" : resolveBackground(settings);
  const textColor = settings.backgroundMode === "dark" || isDark(surface) ? "#f8fafc" : "#0f172a";
  const fontFamily = FONT_STACKS[settings.fontFamily];

  return {
    startOnLoad: false,
    securityLevel: "strict",
    theme: settings.mermaidTheme,
    fontFamily,
    flowchart: {
      useMaxWidth: false,
      htmlLabels: false,
      nodeSpacing: settings.nodeSpacing,
      rankSpacing: settings.rankSpacing,
      padding: settings.padding,
      curve: "basis"
    },
    themeVariables: {
      fontFamily,
      fontSize: `${settings.fontSize}px`,
      primaryColor: accent,
      primaryBorderColor: mixHex(accent, "#020617", 0.24),
      primaryTextColor: isDark(accent) ? "#ffffff" : "#08111f",
      secondaryColor: mixHex(accent, surface === "transparent" ? "#ffffff" : surface, 0.76),
      tertiaryColor: mixHex(accent, surface === "transparent" ? "#f8fafc" : surface, 0.9),
      lineColor: mixHex(accent, "#0f172a", 0.2),
      textColor,
      mainBkg: mixHex(accent, surface === "transparent" ? "#ffffff" : surface, 0.82),
      secondBkg: mixHex(accent, surface === "transparent" ? "#ffffff" : surface, 0.88),
      clusterBkg: mixHex(accent, surface === "transparent" ? "#ffffff" : surface, 0.92),
      clusterBorder: mixHex(accent, "#0f172a", 0.28),
      edgeLabelBackground:
        settings.backgroundMode === "dark" || isDark(surface) ? rgba("#020617", 0.9) : rgba("#ffffff", 0.9),
      background: "transparent",
      noteBkgColor:
        settings.backgroundMode === "dark" || isDark(surface) ? rgba("#f8fafc", 0.08) : rgba(accent, 0.08),
      noteBorderColor: rgba(accent, 0.45),
      pie1: accent,
      pie2: mixHex(accent, "#10b981", 0.24),
      pie3: mixHex(accent, "#8b5cf6", 0.18)
    }
  };
}

function parseSvgDimensions(svgElement: SVGSVGElement) {
  const viewBox = svgElement.getAttribute("viewBox");

  if (viewBox) {
    const [, , width, height] = viewBox.split(/\s+/).map(Number);
    if (width && height) {
      return { width, height };
    }
  }

  const width = Number.parseFloat(svgElement.getAttribute("width") ?? "0");
  const height = Number.parseFloat(svgElement.getAttribute("height") ?? "0");

  return {
    width: width || 1200,
    height: height || 800
  };
}

export function getSvgSize(svgMarkup: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(svgMarkup, "image/svg+xml");
  const svg = document.querySelector("svg");
  if (!svg) {
    return { width: 1200, height: 800 };
  }
  return parseSvgDimensions(svg);
}

function postProcessSvg(svgMarkup: string, settings: StudioSettings) {
  const parser = new DOMParser();
  const document = parser.parseFromString(svgMarkup, "image/svg+xml");
  const svg = document.querySelector("svg");
  if (!svg) {
    throw new Error("Mermaid returned invalid SVG output.");
  }
  const { width, height } = parseSvgDimensions(svg);

  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Rendered Mermaid flow diagram");
  svg.style.maxWidth = "none";
  svg.style.height = "auto";
  svg.style.backgroundColor = "transparent";

  const radius = settings.roundedNodes ? "18" : "8";

  svg.querySelectorAll("rect").forEach((rect) => {
    if (!rect.hasAttribute("rx")) {
      rect.setAttribute("rx", radius);
      rect.setAttribute("ry", radius);
    }
  });

  svg.querySelectorAll(".node rect, .cluster rect, .node polygon").forEach((shape) => {
    shape.setAttribute("stroke-width", "1.4");
  });

  svg.querySelectorAll("text, tspan, foreignObject *").forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.fontFamily = FONT_STACKS[settings.fontFamily];
    } else {
      node.setAttribute("font-family", FONT_STACKS[settings.fontFamily]);
    }
  });

  return new XMLSerializer().serializeToString(svg);
}

export async function renderMermaidDiagram(source: string, settings: StudioSettings) {
  const mermaid = await getMermaid();
  mermaid.initialize(buildMermaidConfig(settings));

  await mermaid.parse(source);

  const id = `mfs-${crypto.randomUUID().replace(/-/g, "")}`;
  const { svg } = await mermaid.render(id, source);
  const processed = postProcessSvg(svg, settings);
  const size = getSvgSize(processed);

  return {
    svg: processed,
    ...size
  };
}
