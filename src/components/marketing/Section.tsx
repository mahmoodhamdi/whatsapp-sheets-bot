import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "muted" | "gradient";
}

export function Section({
  children,
  className,
  id,
  background = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        background === "muted" && "bg-muted/50",
        background === "gradient" && "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
        className
      )}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}
