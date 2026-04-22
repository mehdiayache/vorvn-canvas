import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * VORVN Light UI — buttons collapse to underlined arrow-style links.
 * No filled buttons, no rounded corners, no shadow. Variants kept only so
 * shadcn dependencies that import this file keep compiling.
 *
 * Prefer using the `.arrow-link` utility class directly in components.
 */
const buttonVariants = cva(
  "inline-flex items-center gap-2 bg-transparent border-0 p-0 font-sans font-medium text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-0 transition-opacity",
  {
    variants: {
      variant: {
        default: "underline underline-offset-[6px] decoration-foreground decoration-1 hover:opacity-70",
        destructive: "underline underline-offset-[6px] decoration-foreground decoration-1 hover:opacity-70",
        outline: "underline underline-offset-[6px] decoration-foreground decoration-1 hover:opacity-70",
        secondary: "underline underline-offset-[6px] decoration-foreground decoration-1 hover:opacity-70",
        ghost: "hover:opacity-70",
        link: "underline underline-offset-[6px] decoration-foreground decoration-1 hover:opacity-70",
      },
      size: {
        default: "text-[15px] leading-[1.4]",
        sm: "text-[13px] leading-[1.4]",
        lg: "text-[17px] leading-[1.4]",
        icon: "text-[15px] leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
