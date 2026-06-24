import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand text-background hover:bg-brand-strong",
        secondary: "bg-surface-2 text-foreground hover:bg-line border border-line",
        ghost: "text-muted hover:text-foreground hover:bg-surface-2",
        outline: "border border-line text-foreground hover:border-brand hover:text-brand",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
