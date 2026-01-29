import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceCards } from "@/components/home/ServiceCards";
import { TrustedBy } from "@/components/home/TrustedBy";
import { Footer } from "@/components/home/Footer";

const Index = () => {
  return (
    <MainLayout>
      <div className="pt-14 lg:pt-0">
        <HeroSection />
        <TrustedBy />
        <ServiceCards />
        <Footer />
      </div>
    </MainLayout>
  );
};

export default Index;
