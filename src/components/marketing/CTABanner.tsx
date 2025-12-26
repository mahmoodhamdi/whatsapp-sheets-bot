import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTABannerProps {
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function CTABanner({
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
}: CTABannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-green-700 p-8 md:p-12 text-white",
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-green-100 text-lg mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-green-700 hover:bg-green-50"
            asChild
          >
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>

          {secondaryCta && (
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
