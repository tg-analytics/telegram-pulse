import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceCards } from "@/components/home/ServiceCards";
import { TrustedBy } from "@/components/home/TrustedBy";
import { AnalyticsShowcase } from "@/components/home/AnalyticsShowcase";
import { Footer } from "@/components/home/Footer";

const Index = () => {
  return (
    <MainLayout>
      <div className="pt-14 lg:pt-0">
        <HeroSection />
        <TrustedBy />
        <AnalyticsShowcase />
        <ServiceCards />
        <Footer />
      </div>
    </MainLayout>
  );
};

export default Index;
