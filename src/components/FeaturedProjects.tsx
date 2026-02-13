import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import PortfolioModal from "./PortfolioModal";
import { useLanguage } from "@/contexts/LanguageContext";

const projects = [
  {
    title: "Azure Penthouse",
    location: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053",
    category: "Residential",
  },
  {
    title: "Meridian Hotel",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
    category: "Hospitality",
  },
  {
    title: "Nova Corporate",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
    category: "Commercial",
  },
  {
    title: "Serenity Villa",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071",
    category: "Residential",
  },
  {
    title: "Luxe Boutique",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    category: "Retail",
  },
];

const FeaturedProjects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const { t, dir } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section ref={containerRef} className="overflow-hidden bg-cream-dark py-32" dir={dir}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-charcoal-light">
              {t("portfolio.subtitle")}
            </p>
            <h2 className="font-display text-4xl font-medium text-charcoal md:text-5xl lg:text-6xl">
              {t("portfolio.title1")} <span className="italic text-gold">{t("portfolio.title2")}</span>
            </h2>
          </div>
          <motion.button 
            className="group inline-flex items-center gap-3 rounded-full border-2 border-charcoal bg-transparent px-8 py-4 font-body text-sm font-medium uppercase tracking-wider text-charcoal transition-all hover:bg-charcoal hover:text-cream"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const servicesSection = document.getElementById('services');
              if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {t("portfolio.viewAll")}
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Horizontal Scroll Carousel */}
      <motion.div style={{ x }} className="flex gap-8 pl-6 md:pl-[calc((100vw-1400px)/2+1.5rem)]">
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative h-[500px] w-[400px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl md:h-[600px] md:w-[500px]"
          >
            {/* Image */}
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />

            {/* Category Badge */}
            <div className="absolute right-6 top-6 rounded-full bg-cream/90 px-4 py-1 font-body text-xs uppercase tracking-wider text-charcoal backdrop-blur-sm">
              {project.category}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="mb-2 font-display text-3xl text-cream md:text-4xl">
                  {project.title}
                </h3>
                <p className="font-body text-cream/70">{project.location}</p>
              </motion.div>

              {/* View Button */}
              <motion.div
                className="mt-6 flex items-center gap-2 text-gold-light"
                initial={{ opacity: 0 }}
                whileHover={{ x: 10 }}
              >
                <span className="font-body text-sm uppercase tracking-wider opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {t("portfolio.viewProject")}
                </span>
                <svg
                  className="h-5 w-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Portfolio Modal */}
      <PortfolioModal isOpen={isPortfolioOpen} onClose={() => setIsPortfolioOpen(false)} />
    </section>
  );
};

export default FeaturedProjects;
