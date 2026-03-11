import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PwaProvider } from "@/components/providers/pwa-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: "Next.js",
  keywords: [
    "Mermaid",
    "flowchart generator",
    "diagram editor",
    "flowchart creator",
    "mermaid.js",
    "diagram export",
    "offline mermaid editor",
    "Mermaid SVG export",
    "PWA diagram tool", 
    "Mermaid flowchart editor",
    "Mermaid diagram generator",
    "browser based diagram export",
    "sequence diagram",
    "gantt chart",
    "class diagram", 
    "entity relationship diagram",
    "state diagram",
    "user journey",
    "git graph",
    "mindmap",
    "timeline",
    "sankey diagram",
    "pie chart",
    "quadrant chart",
    "requirement diagram",
    "C4 diagram",
    "online diagram tool",
    "free diagram software",
    "visual documentation",
    "technical diagrams"
  ],
  authors: [{ name: "Prabhu Tools", url: "https://prabhu-tools.com" }],
  creator: "Prabhu Tools",
  publisher: "Prabhu Tools",
  category: "developer tools",
  classification: "Productivity Software",
  manifest: "/manifest.webmanifest",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    locale: "en_US",
    title: siteConfig.title,
    description:
      "A private, browser-based Mermaid flowchart editor with live preview, presets, and high-quality exports.",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Mermaid Flow Studio social preview card"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description:
      "Write Mermaid flowchart syntax, refine the visual style, and export production-ready diagrams without leaving the browser.",
    images: [siteConfig.ogImage]
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "black-translucent"
  },
  icons: {
    icon: [
      { url: "/favicon-16.svg", type: "image/svg+xml", sizes: "16x16" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "128x128" },
      { url: "/icon-192.svg", type: "image/svg+xml", sizes: "192x192" }
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
      { url: "/apple-icon.svg", type: "image/svg+xml", sizes: "180x180" }
    ],
    shortcut: "/favicon.svg",
    other: [
      {
        rel: "mask-icon",
        url: "/icon.svg",
        color: "#8B5CF6"
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#050816" }
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)] antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PwaProvider />
          {children}
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
