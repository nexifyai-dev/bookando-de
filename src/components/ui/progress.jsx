import React from "react";
import { cn } from "../../lib/utils-cn";

const Progress = React.forwardRef(({ className, value = 0, max = 100, size = "md", ...props }, ref) => {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  const heights = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2",
    lg: "h-2.5",
  };

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "w-full overflow-hidden bg-[var(--color-surface-sunken)]",
        "rounded-[var(--radius-full)]",
        heights[size] || heights.md,
        className
      )}
      {...props}
    >
      <div
        className="h-full transition-all duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: `var(--color-primary)`,
          borderRadius: "inherit",
        }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
