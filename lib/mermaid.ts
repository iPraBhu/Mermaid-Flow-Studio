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
let renderQueue: Promise<void> = Promise.resolve();
let renderHost: HTMLDivElement | null = null;

interface RenderAttempt {
  htmlLabels: boolean;
  source: string;
}

function normalizeMermaidSource(source: string) {
  return source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

function normalizeBrTags(source: string) {
  // Normalize all variations of <br> tags to <br/> so Mermaid renders them as actual line breaks
  // This includes <br>, <br/>, <br />, <BR>, etc.
  // We normalize them to a consistent format that Mermaid understands
  
  let result = '';
  let i = 0;
  let inLabel = false;
  const labelStack: string[] = []; // Track nested delimiters
  
  // Map opening to closing delimiters
  const closingDelimiters: Record<string, string> = {
    '[': ']',
    '(': ')',
    '{': '}'
  };
  
  while (i < source.length) {
    const char = source[i];
    const remaining = source.substring(i);
    
    // Check for <br> tags when inside a label and normalize them
    if (inLabel) {
      const brMatch = remaining.match(/^<br\s*\/?>/i);
      if (brMatch) {
        result += '<br/>';  // Normalize to consistent format for Mermaid
        i += brMatch[0].length;
        continue;
      }
    }
    
    // Check for opening delimiters that start labels
    if ('[({'.includes(char)) {
      labelStack.push(closingDelimiters[char]);
      inLabel = true;
    }
    // Check for closing delimiters
    else if (labelStack.length > 0 && char === labelStack[labelStack.length - 1]) {
      labelStack.pop();
      if (labelStack.length === 0) {
        inLabel = false;
      }
    }
    // Handle quoted strings
    else if (char === '"' && (i === 0 || source[i - 1] !== '\\')) {
      if (labelStack[labelStack.length - 1] === '"') {
        labelStack.pop();
        if (labelStack.length === 0) {
          inLabel = false;
        }
      } else {
        labelStack.push('"');
        inLabel = true;
      }
    }
    
    result += char;
    i++;
  }
  
  return result;
}

function stripHtmlBreaks(source: string) {
  // Replace HTML breaks with spaces for fallback compatibility 
  return source.replace(/<br\s*\/?>/gi, " ");
}

function buildRenderAttempts(source: string) {
  const normalized = normalizeMermaidSource(source);
  const withNormalizedBrs = normalizeBrTags(normalized);
  const withoutBreaks = stripHtmlBreaks(normalized);
  
  const attempts: RenderAttempt[] = [
    // Try with normalized <br/> tags and htmlLabels enabled (preferred)
    { source: withNormalizedBrs, htmlLabels: true },
    
    // Try with normalized <br/> tags and htmlLabels disabled
    { source: withNormalizedBrs, htmlLabels: false },
    
    // Try without breaks as fallback
    { source: withoutBreaks, htmlLabels: true },
    { source: withoutBreaks, htmlLabels: false }
  ];

  // Remove duplicates
  const unique = attempts.filter((attempt, index, arr) => 
    arr.findIndex(a => a.source === attempt.source && a.htmlLabels === attempt.htmlLabels) === index
  );

  return unique;
}

function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((mod) => mod.default);
  }

  return mermaidPromise;
}

function assertBrowserRenderingSupport() {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof DOMParser === "undefined" ||
    typeof XMLSerializer === "undefined"
  ) {
    throw new Error("Mermaid rendering is only available in a browser context.");
  }
}

function getRenderHost() {
  assertBrowserRenderingSupport();

  if (!renderHost || !renderHost.isConnected) {
    renderHost = document.createElement("div");
    renderHost.setAttribute("aria-hidden", "true");
    renderHost.setAttribute("data-mermaid-render-host", "true");
    renderHost.style.position = "fixed";
    renderHost.style.left = "-10000px";
    renderHost.style.top = "0";
    renderHost.style.width = "1px";
    renderHost.style.height = "1px";
    renderHost.style.overflow = "hidden";
    renderHost.style.pointerEvents = "none";
    document.body.appendChild(renderHost);
  }

  return renderHost;
}

function createRenderId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `mfs-${crypto.randomUUID().replace(/-/g, "")}`;
  }

  return `mfs-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

function enqueueRender<T>(task: () => Promise<T>) {
  const nextTask = renderQueue.then(task, task);
  renderQueue = nextTask.then(
    () => undefined,
    () => undefined
  );
  return nextTask;
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

function buildMermaidConfig(
  settings: StudioSettings,
  options: { htmlLabels?: boolean } = {}
): MermaidConfig {
  const accent = settings.accentColor;
  const surface = resolveBackground(settings) === "transparent" ? "#ffffff" : resolveBackground(settings);
  const textColor = settings.backgroundMode === "dark" || isDark(surface) ? "#f8fafc" : "#0f172a";
  const fontFamily = FONT_STACKS[settings.fontFamily];
  const htmlLabels = options.htmlLabels ?? true;

  return {
    startOnLoad: false,
    securityLevel: "strict",
    theme: settings.mermaidTheme,
    htmlLabels,
    fontFamily,
    flowchart: {
      useMaxWidth: false,
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
      nodeTextColor: textColor,
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
  assertBrowserRenderingSupport();
  const parser = new DOMParser();
  const document = parser.parseFromString(svgMarkup, "image/svg+xml");
  const svg = document.querySelector("svg");
  if (!svg) {
    return { width: 1200, height: 800 };
  }
  return parseSvgDimensions(svg);
}

function postProcessSvg(svgMarkup: string, settings: StudioSettings) {
  assertBrowserRenderingSupport();
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
  assertBrowserRenderingSupport();

  return enqueueRender(async () => {
    const mermaid = await getMermaid();
    const host = getRenderHost();
    const attempts = buildRenderAttempts(source);
    let lastError: unknown;

    for (const attempt of attempts) {
      try {
        mermaid.initialize(buildMermaidConfig(settings, { htmlLabels: attempt.htmlLabels }));

        await mermaid.parse(attempt.source);

        const id = createRenderId();
        const { svg } = await mermaid.render(id, attempt.source, host);
        const processed = postProcessSvg(svg, settings);
        const size = getSvgSize(processed);

        return {
          svg: processed,
          ...size
        };
      } catch (error) {
        lastError = error;
      } finally {
        host.replaceChildren();
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error("Mermaid could not parse the diagram source.");
  });
}
