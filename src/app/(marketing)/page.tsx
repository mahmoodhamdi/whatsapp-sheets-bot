import { HeroSection } from "@/components/marketing/sections/HeroSection";
import { FeaturesSection } from "@/components/marketing/sections/FeaturesSection";
import { PricingSection } from "@/components/marketing/sections/PricingSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      {/* More sections will be added in subsequent milestones */}
    </>
  );
}
