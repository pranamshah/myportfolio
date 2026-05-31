import PublicNav from "@/components/public/PublicNav";
import HeroSection from "@/components/public/HeroSection";
import ServicesSection from "@/components/public/ServicesSection";
import StatsSection from "@/components/public/StatsSection";
import ProcessSection from "@/components/public/ProcessSection";
import CtaBanner from "@/components/public/CtaBanner";
import PublicFooter from "@/components/public/PublicFooter";
import AnimationProvider from "@/components/public/AnimationProvider";

export default function HomePage() {
  return (
    <div className="bg-surface">
      <AnimationProvider />
      <PublicNav />
      <main>
        <HeroSection />
        <ServicesSection />
        <StatsSection />
        <ProcessSection />
        <CtaBanner />
      </main>
      <PublicFooter />
    </div>
  );
}
