import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

function Filter({
  label,
  children,
  className,
}: ComponentProps<"div"> & {
  label: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      {children}
    </div>
  );
}

export default Filter;
