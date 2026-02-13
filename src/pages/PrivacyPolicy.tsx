import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import AIModal from "@/components/AIModal";

const PrivacyPolicy = () => {
  const { t, dir } = useLanguage();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const sections = [
    {
      titleKey: "privacy.section1.title",
      contentKey: "privacy.section1.content",
    },
    {
      titleKey: "privacy.section2.title",
      contentKey: "privacy.section2.content",
    },
    {
      titleKey: "privacy.section3.title",
      contentKey: "privacy.section3.content",
    },
    {
      titleKey: "privacy.section4.title",
      contentKey: "privacy.section4.content",
    },
    {
      titleKey: "privacy.section5.title",
      contentKey: "privacy.section5.content",
    },
    {
      titleKey: "privacy.section6.title",
      contentKey: "privacy.section6.content",
    },
    {
      titleKey: "privacy.section7.title",
      contentKey: "privacy.section7.content",
    },
  ];

  return (
    <div className="min-h-screen bg-cream" dir={dir}>
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />

      {/* Hero Section */}
      <section className="bg-charcoal pt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl font-medium text-cream md:text-5xl"
          >
            {t("privacy.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-body text-cream/70"
          >
            {t("privacy.lastUpdated")}: January 1, 2025
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 font-body text-lg text-charcoal-light leading-relaxed"
            >
              {t("privacy.intro")}
            </motion.p>

            {sections.map((section, index) => (
              <motion.div
                key={section.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <h2 className="mb-4 font-display text-2xl font-medium text-charcoal">
                  {t(section.titleKey)}
                </h2>
                <p className="font-body text-charcoal-light leading-relaxed whitespace-pre-line">
                  {t(section.contentKey)}
                </p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-16 rounded-2xl bg-charcoal/5 p-8"
            >
              <h3 className="mb-4 font-display text-xl text-charcoal">{t("privacy.contact.title")}</h3>
              <p className="mb-4 font-body text-charcoal-light">{t("privacy.contact.desc")}</p>
              <a
                href="mailto:privacy@bedirgroup.com"
                className="font-body text-gold hover:underline"
              >
                privacy@bedirgroup.com
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
};

export default PrivacyPolicy;
