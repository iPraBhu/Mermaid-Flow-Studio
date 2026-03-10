import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-sky-500 text-white hover:bg-sky-400 shadow-[0_14px_34px_-18px_rgba(14,165,233,0.85)]",
        secondary:
          "border border-[color:var(--border)] bg-white/75 text-[var(--foreground)] hover:bg-white dark:bg-white/5 dark:hover:bg-white/10",
        ghost:
          "text-[var(--foreground)] hover:bg-black/5 dark:hover:bg-white/6",
        outline:
          "border border-[color:var(--border)] bg-transparent text-[var(--foreground)] hover:bg-white/60 dark:hover:bg-white/5",
        subtle:
          "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10 rounded-2xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
