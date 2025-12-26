import { HeroSection } from "@/components/marketing/sections/HeroSection";
import { FeaturesSection } from "@/components/marketing/sections/FeaturesSection";
import { PricingSection } from "@/components/marketing/sections/PricingSection";
import { TestimonialsSection } from "@/components/marketing/sections/TestimonialsSection";
import { FAQSection } from "@/components/marketing/sections/FAQSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      {/* CTA section will be added in M6 */}
    </>
  );
}
