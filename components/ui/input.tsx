import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded border border-rule bg-surface px-3 text-base text-ink placeholder:text-ink-faint",
      "focus-visible:outline-none focus-visible:border-brass focus-visible:ring-2 focus-visible:ring-brass/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full rounded border border-rule bg-surface px-3 py-2 text-base text-ink placeholder:text-ink-faint leading-relaxed",
      "focus-visible:outline-none focus-visible:border-brass focus-visible:ring-2 focus-visible:ring-brass/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-semibold text-ink leading-none",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Input, Textarea, Label };
