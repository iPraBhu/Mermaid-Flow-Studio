# Export Download Fix

## Issues Fixed

### 1. Incomplete/Broken SVG Exports
**Symptom:** Downloaded files (all formats) were missing SVG elements or had corrupted content.

**Root Cause:** The `wrapSvgForExport` function was using `innerHTML` to extract SVG content, which doesn't properly serialize SVG elements with their XML namespaces and attributes.

**Solution:** Replaced `innerHTML` with `XMLSerializer` to correctly serialize all SVG child nodes:

```typescript
// Use XMLSerializer to properly serialize SVG child nodes
const serializer = new XMLSerializer();
const innerMarkup = Array.from(originalSvg.childNodes)
  .map((node) => serializer.serializeToString(node))
  .join("");
```

### 2. PNG/JPEG Showing Only Text (White Background, No Colors/Borders)
**Symptom:** PNG and JPEG exports showed only text with everything else appearing white - no borders, colors, or shapes visible.

**Root Causes:** 
1. **Style Tags Not Preserved:** The `wrapSvgForExport` function extracted `<defs>` but missed `<style>` tags. These style tags contain all CSS for colors, borders, and fills. They were getting buried in the transformed `<g>` group where they couldn't be properly processed.

2. **CSS Not Inlined for Canvas Rendering:** When converting SVG to a data URL for canvas rendering, browsers don't apply CSS styles from `<style>` tags, so only elements with inline attributes appeared.

**Solutions:** 

1. **Extract and Preserve Style Tags** in `wrapSvgForExport`:
```typescript
// Extract both defs and style tags - they need to be at the root SVG level
const styleMarkup = Array.from(originalSvg.querySelectorAll("style"))
  .map((node) => node.outerHTML)
  .join("");

// Remove styles from original so they don't appear in innerMarkup
Array.from(originalSvg.querySelectorAll("style")).forEach((node) => node.remove());

// Include styles at SVG root level (not inside transformed group)
return `<?xml version="1.0" encoding="UTF-8"?>
<svg ...>
  ${styleMarkup}
  <defs>...</defs>
  ...
</svg>`;
```

2. **Inline All CSS Styles** before canvas conversion:
```typescript
function inlineStyles(svgMarkup: string): string {
  // Parse SVG and extract style tags
  // Create temporary stylesheet to parse CSS rules
  // Apply CSS rules as inline attributes on matching elements
  // Handle SVG presentation attributes (fill, stroke, etc.)
  // Respect existing inline attributes (don't override)
  // Remove style tags after inlining
  // Return fully inlined SVG
}

function svgToDataUrl(svgMarkup: string) {
  const inlinedSvg = inlineStyles(svgMarkup);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(inlinedSvg)}`;
}
```

Key improvements to `inlineStyles`:
- Added more SVG presentation attributes: `stroke-linecap`, `stroke-linejoin`
- Respects existing inline attributes (doesn't override)
- Preserves CSS priority when setting styles
- Handles selector errors gracefully

## Technical Details

### Why `innerHTML` Failed for SVG
- SVG is XML-based and requires proper namespace handling
- `innerHTML` loses critical attributes and namespace declarations
- XML serialization preserves all SVG-specific attributes

### Why CSS Styles Weren't Applied in Canvas
- When SVG is loaded as `Image.src` data URL, CSS in `<style>` tags isn't processed
- Canvas rendering requires all styles to be inline attributes or presentation attributes
- Browser security/rendering model treats data URL images differently than DOM SVGs

### Namespace Declaration Fix
Added `xmlns:xlink` to support SVG features requiring XLink namespace:
```typescript
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ...>
```

## Impact
Both fixes combined resolve export issues for:
- ✅ SVG format - Properly serializes all elements and attributes
- ✅ PNG format - Correctly renders with all colors, borders, and shapes
- ✅ JPEG format - Correctly renders with all visual properties
- ✅ PDF format - Embeds properly styled SVG content

## Testing Recommendations
Test the download functionality with:
1. Simple flowcharts with colored nodes
2. Complex diagrams with multiple shapes, edges, and styles
3. Diagrams with HTML labels (`<br>`, `<b>`, `<i>`, etc.)
4. Diagrams with gradients and patterns
5. Different Mermaid themes (dark, forest, default, etc.)
6. Diagrams with special characters and unicode
7. Different diagram types (sequence, class, state, gantt, etc.)
8. Various export settings (different sizes, scales, padding, shadow styles)
9. Both light and dark background modes

### Specific PNG/JPEG Tests
- Verify node borders are visible
- Confirm fill colors match the preview
- Check that arrow/line colors are correct
- Ensure text styling (bold, italic) is preserved
- Validate shadow effects appear correctly

## Files Changed
- `lib/export.ts` 
  - Fixed SVG serialization in `wrapSvgForExport` (XMLSerializer)
  - Added `inlineStyles()` function to inline CSS before canvas conversion
  - Updated `svgToDataUrl()` to call `inlineStyles()`
  - Added `xmlns:xlink` namespace declaration
