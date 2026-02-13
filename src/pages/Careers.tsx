import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, Check, Loader2, Heart, TrendingUp, Timer, Building2, Users, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import AIModal from "@/components/AIModal";
import { careersApi, type CareerPost } from "@/lib/api";

const benefits = [
  { titleKey: "careersPage.benefits.health.title", descKey: "careersPage.benefits.health.desc", icon: Heart },
  { titleKey: "careersPage.benefits.growth.title", descKey: "careersPage.benefits.growth.desc", icon: TrendingUp },
  { titleKey: "careersPage.benefits.flexible.title", descKey: "careersPage.benefits.flexible.desc", icon: Timer },
  { titleKey: "careersPage.benefits.projects.title", descKey: "careersPage.benefits.projects.desc", icon: Building2 },
  { titleKey: "careersPage.benefits.team.title", descKey: "careersPage.benefits.team.desc", icon: Users },
  { titleKey: "careersPage.benefits.bonus.title", descKey: "careersPage.benefits.bonus.desc", icon: Award },
];

const Careers = () => {
  const { t, dir, language } = useLanguage();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [careers, setCareers] = useState<CareerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await careersApi.getActiveCareers();
        setCareers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load careers");
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  // Helper to get localized text from a field that can be string or { en, ar, fr, de }
  const getLocalized = (field: any): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[language] || field.en || Object.values(field)[0] || "";
  };

  // Helper to get localized array
  const getLocalizedArray = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    const arr = field[language] || field.en || Object.values(field)[0];
    return Array.isArray(arr) ? arr : [];
  };

  return (
    <div className="min-h-screen bg-cream" dir={dir}>
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-charcoal pt-20">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
            alt="Careers"
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
            {t("careersPage.subtitle")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-display text-4xl font-medium text-cream md:text-6xl lg:text-7xl"
          >
            {t("careersPage.title1")} <span className="italic text-gold">{t("careersPage.title2")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-body text-lg text-cream/80"
          >
            {t("careersPage.description")}
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-charcoal-light">
              {t("careersPage.whyJoin.subtitle")}
            </p>
            <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
              {t("careersPage.whyJoin.title")}
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group rounded-2xl border border-charcoal/10 bg-white p-8 transition-all hover:border-gold/30 hover:shadow-lg"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 transition-colors group-hover:bg-gold/20">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="mb-3 font-display text-xl text-charcoal">{t(benefit.titleKey)}</h3>
                  <p className="font-body leading-relaxed text-charcoal-light">{t(benefit.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Openings */}
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
              {t("careersPage.openings.subtitle")}
            </p>
            <h2 className="font-display text-3xl font-medium text-cream md:text-4xl">
              {t("careersPage.openings.title")}
            </h2>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="mb-4 font-body text-cream/60">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-gold px-6 py-2 font-body text-sm text-charcoal"
              >
                {t("common.retry") || "Retry"}
              </button>
            </div>
          ) : careers.length === 0 ? (
            <div className="py-20 text-center">
              <Briefcase className="mx-auto mb-4 h-12 w-12 text-cream/30" />
              <p className="font-body text-lg text-cream/60">
                {t("careersPage.noOpenings") || "No open positions at the moment. Check back soon!"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {careers.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-2xl bg-cream"
                >
                  <button
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                        <Briefcase className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl text-charcoal">{getLocalized(job.title)}</h3>
                        <p className="font-body text-sm text-charcoal-light">{getLocalized(job.department)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden items-center gap-4 md:flex">
                        <span className="flex items-center gap-1 font-body text-sm text-charcoal-light">
                          <MapPin className="h-4 w-4" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1 rounded-full bg-olive/10 px-3 py-1 font-body text-xs text-olive capitalize">
                          <Clock className="h-3 w-3" /> {job.job_type}
                        </span>
                      </div>
                      <ArrowRight className={`h-5 w-5 text-charcoal transition-transform ${expandedJob === job.id ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-charcoal/10 p-6"
                    >
                      <p className="mb-6 font-body text-charcoal-light">{getLocalized(job.description)}</p>

                      {getLocalizedArray(job.requirements).length > 0 && (
                        <>
                          <h4 className="mb-4 font-display text-lg text-charcoal">{t("careersPage.requirements")}</h4>
                          <ul className="mb-6 space-y-2">
                            {getLocalizedArray(job.requirements).map((req, i) => (
                              <li key={i} className="flex items-center gap-3 font-body text-charcoal-light">
                                <Check className="h-4 w-4 flex-shrink-0 text-gold" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {getLocalizedArray(job.benefits).length > 0 && (
                        <>
                          <h4 className="mb-4 font-display text-lg text-charcoal">{t("careersPage.benefitsTitle") || "Benefits"}</h4>
                          <ul className="mb-6 space-y-2">
                            {getLocalizedArray(job.benefits).map((ben, i) => (
                              <li key={i} className="flex items-center gap-3 font-body text-charcoal-light">
                                <Check className="h-4 w-4 flex-shrink-0 text-olive" />
                                {ben}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {job.salary && (
                        <p className="mb-6 font-body text-charcoal">
                          <span className="font-medium">{t("careersPage.salary") || "Salary"}:</span>{" "}
                          <span className="text-charcoal-light">{job.salary} $</span>
                        </p>
                      )}

                      <a
                        href={`mailto:${job.application_email || "careers@bedirgroup.com"}?subject=Application for ${getLocalized(job.title)}`}
                        className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-body text-sm font-medium text-charcoal transition-all hover:bg-gold-light"
                      >
                        {t("careersPage.applyNow")}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
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
              {t("careersPage.cta.title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl font-body text-charcoal-light">
              {t("careersPage.cta.desc")}
            </p>
            <a
              href="mailto:careers@bedirgroup.com"
              className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal px-8 py-4 font-body text-sm font-medium uppercase tracking-wider text-charcoal transition-all hover:bg-charcoal hover:text-cream"
            >
              {t("careersPage.sendResume")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </div>
  );
};

export default Careers;
