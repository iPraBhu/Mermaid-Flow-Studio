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
  const defsMarkup = Array.from(originalSvg.querySelectorAll("defs"))
    .map((node) => node.outerHTML)
    .join("");

  Array.from(originalSvg.querySelectorAll("defs")).forEach((node) => node.remove());

  const innerMarkup = originalSvg.innerHTML;
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
<svg xmlns="http://www.w3.org/2000/svg" width="${exportWidth}" height="${exportHeight}" viewBox="0 0 ${exportWidth} ${exportHeight}" fill="none">
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

function svgToDataUrl(svgMarkup: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
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
  const exportSvg = wrapSvgForExport(svgMarkup, settings, format);
  const width = Math.max(320, settings.exportWidth);
  const height = Math.max(240, settings.exportHeight);
  const background = ensureExportBackground(settings, format);
  const baseFileName = settings.fileName.trim() || "mermaid-flow-diagram";

  if (format === "svg") {
    downloadBlob(
      new Blob([exportSvg], { type: "image/svg+xml;charset=utf-8" }),
      `${baseFileName}.svg`
    );
    return;
  }

  const canvas = await svgMarkupToCanvas(
    exportSvg,
    width,
    height,
    Math.max(1, settings.exportScale),
    background
  );

  if (format === "png") {
    const blob = await canvasToBlob(canvas, "image/png");
    downloadBlob(blob, `${baseFileName}.png`);
    return;
  }

  if (format === "jpeg") {
    const blob = await canvasToBlob(canvas, "image/jpeg", 0.96);
    downloadBlob(blob, `${baseFileName}.jpg`);
    return;
  }

  const pdf = new jsPDF({
    orientation: width >= height ? "landscape" : "portrait",
    unit: "px",
    format: [width, height]
  });

  pdf.addImage(canvas.toDataURL("image/png", 1), "PNG", 0, 0, width, height);
  pdf.save(`${baseFileName}.pdf`);
}
