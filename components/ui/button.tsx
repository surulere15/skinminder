import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-content-primary",
        secondary:
          "bg-secondary text-content-primary shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-content-primary",
        link: "text-primary underline-offset-4 hover:underline",
        clinical: "bg-primary text-primary-foreground shadow-md hover:brightness-110 font-semibold tracking-tight",
        "clinical-ghost": "bg-white/5 border border-white/5 text-content-secondary hover:bg-white/10 hover:text-content-primary font-medium",
        premium: "bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all font-semibold",
        "volumetric-scan": "bg-gradient-to-r from-skin-violet to-skin-glow text-white shadow-lg hover:brightness-110 font-bold",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-full px-3 text-xs",
        lg: "h-14 rounded-full px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
