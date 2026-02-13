import { motion } from "framer-motion";
import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import AIModal from "@/components/AIModal";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "testimonials.client1.role",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974",
    quote: "testimonials.client1.quote",
    rating: 5,
    project: "Azure Penthouse",
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    role: "testimonials.client2.role",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974",
    quote: "testimonials.client2.quote",
    rating: 5,
    project: "Royal Residence",
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "testimonials.client3.role",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1974",
    quote: "testimonials.client3.quote",
    rating: 5,
    project: "Luxe Boutique",
  },
  {
    id: 4,
    name: "Michael Chen",
    role: "testimonials.client4.role",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974",
    quote: "testimonials.client4.quote",
    rating: 5,
    project: "Nova Corporate",
  },
  {
    id: 5,
    name: "Fatima Al-Rashid",
    role: "testimonials.client5.role",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1974",
    quote: "testimonials.client5.quote",
    rating: 5,
    project: "Serenity Villa",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "testimonials.client6.role",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974",
    quote: "testimonials.client6.quote",
    rating: 5,
    project: "Meridian Hotel",
  },
];

const Testimonials = () => {
  const { t, dir } = useLanguage();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-cream" dir={dir}>
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-charcoal pt-20">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=2074"
            alt="Testimonials"
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
            {t("testimonialsPage.subtitle")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-medium text-cream md:text-6xl lg:text-7xl"
          >
            {t("testimonialsPage.title1")} <span className="italic text-gold">{t("testimonialsPage.title2")}</span>
          </motion.h1>
        </div>
      </section>

      {/* Featured Testimonial Slider */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-charcoal p-8 md:p-16">
            <Quote className="absolute right-8 top-8 h-24 w-24 text-gold/10" />
            
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid items-center gap-12 lg:grid-cols-2"
            >
              <div className="relative">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="aspect-square rounded-2xl object-cover"
                />
                <div className="absolute -bottom-4 -right-4 rounded-xl bg-gold p-4 shadow-lg">
                  <div className="flex gap-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-charcoal text-charcoal" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <blockquote className="mb-8 font-display text-2xl italic leading-relaxed text-cream md:text-3xl">
                  "{t(testimonials[currentIndex].quote)}"
                </blockquote>
                <div className="mb-8">
                  <p className="font-display text-xl text-cream">{testimonials[currentIndex].name}</p>
                  <p className="font-body text-cream/70">{t(testimonials[currentIndex].role)}</p>
                  <p className="mt-2 font-body text-sm text-gold">
                    {t("testimonialsPage.project")}: {testimonials[currentIndex].project}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={prevSlide}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/30 text-cream transition-all hover:bg-cream hover:text-charcoal"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/30 text-cream transition-all hover:bg-cream hover:text-charcoal"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Dots */}
            <div className="mt-8 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    currentIndex === index ? "w-8 bg-gold" : "bg-cream/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="bg-cream-dark py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center font-display text-3xl font-medium text-charcoal md:text-4xl"
          >
            {t("testimonialsPage.moreStories")}
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-cream p-8 shadow-lg"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mb-6 font-body text-charcoal leading-relaxed">
                  "{t(testimonial.quote)}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-display text-charcoal">{testimonial.name}</p>
                    <p className="font-body text-sm text-charcoal-light">{t(testimonial.role)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
};

export default Testimonials;
