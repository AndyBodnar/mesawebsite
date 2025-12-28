import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-[14px] border border-white/10 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-[color,box-shadow,border] outline-none",
        "focus:border-red-500/40 focus:ring-2 focus:ring-red-500/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
