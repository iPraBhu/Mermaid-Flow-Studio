"use client";

import type { TemplateDefinition } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TemplateGalleryProps {
  templates: TemplateDefinition[];
  onSelectTemplate: (template: TemplateDefinition) => void;
}

export function TemplateGallery({
  templates,
  onSelectTemplate
}: TemplateGalleryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Starter templates</CardTitle>
        <CardDescription>
          Jump into a structure and edit from there instead of starting from scratch.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelectTemplate(template)}
            className={cn(
              "group rounded-[24px] border border-[color:var(--border)] bg-white/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-sky-500/30 hover:bg-white dark:bg-white/5 dark:hover:bg-white/8"
            )}
          >
            <p className="text-sm font-semibold">{template.name}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
              {template.description}
            </p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
