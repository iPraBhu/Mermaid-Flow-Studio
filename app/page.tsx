import type { Metadata } from "next";
import { AppShell } from "@/components/studio/app-shell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Offline Mermaid Flowchart Editor and Export Tool",
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does Mermaid Flow Studio work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After the first load, Mermaid Flow Studio caches the app shell and runtime assets so editing, rendering, and exporting continue to work offline."
      }
    },
    {
      "@type": "Question",
      name: "Which export formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can export rendered flow diagrams as SVG, PNG, JPEG, and PDF directly in the browser."
      }
    },
    {
      "@type": "Question",
      name: "Is Mermaid source kept private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Core editing, rendering, and exporting are all performed client-side without a backend dependency."
      }
    }
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: "en-US"
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  url: siteConfig.url,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern browser with JavaScript enabled.",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  description: siteConfig.description,
  featureList: [
    "Live Mermaid flowchart preview",
    "SVG PNG JPG and PDF export",
    "Offline-ready browser workflow",
    "Theme and preset customization"
  ]
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AppShell />
    </>
  );
}
