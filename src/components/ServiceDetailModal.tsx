import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    titleKey: string;
    descKey: string;
    image: string;
    icon: React.ElementType;
    features: string[];
  } | null;
}

const ServiceDetailModal = ({ isOpen, onClose, service }: ServiceDetailModalProps) => {
  const { t, dir } = useLanguage();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!service) return null;

  const Icon = service.icon;

  // Extended details for each service
  const serviceDetails: Record<string, { benefits: string[]; process: string[]; priceRange: string }> = {
    "services.residential.title": {
      benefits: [
        "Personalized design tailored to your lifestyle",
        "Maximized space utilization",
        "Premium material selection",
        "Increased property value",
        "Stress-free project management",
      ],
      process: [
        "Initial consultation & space assessment",
        "Concept development & mood boards",
        "3D visualization & revisions",
        "Material & furniture selection",
        "Project execution & styling",
      ],
      priceRange: "$15,000 - $150,000+",
    },
    "services.commercial.title": {
      benefits: [
        "Enhanced brand identity through design",
        "Improved employee productivity",
        "Optimized customer experience",
        "Compliance with commercial standards",
        "Flexible & scalable solutions",
      ],
      process: [
        "Brand & business analysis",
        "Space planning & zoning",
        "Design development",
        "Procurement & contractor coordination",
        "Installation & handover",
      ],
      priceRange: "$25,000 - $500,000+",
    },
    "services.color.title": {
      benefits: [
        "Cohesive color palette for entire space",
        "Psychology-based color selection",
        "Enhanced mood & atmosphere",
        "Trendy yet timeless choices",
        "Paint & finish recommendations",
      ],
      process: [
        "Color preference consultation",
        "Light analysis & testing",
        "Palette creation & samples",
        "Digital visualization",
        "Final specification document",
      ],
      priceRange: "$500 - $5,000",
    },
    "services.lighting.title": {
      benefits: [
        "Energy-efficient solutions",
        "Enhanced ambiance & mood",
        "Task-specific illumination",
        "Smart home integration",
        "Architectural highlighting",
      ],
      process: [
        "Lighting needs assessment",
        "Fixture selection & layout",
        "Technical specifications",
        "Installation coordination",
        "Programming & calibration",
      ],
      priceRange: "$2,000 - $50,000+",
    },
    "services.furniture.title": {
      benefits: [
        "Curated pieces for your style",
        "Mix of custom & designer items",
        "Quality & durability assured",
        "Ergonomic considerations",
        "Exclusive vendor access",
      ],
      process: [
        "Style & lifestyle assessment",
        "Furniture plan & selection",
        "Custom piece design",
        "Ordering & logistics",
        "Delivery & placement",
      ],
      priceRange: "$5,000 - $200,000+",
    },
    "services.sustainable.title": {
      benefits: [
        "Reduced environmental footprint",
        "Healthier indoor air quality",
        "Lower energy costs",
        "LEED certification support",
        "Eco-conscious luxury",
      ],
      process: [
        "Sustainability audit",
        "Eco-material sourcing",
        "Energy modeling",
        "Green certification guidance",
        "Ongoing sustainability support",
      ],
      priceRange: "$10,000 - $100,000+",
    },
  };

  const details = serviceDetails[service.titleKey] || serviceDetails["services.residential.title"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/90 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-4 z-50 overflow-hidden rounded-2xl bg-cream md:inset-8 lg:inset-12 lg:inset-x-[15%]"
            dir={dir}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/10 text-charcoal transition-all hover:bg-charcoal hover:text-cream"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-full overflow-y-auto overscroll-contain">
              {/* Hero Section */}
              <div className="relative h-64 md:h-80">
                <img
                  src={service.image}
                  alt={t(service.titleKey)}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold text-charcoal">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="font-display text-3xl font-medium text-cream md:text-4xl">
                    {t(service.titleKey)}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Description */}
                <p className="mb-8 font-body text-lg leading-relaxed text-charcoal-light">
                  {t(service.descKey)}
                </p>

                {/* Features Grid */}
                <div className="mb-8 flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full bg-gold/10 px-4 py-2 font-body text-sm text-charcoal"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Benefits */}
                  <div className="rounded-xl bg-charcoal p-6">
                    <h3 className="mb-4 font-display text-xl text-cream">
                      {t("services.benefits") || "Key Benefits"}
                    </h3>
                    <ul className="space-y-3">
                      {details.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 font-body text-sm text-cream/80">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Process */}
                  <div className="rounded-xl bg-cream-dark p-6">
                    <h3 className="mb-4 font-display text-xl text-charcoal">
                      {t("services.process") || "Our Process"}
                    </h3>
                    <ol className="space-y-3">
                      {details.process.map((step, index) => (
                        <li key={index} className="flex items-start gap-3 font-body text-sm text-charcoal-light">
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold font-medium text-charcoal text-xs">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="mt-8 rounded-xl border-2 border-gold bg-gold/5 p-6 text-center">
                  <p className="mb-2 font-body text-sm text-charcoal-light">
                    {t("services.startingFrom") || "Investment Range"}
                  </p>
                  <p className="mb-4 font-display text-2xl font-medium text-charcoal">
                    {details.priceRange}
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        const contactSection = document.getElementById("contact");
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 300);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-body text-sm font-medium uppercase tracking-wider text-charcoal transition-all hover:bg-gold-light"
                  >
                    {t("nav.bookConsultation")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetailModal;
