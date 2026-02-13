import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, Cpu, Zap, Sparkles, ExternalLink, LogIn, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loadingSteps = [
  { icon: Brain, text: "Initializing Neural Network..." },
  { icon: Cpu, text: "Loading AI Models..." },
  { icon: Zap, text: "Calibrating Design Engine..." },
  { icon: Sparkles, text: "Ready to Create..." },
];

const AIModal = ({ isOpen, onClose }: AIModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [showLoginNotice, setShowLoginNotice] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setCurrentStep(0);
      setShowLoginNotice(false);

      // Step through loading stages
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 600);

      // Complete loading after 2.5s
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowLoginNotice(true);
        clearInterval(stepInterval);
      }, 2500);

      return () => {
        clearTimeout(timer);
        clearInterval(stepInterval);
      };
    }
  }, [isOpen]);

  const openPlanner5DFullscreen = () => {
    window.open("https://planner5d.com/editor", "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-4 z-50 overflow-hidden rounded-3xl bg-cream shadow-2xl md:inset-8 lg:inset-12"
          >
            {/* Header */}
            <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-border bg-cream/95 px-6 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <motion.div 
                  animate={{ rotate: isLoading ? 360 : 0 }}
                  transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-bronze"
                >
                  <Brain className="h-5 w-5 text-cream" />
                </motion.div>
                <div>
                  <h3 className="font-display text-xl text-charcoal">AI Architect</h3>
                  <p className="font-body text-sm text-charcoal-light">
                    Design your dream space in 3D
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={openPlanner5DFullscreen}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 font-body text-sm font-medium text-charcoal transition-colors hover:bg-gold-light"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Open Full Version</span>
                </motion.button>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/10 text-charcoal transition-colors hover:bg-charcoal/20"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Login Notice Banner */}
            <AnimatePresence>
              {showLoginNotice && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute left-0 right-0 top-[72px] z-10 bg-gradient-to-r from-gold/90 to-bronze/90 px-6 py-3 backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <LogIn className="h-4 w-4 text-charcoal" />
                      <p className="font-body text-sm text-charcoal">
                        <strong>Need to login?</strong> For Google, Apple, or Email login, please use the full version.
                      </p>
                    </div>
                    <button
                      onClick={openPlanner5DFullscreen}
                      className="flex items-center gap-1 rounded-full bg-charcoal px-4 py-1.5 font-body text-xs font-medium text-cream transition-colors hover:bg-charcoal/80"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open in New Tab
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-charcoal via-charcoal to-charcoal-light pt-[72px]"
                >
                  {/* Neural Network Background Animation */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: 0,
                          right: 0,
                        }}
                        animate={{
                          opacity: [0, 0.5, 0],
                          scaleX: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={`v-${i}`}
                        className="absolute w-px bg-gradient-to-b from-transparent via-neon-gold/20 to-transparent"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: 0,
                          bottom: 0,
                        }}
                        animate={{
                          opacity: [0, 0.3, 0],
                          scaleY: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>

                  {/* Glowing Orbs */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute left-1/3 top-1/3 h-64 w-64 rounded-full bg-gold/20 blur-[80px]"
                  />
                  <motion.div
                    animate={{
                      scale: [1.2, 1, 1.2],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-1/3 right-1/3 h-64 w-64 rounded-full bg-neon-gold/20 blur-[80px]"
                  />

                  {/* Loading Content */}
                  <div className="relative text-center">
                    {/* Spinning Ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="relative mx-auto mb-8 h-32 w-32"
                    >
                      <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
                      <div className="absolute inset-0 rounded-full border-t-2 border-gold" />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 rounded-full border-2 border-neon-gold/30"
                      />
                      <div className="absolute inset-4 rounded-full border-r-2 border-neon-gold" />
                      
                      {/* Center Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          key={currentStep}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", damping: 15 }}
                        >
                          {(() => {
                            const Icon = loadingSteps[currentStep].icon;
                            return <Icon className="h-10 w-10 text-gold" />;
                          })()}
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Loading Text */}
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="mb-2 font-display text-2xl text-cream">
                        {loadingSteps[currentStep].text}
                      </p>
                    </motion.div>

                    {/* Progress Dots */}
                    <div className="mt-6 flex justify-center gap-2">
                      {loadingSteps.map((_, index) => (
                        <motion.div
                          key={index}
                          className={`h-2 w-2 rounded-full ${
                            index <= currentStep ? "bg-gold" : "bg-gold/30"
                          }`}
                          animate={
                            index === currentStep
                              ? { scale: [1, 1.3, 1] }
                              : {}
                          }
                          transition={{ duration: 0.5, repeat: index === currentStep ? Infinity : 0 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Iframe Container */}
            {isAuthenticated ? (
              <motion.div 
                className={`h-full ${showLoginNotice && !isLoading ? 'pt-[120px]' : 'pt-[72px]'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <iframe
                  src="https://planner5d.com/editor"
                  title="Planner 5D - AI Architect"
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            ) : (
              /* Auth Gate - Require sign in */
              !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full pt-[72px] flex items-center justify-center bg-gradient-to-br from-charcoal via-charcoal to-charcoal-light"
                >
                  <div className="text-center max-w-md px-6">
                    {/* Lock Icon */}
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 border border-gold/30"
                    >
                      <Lock className="h-10 w-10 text-gold" />
                    </motion.div>

                    <h3 className="font-display text-3xl text-cream mb-3">
                      {t("ai.authRequired")}
                    </h3>
                    <p className="font-body text-cream/60 mb-8 leading-relaxed">
                      {t("ai.authDescription")}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link
                        to="/signin"
                        onClick={onClose}
                        className="flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-body text-sm font-medium text-charcoal hover:bg-gold-light transition-colors"
                      >
                        <LogIn className="h-4 w-4" />
                        {t("auth.signIn")}
                      </Link>
                      <Link
                        to="/signup"
                        onClick={onClose}
                        className="flex items-center gap-2 rounded-full border border-cream/20 px-8 py-3 font-body text-sm font-medium text-cream hover:bg-cream/10 transition-colors"
                      >
                        {t("auth.createAccount")}
                      </Link>
                    </div>

                    {/* Decorative */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute bottom-20 left-1/4 h-48 w-48 rounded-full bg-gold/10 blur-[80px]"
                    />
                  </div>
                </motion.div>
              )
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIModal;
