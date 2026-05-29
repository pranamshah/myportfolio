import PublicNav from "@/components/public/PublicNav";
import HeroSection from "@/components/public/HeroSection";
import ServicesSection from "@/components/public/ServicesSection";
import StatsSection from "@/components/public/StatsSection";
import ProcessSection from "@/components/public/ProcessSection";
import CtaBanner from "@/components/public/CtaBanner";
import ContactSection from "@/components/public/ContactSection";
import PublicFooter from "@/components/public/PublicFooter";

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <main>
        <HeroSection />
        <ServicesSection />
        <StatsSection />
        <ProcessSection />
        <CtaBanner />
        <ContactSection />
      </main>
      <PublicFooter />
    </>
  );
}
