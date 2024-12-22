import  HeroSection  from './ui/landing/hero-section';
import  FeaturesSection  from './ui/landing/features-section';
import PricingSection from './ui/landing/pricing-section';
import  CTASection  from './ui/landing/cta-section';
import Header from './ui/landing/header';
import TailSection from './ui/landing/tail-section';

export default function Home() {
  return (
    <div className="bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
        <TailSection />
      </main>
    </div>
  );
}
