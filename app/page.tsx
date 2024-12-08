import { HeroSection } from "@/app/ui/landing/hero-section";
import { FeaturesSection } from "@/app/ui/landing/features-section";
import { CTASection } from "@/app/ui/landing/cta-section";
import  Header  from "@/app/ui/landing/header";

export default function Home() {
  return (
    <div className="bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}
