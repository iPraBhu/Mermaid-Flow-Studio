import * as React from "react";
import { cn } from "@/lib/utils";

const baseClassName =
  "flex h-11 w-full rounded-2xl border border-[color:var(--border)] bg-white/70 px-4 py-2 text-sm text-[var(--foreground)] shadow-sm transition placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] dark:bg-white/5";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(baseClassName, className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input, baseClassName as inputClassName };
