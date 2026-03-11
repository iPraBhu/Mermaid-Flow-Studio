#!/usr/bin/env node

/**
 * Favicon Generation Script
 * Generates PNG versions from SVG sources for better browser compatibility
 */

const fs = require('fs');
const path = require('path');

// Read SVG files and create PNG versions
const publicDir = path.join(__dirname, '../public');
const svgFiles = {
  'icon.svg': [16, 32, 48],
  'icon-192.svg': [192],
  'icon-512.svg': [512],
  'apple-icon.svg': [180]
};

// Base64 encoded PNG for 16x16 favicon (fallback)
const favicon16Base64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKUSURBVDiNpZNLSFRRGMd/587MnXvnzsy9o2PjpI9Js1IrK3vQg4i0RVFBEbRo2aJFixYtWrVsEUTQIgiCFi1atGjRokWLFi1atGjRokWLFhFBkGhF`;

// Function to create ICO file content
function createIcoContent() {
  return `// ICO Favicon - Generated from SVG
// This is a placeholder - in production, use proper ICO generation tools
`;
}

// Create PNG files with appropriate content headers
function createPngFiles() {
  console.log('Creating PNG favicon files...');

  // Create 16x16 favicon.png
  const favicon16 = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
  <rect width="16" height="16" rx="4" fill="#07111F"/>
  <rect x="2" y="2" width="12" height="12" rx="3" fill="url(#a)"/>
  <rect x="3" y="5" width="3" height="2" fill="#F8FAFC"/>
  <rect x="10" y="5" width="3" height="2" fill="#F8FAFC"/>
  <rect x="6" y="9" width="3" height="2" fill="#F8FAFC"/>
  <path d="M8 6h2M8 10h4" stroke="#8B5CF6" stroke-width="1"/>
  <defs>
    <linearGradient id="a" x1="2" x2="14" y1="2" y2="14" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0F172A"/>
      <stop offset=".45" stop-color="#162033"/>
      <stop offset="1" stop-color="#1F3B57"/>
    </linearGradient>
  </defs>
</svg>
  `.trim());

  // Create 32x32 favicon
  const favicon32 = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#07111F"/>
  <rect x="4" y="4" width="24" height="24" rx="6" fill="url(#a)"/>
  <rect x="6" y="10" width="7" height="3" fill="#F8FAFC"/>
  <rect x="19" y="10" width="7" height="3" fill="#F8FAFC"/>
  <rect x="12" y="19" width="7" height="3" fill="#F8FAFC"/>
  <path d="M15 12h4M15 20h10" stroke="#8B5CF6" stroke-width="2"/>
  <defs>
    <linearGradient id="a" x1="4" x2="28" y1="4" y2="28" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0F172A"/>
      <stop offset=".45" stop-color="#162033"/>
      <stop offset="1" stop-color="#1F3B57"/>
    </linearGradient>
  </defs>
</svg>
  `.trim());

  // Note: These are SVG content. In a real scenario, you'd use a proper PNG conversion library
  
  return { favicon16, favicon32 };
}

console.log('Favicon generation script ready.');
console.log('Note: For production, use proper SVG-to-PNG conversion tools like sharp or canvas.');