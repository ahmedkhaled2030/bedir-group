import { motion } from "framer-motion";
import { Award, Users, Clock, Target, Heart, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import AIModal from "@/components/AIModal";

const About = () => {
  const { t, dir } = useLanguage();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const stats = [
    { value: "15+", labelKey: "about.stats.years" },
    { value: "500+", labelKey: "about.stats.projects" },
    { value: "50+", labelKey: "about.stats.awards" },
    { value: "98%", labelKey: "about.stats.satisfaction" },
  ];

  const values = [
    { icon: Heart, titleKey: "about.values.passion.title", descKey: "about.values.passion.desc" },
    { icon: Lightbulb, titleKey: "about.values.innovation.title", descKey: "about.values.innovation.desc" },
    { icon: Target, titleKey: "about.values.excellence.title", descKey: "about.values.excellence.desc" },
    { icon: Users, titleKey: "about.values.collaboration.title", descKey: "about.values.collaboration.desc" },
  ];

  const team = [
    {
      name: "Ahmed Bedir",
      role: "about.team.founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974",
    },
    {
      name: "Sarah Hassan",
      role: "about.team.designDirector",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974",
    },
    {
      name: "Omar Khalil",
      role: "about.team.projectManager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974",
    },
    {
      name: "Hana El-Sayed",
      role: "about.team.seniorDesigner",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1974",
    },
  ];

  return (
    <div className="min-h-screen bg-cream" dir={dir}>
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-charcoal pt-20">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053"
            alt="Interior Design"
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
            {t("about.subtitle")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-medium text-cream md:text-6xl lg:text-7xl"
          >
            {t("about.title1")} <span className="italic text-gold">{t("about.title2")}</span>
          </motion.h1>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gold py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="font-display text-4xl font-bold text-charcoal md:text-5xl">{stat.value}</p>
                <p className="mt-2 font-body text-sm text-charcoal/80">{t(stat.labelKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-charcoal-light">
                {t("about.story.subtitle")}
              </p>
              <h2 className="mb-6 font-display text-3xl font-medium text-charcoal md:text-4xl">
                {t("about.story.title")}
              </h2>
              <div className="space-y-4 font-body text-charcoal-light leading-relaxed">
                <p>{t("about.story.p1")}</p>
                <p>{t("about.story.p2")}</p>
                <p>{t("about.story.p3")}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070"
                alt="Our Story"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-gold p-6 shadow-lg md:-bottom-8 md:-left-8">
                <Award className="h-8 w-8 text-charcoal" />
                <p className="mt-2 font-display text-2xl font-bold text-charcoal">2008</p>
                <p className="font-body text-sm text-charcoal/80">{t("about.founded")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              {t("about.values.subtitle")}
            </p>
            <h2 className="font-display text-3xl font-medium text-cream md:text-4xl">
              {t("about.values.title")}
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.titleKey}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl bg-cream/5 p-8 text-center backdrop-blur-sm"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20">
                    <Icon className="h-7 w-7 text-gold" />
                  </div>
                  <h3 className="mb-3 font-display text-xl text-cream">{t(value.titleKey)}</h3>
                  <p className="font-body text-sm text-cream/70">{t(value.descKey)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              {t("about.team.subtitle")}
            </p>
            <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
              {t("about.team.title")}
            </h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h3 className="font-display text-xl text-charcoal">{member.name}</h3>
                <p className="font-body text-sm text-charcoal-light">{t(member.role)}</p>
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

export default About;
