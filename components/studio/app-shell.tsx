import dynamic from "next/dynamic";
import { ArrowRight, Download, Shield, Wand2, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const StudioWorkspace = dynamic(
  () => import("@/components/studio/studio-workspace").then((mod) => mod.StudioWorkspace),
  {
    ssr: false,
    loading: () => (
      <section
        id="studio"
        aria-labelledby="studio-heading"
        className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="surface-card-strong overflow-hidden p-6 sm:p-8">
          <div className="rounded-[26px] border border-[color:var(--border)] bg-white/70 p-6 dark:bg-white/5">
            <h2 id="studio-heading" className="text-3xl font-semibold tracking-tight">
              Mermaid Flow Studio
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted-foreground)] md:text-lg">
              Loading the browser workspace...
            </p>
          </div>
        </div>
      </section>
    )
  }
);

const features = [
  {
    title: "Live Mermaid rendering",
    description: "Write Mermaid flowchart syntax and see the diagram refresh with a debounced browser-side preview."
  },
  {
    title: "Export-ready styling",
    description: "Switch between premium presets, tune spacing, choose a background, and control the export frame."
  },
  {
    title: "Private offline workflow",
    description: "The app shell and runtime assets cache locally so editing and exporting continue after the first load."
  }
];

const steps = [
  "Paste Mermaid flowchart syntax or load a starter template.",
  "Adjust preset, theme, spacing, font, and export framing while the preview updates.",
  "Download SVG, PNG, JPG, or PDF directly from the browser."
];

const benefits = [
  {
    icon: Wand2,
    title: "Polished diagrams fast",
    description: "Use tasteful defaults instead of hand-tuning every Mermaid setting from scratch."
  },
  {
    icon: Download,
    title: "Built for production output",
    description: "Preserve vector fidelity for SVG and scale raster exports for presentations, docs, and print."
  },
  {
    icon: Shield,
    title: "No sign-in, no backend",
    description: "Core editing, rendering, and export flow stay on-device for a straightforward private workflow."
  },
  {
    icon: WifiOff,
    title: "Offline after first visit",
    description: "PWA-style caching keeps the studio usable without a constant network connection."
  }
];

const faqs = [
  {
    question: "What Mermaid syntax is supported?",
    answer:
      "The studio is tuned for Mermaid flowchart syntax first, including common `flowchart`, `graph`, decision, and directional layouts."
  },
  {
    question: "How does offline mode work?",
    answer:
      "A service worker caches the app shell and runtime assets after the first successful load. Once cached, editing, preview, and export continue to work offline."
  },
  {
    question: "Are exports generated on a server?",
    answer:
      "No. SVG generation, rasterization, and PDF creation all happen client-side in the browser."
  },
  {
    question: "Can I share a diagram draft?",
    answer:
      "Yes. The share action copies a URL with encoded local state so another browser can open the same Mermaid source and styling configuration."
  }
];

export function AppShell() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="hero-glow left-4 top-28 opacity-80" />
        <div className="hero-glow right-0 top-8 opacity-70" />
        <div className="mx-auto flex max-w-7xl flex-col gap-14 px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/50 bg-slate-950 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.6)] dark:border-white/10">
                <span className="text-lg font-semibold">MF</span>
              </div>
              <div>
                <p className="text-base font-semibold">Mermaid Flow Studio</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Beautiful Mermaid diagrams, entirely in the browser
                </p>
              </div>
            </div>
            <Button asChild variant="secondary">
              <a href="#studio">
                Launch studio
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </header>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div className="max-w-3xl">
              <Badge className="mb-5 bg-white/70 dark:bg-white/6">
                Offline-ready Mermaid editor and export tool
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Convert Mermaid flowchart text into beautiful diagrams instantly.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
                Paste Mermaid flowchart syntax, preview it live, refine the styling, and export
                SVG, PNG, JPG, or PDF without leaving the browser. No sign-in required.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#studio">
                    Start editing
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href="#how-it-works">See how it works</a>
                </Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "Live browser rendering",
                  "SVG PNG JPG PDF export",
                  "Offline after first load"
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-[color:var(--border)] bg-white/70 px-4 py-3 text-sm font-medium dark:bg-white/5"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card-strong relative overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_40%)]" />
              <div className="relative space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)] dark:border-white/10 dark:bg-white/6">
                  Production-grade output
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-sm text-slate-100 shadow-inner dark:border-white/10">
                  <pre className="overflow-x-auto font-mono leading-7">
                    {`flowchart TD
  A[Paste Mermaid text] --> B[Live preview]
  B --> C{Apply preset?}
  C -->|Yes| D[Beautify output]
  C -->|No| E[Keep defaults]
  D --> F[Export SVG PNG JPG PDF]
  E --> F`}
                  </pre>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-[color:var(--border)] bg-white/72 p-4 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Presets
                    </p>
                    <p className="mt-3 text-base font-semibold">Minimal, Glass, Dark Pro</p>
                  </div>
                  <div className="rounded-[24px] border border-[color:var(--border)] bg-white/72 p-4 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Export
                    </p>
                    <p className="mt-3 text-base font-semibold">Vector + high-res raster + PDF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="surface-card p-6">
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <StudioWorkspace />

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div>
            <Badge>How it works</Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight">
              A focused workflow from Mermaid syntax to polished export
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-[var(--muted-foreground)]">
              Mermaid Flow Studio keeps the writing experience direct while giving you strong
              visual controls where they matter most: preview clarity, spacing, typography, and
              export quality.
            </p>
          </div>
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={step} className="surface-card flex gap-5 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                  0{index + 1}
                </div>
                <p className="text-base leading-7 text-[var(--foreground)]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="surface-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">{benefit.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="surface-card-strong p-6 sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <Badge>FAQ</Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight">
              Common questions about Mermaid Flow Studio
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-[26px] border border-[color:var(--border)] bg-white/72 p-5 dark:bg-white/5">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
