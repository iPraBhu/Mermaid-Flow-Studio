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

// Safe HTML tags allowed in Mermaid labels
const SAFE_HTML_TAGS = ['br', 'b', 'strong', 'i', 'em', 'u', 'sup', 'sub', 'span'];

function normalizeMermaidSource(source: string) {
  return source
    .replace(/^\uFEFF/, "") // Remove BOM
    .replace(/\r\n?/g, "\n") // Normalize line endings
    .trim(); // Remove leading/trailing whitespace
}

function sanitizeHtmlInLabels(source: string) {
  // Allow safe HTML tags, remove potentially dangerous ones
  // This prevents XSS while allowing formatting tags
  const dangerousTagPattern = /<(?!\/?(?:br|b|strong|i|em|u|sup|sub|span)\b)[^>]*>/gi;
  return source.replace(dangerousTagPattern, (match) => {
    // Replace dangerous tags with encoded version for text display
    return match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });
}

function stripAllHtmlTags(source: string) {
  // Complete fallback - replace ALL HTML tags with spaces
  return source.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ");
}

function escapeSpecialChars(source: string) {
  // Escape HTML entities that might cause issues
  // But preserve intentional HTML tags
  return source
    .replace(/&(?!(?:lt|gt|amp|quot|apos|nbsp|#\d+|#x[\da-f]+);)/gi, "&amp;")
    .replace(/\u00a0/g, "&nbsp;"); // Replace non-breaking spaces
}

function detectDiagramType(source: string): string {
  const trimmedSource = source.trim();
  const firstLine = trimmedSource.split('\n')[0].toLowerCase().trim();
  
  // Detect Mermaid diagram type from the first line
  if (firstLine.startsWith('graph')) return 'graph';
  if (firstLine.startsWith('flowchart')) return 'flowchart';
  if (firstLine.startsWith('sequencediagram')) return 'sequence';
  if (firstLine.startsWith('classDiagram')) return 'class';
  if (firstLine.startsWith('stateDiagram')) return 'state';
  if (firstLine.startsWith('erDiagram')) return 'er';
  if (firstLine.startsWith('gantt')) return 'gantt';
  if (firstLine.startsWith('pie')) return 'pie';
  if (firstLine.startsWith('journey')) return 'journey';
  if (firstLine.startsWith('gitGraph')) return 'git';
  if (firstLine.startsWith('mindmap')) return 'mindmap';
  if (firstLine.startsWith('timeline')) return 'timeline';
  if (firstLine.startsWith('quadrantChart')) return 'quadrant';
  if (firstLine.startsWith('requirementDiagram')) return 'requirement';
  
  return 'flowchart'; // Default assumption
}

function buildRenderAttempts(source: string) {
  const normalized = normalizeMermaidSource(source);
  const diagramType = detectDiagramType(normalized);
  
  // Different strategies based on diagram type
  const supportsHtml = ['flowchart', 'graph', 'sequence', 'class'].includes(diagramType);
  
  const attempts: RenderAttempt[] = [];
  
  if (supportsHtml) {
    // Strategy 1: Try with sanitized HTML (safe tags only)
    const sanitized = sanitizeHtmlInLabels(normalized);
    attempts.push({ source: sanitized, htmlLabels: true });
    
    // Strategy 2: Try with escaped special chars but keep HTML
    const escaped = escapeSpecialChars(sanitized);
    if (escaped !== sanitized) {
      attempts.push({ source: escaped, htmlLabels: true });
    }
  }
  
  // Strategy 3: Try original normalized source with HTML support
  attempts.push({ source: normalized, htmlLabels: true });
  
  // Strategy 4: Try without any HTML tags as fallback
  const withoutHtml = stripAllHtmlTags(normalized);
  attempts.push({ source: withoutHtml, htmlLabels: true });
  
  // Strategy 5: Complete fallback - no HTML labels at all
  attempts.push({ source: withoutHtml, htmlLabels: false });
  
  // Strategy 6: Last resort - try original with no HTML labels
  attempts.push({ source: normalized, htmlLabels: false });

  // Remove duplicates based on source and htmlLabels combination
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
  options: { htmlLabels?: boolean; diagramType?: string } = {}
): MermaidConfig {
  const accent = settings.accentColor;
  const surface = resolveBackground(settings) === "transparent" ? "#ffffff" : resolveBackground(settings);
  const textColor = settings.backgroundMode === "dark" || isDark(surface) ? "#f8fafc" : "#0f172a";
  const fontFamily = FONT_STACKS[settings.fontFamily];
  const htmlLabels = options.htmlLabels ?? true;
  const diagramType = options.diagramType ?? 'flowchart';

  const baseConfig: MermaidConfig = {
    startOnLoad: false,
    securityLevel: "loose", // Changed from "strict" to allow more HTML features
    deterministicIds: true, // More consistent rendering
    theme: settings.mermaidTheme,
    htmlLabels,
    fontFamily,
    // Universal theme variables that apply to all diagram types
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
      pie3: mixHex(accent, "#8b5cf6", 0.18),
      // Additional common variables
      labelTextColor: textColor,
      labelBackground: settings.backgroundMode === "dark" || isDark(surface) ? rgba("#020617", 0.9) : rgba("#ffffff", 0.9),
    }
  };

  // Add diagram-specific configurations
  if (diagramType === 'flowchart' || diagramType === 'graph') {
    baseConfig.flowchart = {
      useMaxWidth: false,
      nodeSpacing: settings.nodeSpacing,
      rankSpacing: settings.rankSpacing,
      padding: settings.padding,
      curve: "basis",
      htmlLabels,
      diagramPadding: settings.padding,
    };
  }

  if (diagramType === 'sequence') {
    baseConfig.sequence = {
      useMaxWidth: false,
      diagramMarginX: 50,
      diagramMarginY: 30,
      boxTextMargin: 5,
      noteMargin: 10,
      messageMargin: 35,
      mirrorActors: true,
      wrap: true,
      wrapPadding: 10,
    };
  }

  if (diagramType === 'gantt') {
    baseConfig.gantt = {
      useMaxWidth: false,
      leftPadding: 75,
      gridLineStartPadding: 35,
      fontSize: settings.fontSize,
      numberSectionStyles: 4,
    };
  }

  return baseConfig;
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

/**
 * Validates Mermaid diagram syntax without rendering
 * Useful for pre-validation and providing feedback to users
 */
export async function validateMermaidSyntax(source: string): Promise<{
  valid: boolean;
  error?: string;
  diagramType?: string;
}> {
  try {
    const mermaid = await getMermaid();
    const normalized = normalizeMermaidSource(source);
    const diagramType = detectDiagramType(normalized);
    
    // Try to parse the diagram
    await mermaid.parse(normalized);
    
    return {
      valid: true,
      diagramType
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error),
      diagramType: detectDiagramType(source)
    };
  }
}

/**
 * Provides suggestions for common Mermaid syntax issues
 */
export function getDiagramSuggestions(source: string): string[] {
  const suggestions: string[] = [];
  const lines = source.split('\n');
  
  // Check for common issues
  if (!source.trim()) {
    suggestions.push("Diagram source is empty");
    return suggestions;
  }
  
  // Check for unmatched quotes
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const doubleQuotes = (line.match(/"/g) || []).length;
    const singleQuotes = (line.match(/'/g) || []).length;
    
    if (doubleQuotes % 2 !== 0) {
      suggestions.push(`Line ${i + 1}: Unmatched double quote - ensure all quotes are properly closed`);
    }
    if (singleQuotes % 2 !== 0 && line.includes("'")) {
      suggestions.push(`Line ${i + 1}: Unmatched single quote - consider using double quotes for labels`);
    }
  }
  
  // Check for unclosed HTML tags
  const htmlTagPattern = /<([a-z]+)(?:\s[^>]*)?>(?!.*?<\/\1>)/gi;
  const unclosedTags = source.match(htmlTagPattern);
  if (unclosedTags && unclosedTags.length > 0) {
    suggestions.push("Possible unclosed HTML tags detected - ensure all tags like <b>, <i> are properly closed");
  }
  
  // Check for problematic special characters in labels
  if (source.includes('&') && !source.includes('&amp;') && !source.includes('&lt;') && !source.includes('&gt;')) {
    suggestions.push("Ampersand (&) detected - consider using &amp; for proper encoding");
  }
  
  // Check for missing diagram type
  const firstLine = lines[0].trim().toLowerCase();
  const validTypes = ['graph', 'flowchart', 'sequencediagram', 'classdiagram', 'statediagram', 
                      'erdiagram', 'gantt', 'pie', 'journey', 'gitgraph', 'mindmap', 'timeline'];
  if (!validTypes.some(type => firstLine.startsWith(type))) {
    suggestions.push("First line should specify diagram type (e.g., 'flowchart TD', 'sequenceDiagram', etc.)");
  }
  
  // Check for mixed arrow styles
  const hasOldArrows = /-->/g.test(source) || /--->/g.test(source);
  const hasNewArrows = /==>/g.test(source) || /-.>/g.test(source);
  if (hasOldArrows && hasNewArrows) {
    suggestions.push("Mixed arrow styles detected - ensure consistent arrow syntax throughout");
  }
  
  return suggestions;
}

function postProcessSvg(svgMarkup: string, settings: StudioSettings) {
  assertBrowserRenderingSupport();
  const parser = new DOMParser();
  const document = parser.parseFromString(svgMarkup, "image/svg+xml");
  
  // Check for XML parsing errors
  const parserError = document.querySelector("parsererror");
  if (parserError) {
    throw new Error("SVG output contains invalid XML: " + parserError.textContent);
  }
  
  const svg = document.querySelector("svg");
  if (!svg) {
    throw new Error("Mermaid returned invalid SVG output.");
  }
  
  const { width, height } = parseSvgDimensions(svg);

  // Set proper SVG attributes
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"); // For links support
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Rendered Mermaid diagram");
  svg.style.maxWidth = "none";
  svg.style.height = "auto";
  svg.style.backgroundColor = "transparent";

  const radius = settings.roundedNodes ? "18" : "8";

  // Apply rounded corners to rectangles
  svg.querySelectorAll("rect").forEach((rect) => {
    if (!rect.hasAttribute("rx")) {
      rect.setAttribute("rx", radius);
      rect.setAttribute("ry", radius);
    }
  });

  // Enhance stroke width for better visibility
  svg.querySelectorAll(".node rect, .cluster rect, .node polygon").forEach((shape) => {
    shape.setAttribute("stroke-width", "1.4");
  });

  // Apply consistent font-family across all text elements
  svg.querySelectorAll("text, tspan, foreignObject *, .label, .nodeLabel").forEach((node) => {
    if (node instanceof HTMLElement || node instanceof SVGElement) {
      if (node instanceof HTMLElement) {
        node.style.fontFamily = FONT_STACKS[settings.fontFamily];
      } else {
        node.setAttribute("font-family", FONT_STACKS[settings.fontFamily]);
      }
      
      // Ensure text is selectable and readable
      if (node.tagName.toLowerCase() === 'text' || node.tagName.toLowerCase() === 'tspan') {
        node.setAttribute("dominant-baseline", "central");
      }
    }
  });

  // Handle foreignObject for HTML content - ensure proper sizing
  svg.querySelectorAll("foreignObject").forEach((fo) => {
    const width = fo.getAttribute("width");
    const height = fo.getAttribute("height");
    if (width && height) {
      fo.style.overflow = "visible";
    }
  });

  // Serialize back to string
  try {
    return new XMLSerializer().serializeToString(svg);
  } catch (error) {
    throw new Error("Failed to serialize SVG: " + (error instanceof Error ? error.message : String(error)));
  }
}

export async function renderMermaidDiagram(source: string, settings: StudioSettings) {
  assertBrowserRenderingSupport();

  return enqueueRender(async () => {
    const mermaid = await getMermaid();
    const host = getRenderHost();
    const attempts = buildRenderAttempts(source);
    const diagramType = detectDiagramType(source);
    const errors: Array<{ attempt: number; error: string; htmlLabels: boolean }> = [];
    
    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      try {
        // Initialize with diagram-specific config
        mermaid.initialize(buildMermaidConfig(settings, { 
          htmlLabels: attempt.htmlLabels,
          diagramType 
        }));

        // Validate syntax first
        await mermaid.parse(attempt.source);

        // Render the diagram
        const id = createRenderId();
        const { svg } = await mermaid.render(id, attempt.source, host);
        const processed = postProcessSvg(svg, settings);
        const size = getSvgSize(processed);

        // Success! Return the result
        return {
          svg: processed,
          ...size
        };
      } catch (error) {
        // Log this attempt's failure
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({
          attempt: i + 1,
          error: errorMessage,
          htmlLabels: attempt.htmlLabels
        });
        
        // Continue to next attempt
      } finally {
        // Clean up render host
        host.replaceChildren();
      }
    }

    // All attempts failed - create comprehensive error message
    const errorDetails = errors.map(e => 
      `Attempt ${e.attempt} (htmlLabels: ${e.htmlLabels}): ${e.error}`
    ).join('\n');
    
    const mainError = errors[0]?.error || "Unknown parsing error";
    const detailedMessage = `Mermaid diagram parsing failed after ${attempts.length} attempts.\n\n` +
      `Detected diagram type: ${diagramType}\n\n` +
      `Primary error: ${mainError}\n\n` +
      `Common issues:\n` +
      `- Check for unescaped special characters in labels (quotes, brackets, pipes)\n` +
      `- Verify arrow syntax matches diagram type\n` +
      `- Ensure HTML tags are properly closed if using HTML labels\n` +
      `- Check for syntax errors in ${diagramType} diagram format\n\n` +
      `All attempts:\n${errorDetails}`;
    
    throw new Error(detailedMessage);
  });
}
