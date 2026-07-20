import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

const amautaButtonVariants = cva("rounded-xl transition-all duration-200 hover-lift", {
  variants: {
    amautaVariant: {
      default: "",
      accent:
        "bg-amauta-orange text-white hover:bg-amauta-orange-dark shadow-md hover:shadow-lg",
      "accent-ghost":
        "bg-amauta-orange-light/30 text-amauta-orange-dark hover:bg-amauta-orange-light/50",
      success:
        "bg-success text-white hover:bg-success/90",
    },
  },
  defaultVariants: {
    amautaVariant: "default",
  },
})

type AmautaButtonVariant = NonNullable<VariantProps<typeof amautaButtonVariants>["amautaVariant"]>

type ButtonNativeProps = Parameters<typeof Button>[0]

interface AmautaButtonProps extends ButtonNativeProps {
  amautaVariant?: AmautaButtonVariant
}

function AmautaButton({
  className,
  variant,
  size = "default",
  amautaVariant = "default",
  ...props
}: AmautaButtonProps) {
  const shadcnVariant = amautaVariant === "default" ? (variant ?? "default") : "default"

  return (
    <Button
      variant={shadcnVariant}
      size={size}
      className={cn(
        "rounded-xl transition-all duration-200 hover-lift",
        amautaButtonVariants({ amautaVariant }),
        className,
      )}
      {...props}
    />
  )
}

export { AmautaButton, amautaButtonVariants }
export type { AmautaButtonProps, AmautaButtonVariant }
