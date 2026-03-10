import type { Metadata } from "next";
import { AppShell } from "@/components/studio/app-shell";

export const metadata: Metadata = {
  title: "Offline Mermaid Flowchart Editor and Export Tool"
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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AppShell />
    </>
  );
}
