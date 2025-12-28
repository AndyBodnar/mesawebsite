import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-[14px] border border-white/10 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-[color,box-shadow,border] outline-none",
        "focus:border-red-500/40 focus:ring-2 focus:ring-red-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
