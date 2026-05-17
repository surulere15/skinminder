import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[1.25rem] text-[11px] font-black uppercase tracking-[0.15em] italic transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-black shadow-lg shadow-primary/10 hover:brightness-110 hover:shadow-glow",
        destructive:
          "bg-red-500/80 text-white shadow-lg shadow-red-500/20 hover:bg-red-500",
        outline:
          "bg-white/[0.05] border border-white/10 text-white/70 hover:bg-white/10 hover:text-white",
        secondary:
          "bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white",
        ghost: "hover:bg-white/10 text-white/40 hover:text-white/80",
        link: "text-primary underline-offset-4 hover:underline",
        clinical: "clinical-btn",
        "clinical-ghost": "clinical-btn-ghost",
        premium: "bg-primary text-black shadow-elite hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        "volumetric-scan": "bg-gradient-to-r from-primary via-primary/80 to-primary text-black shadow-glow font-black",
        flagship: "bg-primary text-black shadow-glow hover:scale-[1.02] active:scale-[0.98] rounded-full px-12",
        "glass": "glass-master text-white hover:bg-white/10",
      },
      size: {
        default: "h-13 px-8 py-3",
        sm: "h-10 rounded-xl px-5 text-[10px]",
        lg: "h-16 rounded-[1.5rem] px-12 text-sm",
        icon: "h-13 w-13 rounded-2xl",
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
