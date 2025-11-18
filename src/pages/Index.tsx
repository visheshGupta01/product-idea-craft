import { lazy, Suspense } from "react";
import HeroSection from "@/components/landing_page/HeroSection";
import IdeaBox from "@/components/landing_page/IdeaBox";
import Navbar from "@/components/landing_page/Navbar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import FacebookPixel from "@/lib/FacebookPixel";

// Lazy load below-the-fold components
const VisionSection = lazy(() => import("@/components/landing_page/VisionSection"));
const PricingSection = lazy(() => import("@/components/landing_page/PricingSection"));
const FAQSection = lazy(() => import("@/components/landing_page/FAQSection"));
const Footer = lazy(() => import("@/components/landing_page/Footer"));

const Index = () => {
  return (
    <div>
      <FacebookPixel />
      <Navbar />
      <HeroSection />
      <IdeaBox />
      <Suspense fallback={<LoadingSpinner />}>
        <VisionSection />
        <PricingSection />
        <FAQSection />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
