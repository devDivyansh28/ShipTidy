import { LandingNavbar } from "./landing-navbar";
import { HeroSection } from "./hero-section";
import { PRPreviewSection } from "./pr-preview-section";
import { FeaturesSection } from "./features-section";
import { HowItWorksSection } from "./how-it-works-section";
import { PricingSection } from "./pricing-section";
import { FAQSection } from "./faq-section";
import { LandingFooter } from "./landing-footer";

export function LandingPageContent() {
  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col selection:bg-emerald-500/20 selection:text-emerald-300">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <PRPreviewSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
}
