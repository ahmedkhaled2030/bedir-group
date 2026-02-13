import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import AIModal from "@/components/AIModal";

const projects = [
  {
    id: 1,
    title: "Azure Penthouse",
    location: "Dubai, UAE",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053",
    description: "A luxurious penthouse with panoramic city views featuring modern minimalist design with warm accents.",
    year: "2026",
    area: "450 m²",
  },
  {
    id: 2,
    title: "Meridian Hotel",
    location: "London, UK",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
    description: "A boutique hotel renovation blending British heritage with contemporary luxury.",
    year: "2023",
    area: "3,200 m²",
  },
  {
    id: 3,
    title: "Nova Corporate",
    location: "New York, USA",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
    description: "Modern corporate headquarters designed to foster collaboration and creativity.",
    year: "2026",
    area: "2,800 m²",
  },
  {
    id: 4,
    title: "Serenity Villa",
    location: "Santorini, Greece",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071",
    description: "Mediterranean villa with infinity pool overlooking the Aegean Sea.",
    year: "2023",
    area: "380 m²",
  },
  {
    id: 5,
    title: "Luxe Boutique",
    location: "Paris, France",
    category: "Retail",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    description: "High-end fashion boutique with an immersive shopping experience.",
    year: "2026",
    area: "320 m²",
  },
  {
    id: 6,
    title: "Zen Wellness Center",
    location: "Tokyo, Japan",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070",
    description: "A tranquil wellness center combining traditional Japanese aesthetics with modern amenities.",
    year: "2023",
    area: "1,200 m²",
  },
  {
    id: 7,
    title: "Royal Residence",
    location: "Cairo, Egypt",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070",
    description: "Grand family residence featuring Egyptian-inspired contemporary design.",
    year: "2026",
    area: "850 m²",
  },
  {
    id: 8,
    title: "Artisan Restaurant",
    location: "Milan, Italy",
    category: "Hospitality",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070",
    description: "Award-winning restaurant interior celebrating Italian craftsmanship.",
    year: "2023",
    area: "280 m²",
  },
];

const categories = ["All", "Residential", "Commercial", "Hospitality", "Retail"];

const Portfolio = () => {
  const { t, dir } = useLanguage();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-cream" dir={dir}>
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-charcoal pt-20">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070"
            alt="Portfolio"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-gold"
          >
            {t("portfolio.ourWork")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-medium text-cream md:text-6xl lg:text-7xl"
          >
            {t("portfolio.title1")} <span className="italic text-gold">{t("portfolio.title2")}</span>
          </motion.h1>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-16 z-30 bg-cream/80 py-6 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 font-body text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-charcoal text-cream"
                    : "bg-charcoal/10 text-charcoal hover:bg-charcoal/20"
                }`}
              >
                {category === "All" ? t("portfolio.allProjects") : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            layout
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="mb-2 inline-block rounded-full bg-gold/90 px-3 py-1 font-body text-xs text-charcoal">
                      {project.category}
                    </span>
                    <h3 className="font-display text-2xl text-cream">{project.title}</h3>
                    <p className="font-body text-cream/70">{project.location}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-xl text-charcoal">{project.title}</h3>
                  <p className="font-body text-sm text-charcoal-light">{project.location}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-cream"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/10 text-charcoal transition-all hover:bg-charcoal hover:text-cream"
            >
              ✕
            </button>
            <div className="grid md:grid-cols-2">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="h-64 w-full object-cover md:h-full"
              />
              <div className="p-8">
                <span className="mb-4 inline-block rounded-full bg-gold/20 px-3 py-1 font-body text-xs text-charcoal">
                  {selectedProject.category}
                </span>
                <h2 className="mb-2 font-display text-3xl text-charcoal">{selectedProject.title}</h2>
                <p className="mb-6 font-body text-charcoal-light">{selectedProject.location}</p>
                <p className="mb-8 font-body text-charcoal leading-relaxed">{selectedProject.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-charcoal/5 p-4">
                    <p className="font-body text-xs uppercase tracking-wider text-charcoal-light">{t("portfolioPage.year")}</p>
                    <p className="font-display text-xl text-charcoal">{selectedProject.year}</p>
                  </div>
                  <div className="rounded-xl bg-charcoal/5 p-4">
                    <p className="font-body text-xs uppercase tracking-wider text-charcoal-light">{t("portfolioPage.area")}</p>
                    <p className="font-display text-xl text-charcoal">{selectedProject.area}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
};

export default Portfolio;
