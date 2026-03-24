import { jsPDF } from "jspdf";
import { getSvgSize, resolveBackground } from "@/lib/mermaid";
import type { ExportFormat, ShadowStyle, StudioSettings } from "@/lib/types";

function escapeXml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function ensureExportBackground(settings: StudioSettings, format: ExportFormat) {
  const background = resolveBackground(settings);
  if (format === "jpeg" && background === "transparent") {
    return "#ffffff";
  }

  return background;
}

function shadowDefinition(style: ShadowStyle) {
  switch (style) {
    case "soft":
      return {
        filter: `<filter id="card-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="rgba(15,23,42,0.22)"/>
        </filter>`,
        fillOpacity: "1"
      };
    case "glass":
      return {
        filter: `<filter id="card-shadow" x="-20%" y="-20%" width="150%" height="170%">
          <feDropShadow dx="0" dy="18" stdDeviation="32" flood-color="rgba(56,189,248,0.14)"/>
        </filter>`,
        fillOpacity: "0.84"
      };
    case "depth":
      return {
        filter: `<filter id="card-shadow" x="-25%" y="-25%" width="160%" height="180%">
          <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="rgba(2,6,23,0.42)"/>
        </filter>`,
        fillOpacity: "1"
      };
    case "none":
    default:
      return {
        filter: "",
        fillOpacity: "1"
      };
  }
}

function wrapSvgForExport(svgMarkup: string, settings: StudioSettings, format: ExportFormat) {
  const parser = new DOMParser();
  const document = parser.parseFromString(svgMarkup, "image/svg+xml");
  const originalSvg = document.querySelector("svg");
  if (!originalSvg) {
    throw new Error("Could not parse the rendered SVG for export.");
  }
  
  // Extract both defs and style tags - they need to be at the root SVG level
  const defsMarkup = Array.from(originalSvg.querySelectorAll("defs"))
    .map((node) => node.outerHTML)
    .join("");

  const styleMarkup = Array.from(originalSvg.querySelectorAll("style"))
    .map((node) => node.outerHTML)
    .join("");

  console.log(`Extracted ${originalSvg.querySelectorAll("defs").length} defs, ${originalSvg.querySelectorAll("style").length} style tags`);
  if (styleMarkup) {
    console.log("Style content length:", styleMarkup.length);
  }

  // Remove defs and styles from the original so they don't appear in innerMarkup
  Array.from(originalSvg.querySelectorAll("defs")).forEach((node) => node.remove());
  Array.from(originalSvg.querySelectorAll("style")).forEach((node) => node.remove());

  // Use XMLSerializer to properly serialize SVG child nodes
  const serializer = new XMLSerializer();
  const innerMarkup = Array.from(originalSvg.childNodes)
    .map((node) => serializer.serializeToString(node))
    .join("");
  const { width: sourceWidth, height: sourceHeight } = getSvgSize(svgMarkup);
  const exportWidth = Math.max(320, settings.exportWidth);
  const exportHeight = Math.max(240, settings.exportHeight);
  const padding = Math.max(0, settings.exportPadding);
  const background = ensureExportBackground(settings, format);
  const shadow = shadowDefinition(settings.shadowStyle);
  const availableWidth = exportWidth - padding * 2;
  const availableHeight = exportHeight - padding * 2;
  const scale = Math.min(availableWidth / sourceWidth, availableHeight / sourceHeight);
  const renderedWidth = sourceWidth * scale;
  const renderedHeight = sourceHeight * scale;
  const offsetX = (exportWidth - renderedWidth) / 2;
  const offsetY = (exportHeight - renderedHeight) / 2;
  const cardFill =
    background === "transparent"
      ? settings.backgroundMode === "dark"
        ? "#09101f"
        : "#ffffff"
      : background;
  const useCard = settings.shadowStyle !== "none";
  const cardPadding = useCard ? 10 : 0;
  const cardRadius = useCard ? 34 : 0;

  const backgroundRect =
    background === "transparent"
      ? ""
      : `<rect width="${exportWidth}" height="${exportHeight}" fill="${escapeXml(background)}" />`;

  const cardRect = useCard
    ? `<rect x="${offsetX - cardPadding}" y="${offsetY - cardPadding}" width="${renderedWidth + cardPadding * 2}" height="${renderedHeight + cardPadding * 2}" rx="${cardRadius}" fill="${escapeXml(cardFill)}" fill-opacity="${shadow.fillOpacity}" ${shadow.filter ? 'filter="url(#card-shadow)"' : ""}/>`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${exportWidth}" height="${exportHeight}" viewBox="0 0 ${exportWidth} ${exportHeight}" fill="none">
  ${styleMarkup}
  <defs>
    ${shadow.filter}
    ${defsMarkup}
  </defs>
  ${backgroundRect}
  ${cardRect}
  <g transform="translate(${offsetX} ${offsetY}) scale(${scale})">
    ${innerMarkup}
  </g>
</svg>`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  requestAnimationFrame(() => URL.revokeObjectURL(url));
}

function inlineStyles(svgMarkup: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, "image/svg+xml");
  const svg = doc.querySelector("svg");
  
  if (!svg) {
    console.error("No SVG found in markup for inlining styles");
    return svgMarkup;
  }

  // Extract all style tags
  const styleTags = Array.from(svg.querySelectorAll("style"));
  const cssText = styleTags.map(style => style.textContent || "").join("\n");
  
  if (!cssText) {
    console.warn("No CSS found in SVG, returning original markup");
    return svgMarkup;
  }

  console.log("Inlining styles from CSS:", cssText.substring(0, 200) + "...");

  // Parse CSS manually since browser's CSSOM doesn't work across document contexts
  try {
    // Simple CSS parser for the most common patterns
    const rules = parseCssRules(cssText);
    
    console.log(`Parsed ${rules.length} CSS rules`);
    
    let appliedCount = 0;
    
    // Apply each rule to matching elements
    rules.forEach(rule => {
      try {
        const elements = svg.querySelectorAll(rule.selector);
        
        elements.forEach(element => {
          if (element instanceof SVGElement || element instanceof HTMLElement) {
            // Apply each property
            for (const [property, value] of Object.entries(rule.properties)) {
              // For SVG presentation attributes, use setAttribute
              if (['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap',
                   'stroke-linejoin', 'stroke-miterlimit', 'opacity', 'fill-opacity', 
                   'stroke-opacity', 'stop-color', 'stop-opacity', 'color'].includes(property)) {
                // Only set if not already explicitly set
                if (!element.hasAttribute(property)) {
                  element.setAttribute(property, value);
                  appliedCount++;
                }
              } else {
                // For other properties, use inline style
                const currentValue = element.style.getPropertyValue(property);
                if (!currentValue) {
                  element.style.setProperty(property, value);
                  appliedCount++;
                }
              }
            }
          }
        });
      } catch (e) {
        console.warn(`Could not apply selector: ${rule.selector}`, e);
      }
    });
    
    console.log(`Applied ${appliedCount} style properties to elements`);
    
    // Remove style tags since styles are now inlined
    styleTags.forEach(style => style.remove());
    
    // Serialize back
    const serialized = new XMLSerializer().serializeToString(svg);
    console.log("Styles inlined successfully, SVG length:", serialized.length);
    return serialized;
  } catch (error) {
    console.error("Error inlining styles:", error);
    return svgMarkup;
  }
}

// Simple CSS rule parser for common patterns
function parseCssRules(cssText: string): Array<{ selector: string; properties: Record<string, string> }> {
  const rules: Array<{ selector: string; properties: Record<string, string> }> = [];
  
  // Remove comments
  let cleaned = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Match rule blocks: selector { prop: value; prop: value; }
  const rulePattern = /([^{]+)\{([^}]+)\}/g;
  let match;
  
  while ((match = rulePattern.exec(cleaned)) !== null) {
    const selector = match[1].trim();
    const declarationsText = match[2].trim();
    
    // Parse declarations
    const properties: Record<string, string> = {};
    const declarations = declarationsText.split(';');
    
    declarations.forEach(decl => {
      const colonIndex = decl.indexOf(':');
      if (colonIndex > 0) {
        const property = decl.substring(0, colonIndex).trim();
        const value = decl.substring(colonIndex + 1).trim();
        
        if (property && value) {
          properties[property] = value;
        }
      }
    });
    
    if (Object.keys(properties).length > 0) {
      rules.push({ selector, properties });
    }
  }
  
  return rules;
}

function svgToDataUrl(svgMarkup: string) {
  console.log("Converting SVG to data URL, starting inline process");
  // Inline all CSS styles before converting to data URL
  const inlinedSvg = inlineStyles(svgMarkup);
  console.log("Inlined SVG length:", inlinedSvg.length);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(inlinedSvg)}`;
}

