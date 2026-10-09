import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#c8102e] text-white hover:bg-[#a00d24] shadow-md shadow-red-900/15 border border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm border border-transparent",
        outline:
          "border border-slate-200 dark:border-white/10 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-[#c8102e] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-11 rounded-xl px-7 text-sm font-semibold",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
