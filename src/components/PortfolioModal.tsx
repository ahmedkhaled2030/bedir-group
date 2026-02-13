import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const allProjects = [
  {
    title: "Azure Penthouse",
    location: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053",
    category: "Residential",
    year: "2026",
  },
  {
    title: "Meridian Hotel",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
    category: "Hospitality",
    year: "2026",
  },
  {
    title: "Nova Corporate",
    location: "New York, USA",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
    category: "Commercial",
    year: "2023",
  },
  {
    title: "Serenity Villa",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071",
    category: "Residential",
    year: "2023",
  },
  {
    title: "Luxe Boutique",
    location: "Paris, France",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    category: "Retail",
    year: "2023",
  },
  {
    title: "Skyline Apartment",
    location: "Cairo, Egypt",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075",
    category: "Residential",
    year: "2026",
  },
  {
    title: "Urban Loft",
    location: "Berlin, Germany",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=2070",
    category: "Residential",
    year: "2022",
  },
  {
    title: "Coastal Restaurant",
    location: "Miami, USA",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070",
    category: "Hospitality",
    year: "2026",
  },
  {
    title: "Executive Office",
    location: "Sheikh Zayed, Egypt",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069",
    category: "Commercial",
    year: "2025",
  },
];

const PortfolioModal = ({ isOpen, onClose }: PortfolioModalProps) => {
  const { t, dir } = useLanguage();

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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-4 z-50 overflow-hidden rounded-2xl bg-cream md:inset-8 lg:inset-12"
            dir={dir}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-4 md:px-8">
              <div>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-charcoal-light">
                  {t("portfolio.ourWork")}
                </p>
                <h2 className="font-display text-2xl font-medium text-charcoal md:text-3xl">
                  {t("portfolio.allProjects").split(" ")[0]} <span className="italic text-gold">{t("portfolio.allProjects").split(" ").slice(1).join(" ")}</span>
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/5 text-charcoal transition-all hover:bg-charcoal hover:text-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Projects Grid */}
            <div className="h-[calc(100%-80px)] overflow-y-auto overscroll-contain p-6 md:p-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {allProjects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden md:h-56">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      
                      {/* Category Badge */}
                      <div className="absolute right-3 top-3 rounded-full bg-cream/90 px-3 py-1 font-body text-xs uppercase tracking-wider text-charcoal backdrop-blur-sm">
                        {project.category}
                      </div>

                      {/* Hover Content */}
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <button className="w-full rounded-lg bg-gold py-2 font-body text-sm font-medium text-charcoal transition-colors hover:bg-gold-light">
                          {t("portfolio.viewDetails")}
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-display text-lg font-medium text-charcoal">
                          {project.title}
                        </h3>
                        <span className="font-body text-xs text-charcoal-light">
                          {project.year}
                        </span>
                      </div>
                      <p className="font-body text-sm text-charcoal-light">
                        {project.location}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-12 rounded-xl bg-charcoal p-8 text-center"
              >
                <h3 className="mb-2 font-display text-2xl text-cream">
                  {t("portfolio.readyToStart")}
                </h3>
                <p className="mb-6 font-body text-cream/70">
                  {t("portfolio.letsDiscuss")}
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
                  {t("portfolio.bookConsultation")}
                  <svg
                    className="h-4 w-4"
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
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PortfolioModal;