async function svgMarkupToCanvas(
  svgMarkup: string,
  width: number,
  height: number,
  scale: number,
  background?: string
) {
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create a canvas context for export.");
  }

  context.setTransform(scale, 0, 0, scale, 0, 0);

  if (background && background !== "transparent") {
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
  }

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const nextImage = new Image();
    nextImage.onload = () => resolve(nextImage);
    nextImage.onerror = () => reject(new Error("Failed to rasterize the SVG export."));
    nextImage.src = svgToDataUrl(svgMarkup);
  });

  context.drawImage(image, 0, 0, width, height);
  return canvas;
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("The browser could not generate the requested export file."));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

export async function exportDiagram(svgMarkup: string, settings: StudioSettings, format: ExportFormat) {
  console.log(`Starting export as ${format.toUpperCase()}`);
  console.log("Original SVG length:", svgMarkup.length);
  
  const exportSvg = wrapSvgForExport(svgMarkup, settings, format);
  console.log("Wrapped SVG length:", exportSvg.length);
  
  const width = Math.max(320, settings.exportWidth);
  const height = Math.max(240, settings.exportHeight);
  const background = ensureExportBackground(settings, format);
  const baseFileName = settings.fileName.trim() || "mermaid-flow-diagram";

  if (format === "svg") {
    console.log("Downloading SVG file");
    downloadBlob(
      new Blob([exportSvg], { type: "image/svg+xml;charset=utf-8" }),
      `${baseFileName}.svg`
    );
    return;
  }

  console.log(`Converting to canvas: ${width}x${height}, scale: ${settings.exportScale}`);
  const canvas = await svgMarkupToCanvas(
    exportSvg,
    width,
    height,
    Math.max(1, settings.exportScale),
    background
  );
  console.log("Canvas created successfully");

  if (format === "png") {
    console.log("Generating PNG blob");
    const blob = await canvasToBlob(canvas, "image/png");
    console.log("PNG blob size:", blob.size);
    downloadBlob(blob, `${baseFileName}.png`);
    return;
  }

  if (format === "jpeg") {
    console.log("Generating JPEG blob");
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.96);
    console.log("JPEG blob size:", blob.size);
    downloadBlob(blob, `${baseFileName}.jpg`);
    return;
  }

  console.log("Generating PDF");
  const pdf = new jsPDF({
    orientation: width >= height ? "landscape" : "portrait",
    unit: "px",
    format: [width, height]
  });

  pdf.addImage(canvas.toDataURL("image/png", 1), "PNG", 0, 0, width, height);
  pdf.save(`${baseFileName}.pdf`);
  console.log("PDF download complete");
}
