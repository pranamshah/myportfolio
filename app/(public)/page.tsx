import { HeroSection } from "@/components/sections/HeroSection";
import { StatsMarquee } from "@/components/sections/StatsMarquee";
import { ServicesStrip } from "@/components/sections/ServicesStrip";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { QuoteCalculator } from "@/components/sections/QuoteCalculator";
import { PartnerLogos } from "@/components/sections/PartnerLogos";
import { Testimonials } from "@/components/sections/Testimonials";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsMarquee />
        <ServicesStrip />
        <HowItWorks />
        <WhyChooseUs />
        <QuoteCalculator />
        <PartnerLogos />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
