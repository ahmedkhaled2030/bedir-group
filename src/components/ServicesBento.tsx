import { motion } from "framer-motion";
import { Home, Building2, Palette, Lightbulb, Sofa, TreeDeciduous, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ServiceDetailModal from "./ServiceDetailModal";
import CustomSolutionModal from "./CustomSolutionModal";

interface ServiceData {
  icon: typeof Home;
  titleKey: string;
  descKey: string;
  image: string;
  features: string[];
}

const servicesData: ServiceData[] = [
  {
    icon: Home,
    titleKey: "services.residential.title",
    descKey: "services.residential.desc",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932",
    features: ["Custom Layouts", "Material Selection", "3D Visualization"],
  },
  {
    icon: Building2,
    titleKey: "services.commercial.title",
    descKey: "services.commercial.desc",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
    features: ["Office Design", "Retail Spaces", "Hospitality"],
  },
  {
    icon: Palette,
    titleKey: "services.color.title",
    descKey: "services.color.desc",
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2070",
    features: ["Color Psychology", "Mood Boards", "Paint Selection"],
  },
  {
    icon: Lightbulb,
    titleKey: "services.lighting.title",
    descKey: "services.lighting.desc",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070",
    features: ["Ambient Lighting", "Task Lighting", "Smart Controls"],
  },
  {
    icon: Sofa,
    titleKey: "services.furniture.title",
    descKey: "services.furniture.desc",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070",
    features: ["Custom Pieces", "Vintage Finds", "Ergonomic Solutions"],
  },
  {
    icon: TreeDeciduous,
    titleKey: "services.sustainable.title",
    descKey: "services.sustainable.desc",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    features: ["Eco Materials", "Energy Efficiency", "Biophilic Design"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const ServiceCard = ({ service, index, isActive, onHover, t, onLearnMore }: { 
  service: ServiceData; 
  index: number;
  isActive: boolean;
  onHover: (index: number | null) => void;
  t: (key: string) => string;
  onLearnMore: () => void;
}) => {
  const Icon = service.icon;
  
  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="group relative cursor-pointer h-full"
    >
      {/* Card Container */}
      <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 h-full flex flex-col ${
        isActive 
          ? "border-gold/50 bg-charcoal shadow-2xl shadow-gold/10" 
          : "border-cream-dark/30 bg-white hover:border-gold/30 hover:shadow-xl"
      }`}>
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={service.image}
            alt={t(service.titleKey)}
            className="h-full w-full object-cover"
            animate={{ scale: isActive ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <div className={`absolute inset-0 transition-all duration-500 ${
            isActive 
              ? "bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/30" 
              : "bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent"
          }`} />
          
          {/* Floating Icon */}
          <motion.div 
            className={`absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur-md transition-all duration-300 ${
              isActive ? "bg-gold text-charcoal" : "bg-white/20 text-white"
            }`}
            animate={{ rotate: isActive ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="h-6 w-6" />
          </motion.div>

          {/* Index Number */}
          <div className="absolute right-4 top-4">
            <span className={`font-display text-4xl font-bold transition-all duration-300 ${
              isActive ? "text-gold" : "text-white/20"
            }`}>
              0{index + 1}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className={`p-6 transition-all duration-500 flex-1 flex flex-col ${isActive ? "bg-charcoal" : "bg-white"}`}>
          <h3 className={`mb-2 font-display text-xl font-medium transition-colors duration-300 ${
            isActive ? "text-cream" : "text-charcoal"
          }`}>
            {t(service.titleKey)}
          </h3>
          
          <p className={`mb-4 font-body text-sm leading-relaxed transition-colors duration-300 ${
            isActive ? "text-cream/70" : "text-charcoal-light"
          }`}>
            {t(service.descKey)}
          </p>

          {/* Features Tags */}
          <div className="mb-4 flex flex-wrap gap-2 mt-auto">
            {service.features.map((feature, i) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-full px-3 py-1 font-body text-xs transition-all duration-300 ${
                  isActive 
                    ? "bg-gold/20 text-gold-light" 
                    : "bg-cream text-charcoal-light"
                }`}
              >
                {feature}
              </motion.span>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={onLearnMore}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-body text-sm font-medium transition-all duration-300 ${
              isActive 
                ? "bg-gold text-charcoal hover:bg-gold-light" 
                : "bg-cream text-charcoal hover:bg-gold hover:text-charcoal"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("services.learnMore")}
            <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isActive ? "translate-x-1" : ""}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ServicesBento = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const { t, dir } = useLanguage();

  const handleLearnMore = (service: ServiceData) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  return (
    <>
    <section className="bg-cream py-24 lg:py-32" dir={dir} id="services">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2"
          >
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="font-body text-sm uppercase tracking-[0.2em] text-charcoal">
              {t("services.subtitle")}
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-4 font-display text-4xl font-medium text-charcoal md:text-5xl lg:text-6xl"
          >
            {t("services.title1")}{" "}
            <span className="relative">
              <span className="italic text-gold">{t("services.title2")}</span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.path
                  d="M0 4 Q50 0, 100 4 T200 4"
                  fill="none"
                  stroke="#C9A962"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl font-body text-lg text-charcoal-light"
          >
            {t("services.description")}
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {servicesData.map((service, index) => (
            <ServiceCard
              key={service.titleKey}
              service={service}
              index={index}
              isActive={activeIndex === index}
              onHover={setActiveIndex}
              t={t}
              onLearnMore={() => handleLearnMore(service)}
            />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="mb-6 font-body text-charcoal-light">
            {t("services.customCTA")}
          </p>
          <motion.button
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group inline-flex items-center gap-3 rounded-full border-2 border-charcoal bg-transparent px-8 py-4 font-body text-sm font-medium text-charcoal transition-all hover:bg-charcoal hover:text-cream"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t("services.contactUs")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </section>

    {/* Service Detail Modal */}
    <ServiceDetailModal
      isOpen={isDetailModalOpen}
      onClose={() => setIsDetailModalOpen(false)}
      service={selectedService}
    />

    {/* Custom Solution Modal */}
    <CustomSolutionModal
      isOpen={isCustomModalOpen}
      onClose={() => setIsCustomModalOpen(false)}
    />
    </>
  );
};

export default ServicesBento;
