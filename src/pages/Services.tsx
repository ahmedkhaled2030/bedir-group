import { motion } from "framer-motion";
import { Home, Building2, Palette, Lightbulb, Sofa, TreeDeciduous, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import AIModal from "@/components/AIModal";
import { Link } from "react-router-dom";

const Services = () => {
  const { t, dir } = useLanguage();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const services = [
    {
      icon: Home,
      titleKey: "services.residential.title",
      descKey: "services.residential.desc",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932",
      features: ["servicesPage.residential.f1", "servicesPage.residential.f2", "servicesPage.residential.f3", "servicesPage.residential.f4"],
      priceRange: "$15,000 - $150,000+",
    },
    {
      icon: Building2,
      titleKey: "services.commercial.title",
      descKey: "services.commercial.desc",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
      features: ["servicesPage.commercial.f1", "servicesPage.commercial.f2", "servicesPage.commercial.f3", "servicesPage.commercial.f4"],
      priceRange: "$25,000 - $500,000+",
    },
    {
      icon: Palette,
      titleKey: "services.color.title",
      descKey: "services.color.desc",
      image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2070",
      features: ["servicesPage.color.f1", "servicesPage.color.f2", "servicesPage.color.f3", "servicesPage.color.f4"],
      priceRange: "$500 - $5,000",
    },
    {
      icon: Lightbulb,
      titleKey: "services.lighting.title",
      descKey: "services.lighting.desc",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2070",
      features: ["servicesPage.lighting.f1", "servicesPage.lighting.f2", "servicesPage.lighting.f3", "servicesPage.lighting.f4"],
      priceRange: "$2,000 - $50,000+",
    },
    {
      icon: Sofa,
      titleKey: "services.furniture.title",
      descKey: "services.furniture.desc",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070",
      features: ["servicesPage.furniture.f1", "servicesPage.furniture.f2", "servicesPage.furniture.f3", "servicesPage.furniture.f4"],
      priceRange: "$5,000 - $200,000+",
    },
    {
      icon: TreeDeciduous,
      titleKey: "services.sustainable.title",
      descKey: "services.sustainable.desc",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
      features: ["servicesPage.sustainable.f1", "servicesPage.sustainable.f2", "servicesPage.sustainable.f3", "servicesPage.sustainable.f4"],
      priceRange: "$10,000 - $100,000+",
    },
  ];

  const process = [
    { number: "01", titleKey: "servicesPage.process.step1.title", descKey: "servicesPage.process.step1.desc" },
    { number: "02", titleKey: "servicesPage.process.step2.title", descKey: "servicesPage.process.step2.desc" },
    { number: "03", titleKey: "servicesPage.process.step3.title", descKey: "servicesPage.process.step3.desc" },
    { number: "04", titleKey: "servicesPage.process.step4.title", descKey: "servicesPage.process.step4.desc" },
    { number: "05", titleKey: "servicesPage.process.step5.title", descKey: "servicesPage.process.step5.desc" },
  ];

  return (
    <div className="min-h-screen bg-cream" dir={dir}>
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-charcoal pt-20">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2100"
            alt="Interior Design Services"
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
            {t("servicesPage.subtitle")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-medium text-cream md:text-6xl lg:text-7xl"
          >
            {t("servicesPage.title1")} <span className="italic text-gold">{t("servicesPage.title2")}</span>
          </motion.h1>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={service.titleKey}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className={`grid items-center gap-12 lg:grid-cols-2 ${isEven ? "" : "lg:direction-rtl"}`}
                >
                  <div className={isEven ? "" : "lg:order-2"}>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10">
                      <Icon className="h-7 w-7 text-gold" />
                    </div>
                    <h2 className="mb-4 font-display text-3xl font-medium text-charcoal md:text-4xl">
                      {t(service.titleKey)}
                    </h2>
                    <p className="mb-6 font-body text-charcoal-light leading-relaxed">
                      {t(service.descKey)}
                    </p>
                    <ul className="mb-8 space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 font-body text-charcoal">
                          <Check className="h-5 w-5 text-gold" />
                          {t(feature)}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="font-body text-xs uppercase tracking-wider text-charcoal-light">
                          {t("services.startingFrom")}
                        </p>
                        <p className="font-display text-xl font-medium text-charcoal">{service.priceRange}</p>
                      </div>
                      <Link
                        to="/#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 font-body text-sm text-cream transition-all hover:bg-charcoal/90"
                      >
                        {t("nav.bookConsultation")}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  <div className={isEven ? "" : "lg:order-1"}>
                    <motion.img
                      src={service.image}
                      alt={t(service.titleKey)}
                      className="rounded-2xl shadow-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-charcoal py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-gold">
              {t("servicesPage.process.subtitle")}
            </p>
            <h2 className="font-display text-3xl font-medium text-cream md:text-4xl">
              {t("servicesPage.process.title")}
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-5">
            {process.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold font-display text-xl font-bold text-charcoal">
                  {step.number}
                </div>
                <h3 className="mb-2 font-display text-lg text-cream">{t(step.titleKey)}</h3>
                <p className="font-body text-sm text-cream/70">{t(step.descKey)}</p>
                {index < process.length - 1 && (
                  <div className="absolute left-[60%] top-8 hidden h-0.5 w-[80%] bg-gold/30 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 font-display text-3xl font-medium text-charcoal md:text-4xl">
              {t("servicesPage.cta.title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl font-body text-charcoal-light">
              {t("servicesPage.cta.desc")}
            </p>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-body text-sm font-medium uppercase tracking-wider text-charcoal transition-all hover:bg-gold-light"
            >
              {t("nav.bookConsultation")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
};

export default Services;
