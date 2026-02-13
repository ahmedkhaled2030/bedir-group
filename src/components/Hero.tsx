import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroProps {
  onOpenAIModal: () => void;
}

// Staggered text animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const Hero = ({ onOpenAIModal }: HeroProps) => {
  const { t, dir } = useLanguage();

  return (
    <section className="relative h-screen w-full overflow-hidden" dir={dir}>
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          poster="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053"
        >
          <source
            src="/hero-video.mp4"
            type="video/mp4"
          />
        </video>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-charcoal/50 to-charcoal/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Tagline */}
          <motion.p
            variants={fadeUpVariants}
            className="my-10 font-body  text-sm uppercase tracking-[0.3em] text-cream/80"
          >
            {t("hero.tagline")}
          </motion.p>

          {/* Main Headline - Staggered Lines */}
          <div className="mb-8">
            <motion.div variants={lineVariants}>
              <h1 className="font-display text-4xl font-medium leading-[1.3] text-cream md:text-6xl lg:text-7xl md:leading-[1.3] lg:leading-[1.3]">
                {t("hero.headline1")}
              </h1>
            </motion.div>
            <motion.div variants={lineVariants} className="mt-4">
              <h1 className="font-display text-4xl font-medium leading-[1.3] md:text-6xl lg:text-7xl md:leading-[1.3] lg:leading-[1.3]">
                <span className="italic text-gold-light">{t("hero.headline2")}</span>
              </h1>
            </motion.div>
          </div>

          {/* Subtext */}
          <motion.p
            variants={fadeUpVariants}
            className="mx-auto mb-12 max-w-2xl font-body text-lg font-light text-cream/70"
          >
            {t("hero.subtext")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
          >
            <motion.button
              onClick={onOpenAIModal}
              className="btn-luxury group flex items-center gap-3 rounded-full text-base mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" />
              {t("ai.tryNow")}
            </motion.button>
            <motion.button 
              onClick={() => {
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-outline-luxury rounded-full border-cream/50 text-cream mb-6 hover:border-cream hover:bg-cream hover:text-charcoal"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {t("portfolio.viewAll")}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 mt-2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2  mt-2"
          >
            {/* <span className="font-body text-xs uppercase tracking-widest text-cream/50">
              {t("hero.scroll")}
            </span> */}
            {/* <div className="h-12 w-px bg-gradient-to-b from-cream/50 to-transparent" /> */}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
