
import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "none" | "light" | "medium" | "heavy";
  border?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const intensityMap = {
  none: "bg-background/0 backdrop-blur-none",
  light: "bg-background/30 backdrop-blur-sm",
  medium: "bg-background/50 backdrop-blur-md",
  heavy: "bg-background/70 backdrop-blur-lg",
};

export const GlassContainer = React.forwardRef<HTMLDivElement, GlassContainerProps>(
  ({ intensity = "medium", border = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          intensityMap[intensity],
          border && "border border-border/30",
          "rounded-lg shadow-sm transition-all duration-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassContainer.displayName = "GlassContainer";
