import { HeroSection } from "@/components/marketing/sections/HeroSection";
import { FeaturesSection } from "@/components/marketing/sections/FeaturesSection";
import { PricingSection } from "@/components/marketing/sections/PricingSection";
import { TestimonialsSection } from "@/components/marketing/sections/TestimonialsSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      {/* More sections will be added in subsequent milestones */}
    </>
  );
}
