import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { StatsCounter } from "@/components/marketing/StatsCounter";
import { ArrowLeft, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function HeroSection() {
  const t = await getTranslations("landing.hero");
  const tStats = await getTranslations("landing.stats");

  const stats = [
    { value: 1000000, suffix: "+", label: tStats("messages") },
    { value: 500, suffix: "+", label: tStats("businesses") },
    { value: 99.9, suffix: "%", label: tStats("uptime") },
    { value: 98, suffix: "%", label: tStats("satisfaction") },
  ];

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50/50 dark:from-green-950/20 dark:via-background dark:to-green-950/10" />

      {/* Decorative Elements */}
      <div className="absolute top-20 start-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 end-10 w-96 h-96 bg-green-300/20 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-start">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("title")}
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-lg px-8"
                asChild
              >
                <Link href="/register">
                  {t("cta")}
                  <ArrowLeft className="ms-2 h-5 w-5 rtl:rotate-180" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                asChild
              >
                <Link href="#demo">
                  <Play className="me-2 h-5 w-5" />
                  {t("ctaSecondary")}
                </Link>
              </Button>
            </div>

            {/* Trust Badge */}
            <p className="mt-8 text-sm text-muted-foreground">
              {t("trustedBy", { count: "500" })}
            </p>
          </div>

          {/* Product Preview */}
          <div className="relative">
            <div className="relative rounded-2xl shadow-2xl overflow-hidden border bg-card">
              <Image
                src="/images/dashboard-preview.png"
                alt="Dashboard Preview"
                width={800}
                height={533}
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -start-4 bg-green-500 text-white p-3 rounded-xl shadow-lg hidden md:block">
              <span className="text-2xl">💬</span>
            </div>
            <div className="absolute -bottom-4 -end-4 bg-white dark:bg-card p-3 rounded-xl shadow-lg border hidden md:block">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatsCounter
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
