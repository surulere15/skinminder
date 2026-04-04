import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-skin-violet/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-skin-violet text-white shadow-lg shadow-skin-violet/20 hover:brightness-105",
        destructive:
          "bg-skin-rose text-white shadow-lg shadow-skin-rose/20 hover:brightness-105",
        outline:
          "glass-ghost text-skin-dark",
        secondary:
          "bg-white/50 text-skin-dark glass-hover",
        ghost: "hover:bg-white/30 text-skin-dark",
        link: "text-skin-violet underline-offset-4 hover:underline",
        clinical: "bg-skin-violet text-white shadow-lg shadow-skin-violet/20 hover:brightness-105 font-semibold",
        "clinical-ghost": "glass-ghost text-skin-muted hover:text-skin-dark",
        premium: "bg-skin-violet text-white shadow-xl shadow-skin-violet/25 hover:brightness-105 active:scale-[0.98] transition-all font-semibold",
        "volumetric-scan": "bg-gradient-to-r from-skin-violet to-skin-glow text-white shadow-lg shadow-skin-violet/20 hover:brightness-110 font-bold",
        "glass": "glass-float text-skin-dark hover:bg-white/90",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 rounded-xl px-4 text-xs",
        lg: "h-14 rounded-2xl px-10 text-base",
        icon: "h-12 w-12 rounded-2xl",
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
