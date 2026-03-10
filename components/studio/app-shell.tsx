"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Download, Shield, WifiOff } from "lucide-react";
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
        <div className="editorial-panel overflow-hidden p-6 sm:p-8">
          <div className="rounded-[28px] border border-[color:var(--border)] bg-white/60 p-6 dark:bg-white/4">
            <h2 id="studio-heading" className="text-3xl font-semibold tracking-tight">
              Mermaid Flow Studio
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">
              Loading the workspace and local rendering engine.
            </p>
          </div>
        </div>
      </section>
    )
  }
);

const essentials = [
  {
    icon: ArrowRight,
    title: "Write and preview",
    description: "Edit Mermaid flowchart syntax and see the diagram update in-browser."
  },
  {
    icon: Download,
    title: "Export directly",
    description: "Download SVG, PNG, JPEG, or PDF from the same workspace."
  },
  {
    icon: Shield,
    title: "Stay private",
    description: "Core editing and rendering stay on-device with no backend dependency."
  },
  {
    icon: WifiOff,
    title: "Keep working offline",
    description: "After the first load, the app remains usable without a connection."
  }
] as const;

export function AppShell() {
  return (
    <main className="pb-12">
      <section className="relative overflow-hidden">
        <div className="hero-glow left-4 top-24 opacity-90" />
        <div className="hero-glow right-0 top-10 opacity-70" />
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-18 lg:pt-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="ink-panel flex h-14 w-14 items-center justify-center text-white shadow-[0_20px_48px_-28px_rgba(15,23,42,0.7)]">
                <div className="grid gap-1">
                  <span className="h-2 w-2 rounded-full bg-sky-300" />
                  <span className="ml-4 h-2 w-2 rounded-full bg-orange-300" />
                  <span className="h-2 w-6 rounded-full bg-white/70" />
                </div>
              </div>
              <div>
                <p className="text-base font-semibold tracking-tight">Mermaid Flow Studio</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Cleaner Mermaid diagrams, faster
                </p>
              </div>
            </div>
            <Button asChild variant="secondary">
              <a href="#studio">
                Open studio
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
            <div className="max-w-3xl">
              <Badge className="bg-white/60 uppercase tracking-[0.24em] dark:bg-white/6">
                Offline Mermaid flowchart editor
              </Badge>
              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Build the diagram. Skip the clutter.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)] sm:text-xl">
                Write Mermaid flowchart syntax, refine the styling, and export production-ready
                diagrams from one focused browser workspace.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a href="#studio">
                    Start editing
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="editorial-panel overflow-hidden p-4 sm:p-5">
              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-[24px] border border-[color:var(--border)] bg-white/55 px-4 py-3 text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)] dark:bg-white/4">
                  <span>Workflow</span>
                  <span>Source to export</span>
                </div>
                <div className="ink-panel float-slow overflow-hidden p-5 text-slate-100">
                  <pre className="overflow-x-auto font-mono text-sm leading-7 text-slate-100">
                    {`flowchart TD
  Draft[Write Mermaid] --> Preview[Live preview]
  Preview --> Polish[Adjust style]
  Polish --> Export[Download output]`}
                  </pre>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["SVG PNG JPEG PDF", "Local + offline"].map((item) => (
                    <div
                      key={item}
                      className="rounded-[24px] border border-[color:var(--border)] bg-white/62 px-4 py-4 text-sm font-medium dark:bg-white/4"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="editorial-panel overflow-hidden">
            <div className="grid gap-px bg-[color:var(--border)] md:grid-cols-2 xl:grid-cols-4">
              {essentials.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="bg-white/65 p-5 dark:bg-slate-950/60">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-white/65 dark:bg-white/4">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <StudioWorkspace />
    </main>
  );
}
