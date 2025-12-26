"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface StatsCounterProps {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}

export function StatsCounter({
  value,
  suffix = "",
  label,
  className,
}: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const animateCount = useCallback(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount();
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated, animateCount]);

  return (
    <div ref={ref} className={cn("text-center", className)}>
      <div className="text-4xl md:text-5xl font-bold text-green-600">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-muted-foreground">{label}</div>
    </div>
  );
}
