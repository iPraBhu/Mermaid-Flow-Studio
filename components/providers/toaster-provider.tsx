"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      toastOptions={{
        classNames: {
          toast:
            "!border-[color:var(--border)] !bg-[var(--surface-strong)] !text-[var(--foreground)] !shadow-[0_18px_48px_-26px_rgba(15,23,42,0.45)]",
          description: "!text-[var(--muted-foreground)]",
          actionButton: "!bg-sky-500 !text-white",
          cancelButton: "!bg-slate-200 !text-slate-900 dark:!bg-slate-800 dark:!text-white"
        }
      }}
    />
  );
}
