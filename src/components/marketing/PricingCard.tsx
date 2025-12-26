import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  popular?: boolean;
  popularLabel?: string;
  className?: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  ctaHref,
  popular = false,
  popularLabel = "Most Popular",
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border bg-card",
        popular && "border-green-500 shadow-lg scale-105",
        className
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            {popularLabel}
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className={cn(
          "w-full",
          popular
            ? "bg-green-600 hover:bg-green-700"
            : "bg-secondary hover:bg-secondary/80"
        )}
        asChild
      >
        <Link href={ctaHref}>{cta}</Link>
      </Button>
    </div>
  );
}
