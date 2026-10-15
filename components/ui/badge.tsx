import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-xs font-semibold font-sans",
  {
    variants: {
      variant: {
        neutral: "border-rule bg-paper text-ink-soft",
        ink: "border-ink/20 bg-ink/5 text-ink",
        brass: "border-brass/35 bg-brass-wash text-brass",
        ok: "border-ok/30 bg-ok-wash text-ok",
        due: "border-due/30 bg-due-wash text-due",
      },
    },
    defaultVariants: { variant: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
