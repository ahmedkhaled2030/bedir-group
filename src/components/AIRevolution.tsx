import { motion } from "framer-motion";
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from "react-compare-slider";
import { useLanguage } from "@/contexts/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const AIRevolution = () => {
  const { t, dir } = useLanguage();
  const features = [
    t("ai.feature1"),
    t("ai.feature2"),
    t("ai.feature3"),
    t("ai.feature4"),
  ];

  return (
    <section className="relative overflow-hidden bg-charcoal py-32" dir={dir}>
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gold/10 blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-neon-gold/5 blur-[100px]" 
        />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              variants={itemVariants}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon-gold/30 bg-neon-gold/10 px-4 py-2"
            >
              <motion.span 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-neon-gold" 
              />
              <span className="font-body text-sm text-neon-gold">{t("ai.powered")}</span>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="mb-6 font-display text-4xl font-medium text-cream md:text-5xl lg:text-6xl"
            >
              {t("ai.title1")}{" "}
              <span className="neon-glow text-neon-gold">{t("ai.title2")}</span>
              <br />
              {t("ai.title3")}
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="mb-8 max-w-lg font-body text-lg font-light leading-relaxed text-cream/70"
            >
              {t("ai.description")}
            </motion.p>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3 font-body text-cream/80"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20">
                    <motion.span 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      viewport={{ once: true }}
                      className="h-2 w-2 rounded-full bg-gold" 
                    />
                  </span>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right - Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="neon-border overflow-hidden rounded-2xl">
              <ReactCompareSlider
                itemOne={
                  <ReactCompareSliderImage
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1931"
                    alt="2D Floor Plan"
                    style={{ objectFit: "cover" }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974"
                    alt="3D Render"
                    style={{ objectFit: "cover" }}
                  />
                }
                handle={
                  <ReactCompareSliderHandle
                    buttonStyle={{
                      backdropFilter: "blur(8px)",
                      background: "hsl(45 100% 60%)",
                      border: "2px solid hsl(45 100% 60%)",
                      color: "#1C1917",
                      boxShadow: "0 0 20px hsl(45 100% 60% / 0.5)",
                    }}
                    linesStyle={{
                      background: "hsl(45 100% 60%)",
                      width: 3,
                    }}
                  />
                }
                position={50}
                className="aspect-[4/3]"
              />
            </div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 z-10 rounded-full bg-charcoal/80 px-3 py-1 font-body text-xs uppercase tracking-wider text-cream backdrop-blur-sm">
              {t("ai.2dPlan")}
            </div>
            <div className="absolute bottom-4 right-4 z-10 rounded-full bg-charcoal/80 px-3 py-1 font-body text-xs uppercase tracking-wider text-neon-gold backdrop-blur-sm">
              {t("ai.3dRender")}
            </div>

            {/* Instruction */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-4 text-center font-body text-sm text-cream/50"
            >
              {t("ai.dragCompare")}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIRevolution;
