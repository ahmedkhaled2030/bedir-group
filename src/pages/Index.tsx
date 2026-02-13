import { useState } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AIRevolution from "@/components/AIRevolution";
import ServicesBento from "@/components/ServicesBento";
import FeaturedProjects from "@/components/FeaturedProjects";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AIModal from "@/components/AIModal";

const Index = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />
      
      <main>
        <Hero onOpenAIModal={() => setIsAIModalOpen(true)} />
        <AIRevolution />
        <ServicesBento />
        <FeaturedProjects />
        <ContactSection />
      </main>

      <Footer />

      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
};

export default Index;
