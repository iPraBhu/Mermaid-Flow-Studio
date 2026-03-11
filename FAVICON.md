# Favicon Generation Guide

## SVG to ICO/PNG Conversion

We have created SVG versions of all favicons. To generate the actual ICO and PNG files for production:

### Method 1: Online Tools
1. Visit [favicon.io](https://favicon.io/favicon-converter/)
2. Upload `favicon-16.svg` for the 16x16 ICO
3. Download the generated `favicon.ico`

### Method 2: CLI Tools (if available)
```bash
# Using ImageMagick (if available)
convert favicon-16.svg -define icon:auto-resize favicon.ico

# Using sharp-cli (if available)
sharp favicon-16.svg --resize 16x16 --format png --output favicon-16.png
sharp favicon.svg --resize 32x32 --format png --output favicon-32.png
```

### Method 3: Using Node.js (recommended for CI/CD)
Add to package.json scripts:
```json
{
  "scripts": {
    "build:favicons": "node scripts/generate-favicons.js"
  }
}
```

## Current Favicon Setup

✅ **SVG Files Created:**
- `favicon.svg` - Main favicon (48x48)
- `favicon-16.svg` - Tiny favicon for ICO (16x16) 
- `icon.svg` - App icon (128x128)
- `icon-192.svg` - PWA icon (192x192)
- `icon-512.svg` - Large PWA icon (512x512)
- `apple-icon.svg` - Apple touch icon (180x180)
- `logo.svg` - Website logo (56x56)
- `logo-hero.svg` - Hero logo variant (200x120)

✅ **Layout Integration:**
- All SVG favicons are referenced in layout.tsx
- Logo component created for consistent branding
- OG card updated with mermaid character

## Features
- 🧜‍♀️ Cute mermaid character representing your brand
- 🎨 Consistent design across all sizes
- 📱 Mobile and PWA optimized
- 🔍 SEO-friendly with proper meta tags
- ⚡ Modern SVG format for crisp scaling

## Browser Support
- ✅ Modern browsers (SVG favicons)
- ✅ Legacy browsers (when ICO is generated)
- ✅ Mobile devices
- ✅ PWA installations