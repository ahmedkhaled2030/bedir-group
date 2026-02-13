import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import AIModal from "@/components/AIModal";

const jobOpenings = [
  {
    id: 1,
    titleKey: "careers.jobs.seniorDesigner.title",
    department: "careers.departments.design",
    location: "Cairo, Egypt",
    type: "careers.types.fullTime",
    descKey: "careers.jobs.seniorDesigner.desc",
    requirements: [
      "careers.jobs.seniorDesigner.req1",
      "careers.jobs.seniorDesigner.req2",
      "careers.jobs.seniorDesigner.req3",
      "careers.jobs.seniorDesigner.req4",
    ],
  },
  {
    id: 2,
    titleKey: "careers.jobs.projectManager.title",
    department: "careers.departments.operations",
    location: "Sheikh Zayed, Egypt",
    type: "careers.types.fullTime",
    descKey: "careers.jobs.projectManager.desc",
    requirements: [
      "careers.jobs.projectManager.req1",
      "careers.jobs.projectManager.req2",
      "careers.jobs.projectManager.req3",
      "careers.jobs.projectManager.req4",
    ],
  },
  {
    id: 3,
    titleKey: "careers.jobs.3dArtist.title",
    department: "careers.departments.visualization",
    location: "Remote",
    type: "careers.types.contract",
    descKey: "careers.jobs.3dArtist.desc",
    requirements: [
      "careers.jobs.3dArtist.req1",
      "careers.jobs.3dArtist.req2",
      "careers.jobs.3dArtist.req3",
      "careers.jobs.3dArtist.req4",
    ],
  },
  {
    id: 4,
    titleKey: "careers.jobs.juniorDesigner.title",
    department: "careers.departments.design",
    location: "Cairo, Egypt",
    type: "careers.types.fullTime",
    descKey: "careers.jobs.juniorDesigner.desc",
    requirements: [
      "careers.jobs.juniorDesigner.req1",
      "careers.jobs.juniorDesigner.req2",
      "careers.jobs.juniorDesigner.req3",
      "careers.jobs.juniorDesigner.req4",
    ],
  },
];

const benefits = [
  { titleKey: "careers.benefits.health.title", descKey: "careers.benefits.health.desc" },
  { titleKey: "careers.benefits.growth.title", descKey: "careers.benefits.growth.desc" },
  { titleKey: "careers.benefits.flexible.title", descKey: "careers.benefits.flexible.desc" },
  { titleKey: "careers.benefits.projects.title", descKey: "careers.benefits.projects.desc" },
  { titleKey: "careers.benefits.team.title", descKey: "careers.benefits.team.desc" },
  { titleKey: "careers.benefits.bonus.title", descKey: "careers.benefits.bonus.desc" },
];

const Careers = () => {
  const { t, dir } = useLanguage();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

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
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-charcoal/5 p-8"
              >
                <h3 className="mb-3 font-display text-xl text-charcoal">{t(benefit.titleKey)}</h3>
                <p className="font-body text-charcoal-light">{t(benefit.descKey)}</p>
              </motion.div>
            ))}
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

          <div className="space-y-4">
            {jobOpenings.map((job, index) => (
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
                      <h3 className="font-display text-xl text-charcoal">{t(job.titleKey)}</h3>
                      <p className="font-body text-sm text-charcoal-light">{t(job.department)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden items-center gap-4 md:flex">
                      <span className="flex items-center gap-1 font-body text-sm text-charcoal-light">
                        <MapPin className="h-4 w-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1 font-body text-sm text-charcoal-light">
                        <Clock className="h-4 w-4" /> {t(job.type)}
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
                    <p className="mb-6 font-body text-charcoal-light">{t(job.descKey)}</p>
                    <h4 className="mb-4 font-display text-lg text-charcoal">{t("careersPage.requirements")}</h4>
                    <ul className="mb-8 space-y-2">
                      {job.requirements.map((req) => (
                        <li key={req} className="flex items-center gap-3 font-body text-charcoal-light">
                          <Check className="h-4 w-4 text-gold" />
                          {t(req)}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`mailto:careers@bedirgroup.com?subject=Application for ${t(job.titleKey)}`}
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
