import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PwaProvider } from "@/components/providers/pwa-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mermaidflow.studio"),
  title: {
    default: "Mermaid Flow Studio",
    template: "%s | Mermaid Flow Studio"
  },
  description:
    "Convert Mermaid flowchart text into polished diagrams instantly. Preview, style, and export SVG, PNG, JPG, or PDF entirely in the browser with offline-ready support.",
  applicationName: "Mermaid Flow Studio",
  keywords: [
    "Mermaid",
    "flowchart generator",
    "diagram export",
    "offline mermaid editor",
    "Mermaid SVG export",
    "PWA diagram tool"
  ],
  category: "developer tools",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Mermaid Flow Studio",
    title: "Mermaid Flow Studio",
    description:
      "A private, browser-based Mermaid flowchart editor with live preview, presets, and high-quality exports."
  },
  twitter: {
    card: "summary_large_image",
    title: "Mermaid Flow Studio",
    description:
      "Write Mermaid flowchart syntax, refine the visual style, and export production-ready diagrams without leaving the browser."
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.svg", type: "image/svg+xml", sizes: "192x192" }
    ],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }]
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#050816" }
  ],
  colorScheme: "light dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
