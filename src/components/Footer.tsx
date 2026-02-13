import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, dir } = useLanguage();

  const quickLinks = [
    { key: "footer.aboutUs", href: "/about" },
    { key: "footer.services", href: "/services" },
    { key: "footer.portfolio", href: "/portfolio" },
    { key: "footer.testimonials", href: "/testimonials" },
    { key: "footer.careers", href: "/careers" },
  ];

  const services = [
    { key: "services.residential.title", href: "/services" },
    { key: "services.commercial.title", href: "/services" },
    { key: "services.color.title", href: "/services" },
    { key: "services.lighting.title", href: "/services" },
    { key: "ai.tryNow", href: "/#ai" },
  ];

  return (
    <>
      {/* Google Map Section - Above Footer */}
      <section className="bg-cream-dark py-16 lg:py-24" dir={dir}>
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <p className="mb-3 font-body text-sm uppercase tracking-[0.3em] text-charcoal-light">
              {t("map.subtitle")}
            </p>
            <h2 className="font-display text-3xl font-medium text-charcoal md:text-4xl">
              {t("map.title1")} <span className="italic text-gold">{t("map.title2")}</span>
            </h2>
          </motion.div>

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.3283754890576!2d30.9787!3d30.0459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14585759c0c22b5d%3A0x4e5a0a89c9e8b8e9!2sBeverly%20Hills%2C%20Sheikh%20Zayed%20City%2C%20Giza%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale transition-all duration-500 hover:grayscale-0"
              title="Bedir Group Location - Beverly Hills, Sheikh Zayed"
            />
            
            {/* Overlay with location info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal via-charcoal/90 to-transparent px-6 py-6">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-3 text-cream">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 backdrop-blur-sm">
                    <MapPin className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-sm text-cream/70">{t("contact.headOffice")}</p>
                    <p className="font-body font-medium text-cream">Mall [7] - Office [1], Beverly Hills, Sheikh Zayed</p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/search/Beverly+Hills+Sheikh+Zayed+Egypt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-body text-sm font-medium text-charcoal transition-all hover:bg-gold-light hover:scale-105"
                >
                  {t("map.getDirections")}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-charcoal py-20" dir={dir}>
      <div className="container mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-2xl mb-8 inline-block">
              <img
                src="/banner.png"
                alt="Bedir Group - Where Design Meets Construction"
                className="h-32 md:h-40 lg:h-48 w-auto"
              />
            </div>
            <p className="mb-6 font-body text-cream/60">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-4">
              {[Instagram, Linkedin, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream/70 transition-all hover:bg-gold hover:text-charcoal"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-6 font-body text-sm uppercase tracking-wider text-gold">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                  <li key={link.key}>
                    <Link
                      to={link.href}
                      className="font-body text-cream/60 transition-colors hover:text-cream"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-6 font-body text-sm uppercase tracking-wider text-gold">
              {t("footer.services")}
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.key}>
                  <Link
                    to={service.href}
                    className="font-body text-cream/60 transition-colors hover:text-cream"
                  >
                    {t(service.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="mb-6 font-body text-sm uppercase tracking-wider text-gold">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-gold" />
                <span className="font-body text-cream/60">
                  Mall [7] - Office [1]
                  <br />
                  Beverly Hills, Sheikh Zayed
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-gold" />
                <a
                  href="tel:+201061443212"
                  className="font-body text-cream/60 transition-colors hover:text-cream"
                >
                  +20 106 144 3212
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-gold" />
                <a
                  href="mailto:ahmed@bedirgroup.us"
                  className="font-body text-cream/60 transition-colors hover:text-cream"
                >
                  ahmed@bedirgroup.us
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 md:flex-row"
        >
          <p className="font-body text-sm text-cream/40">
            © {currentYear} Bedir Group. {t("footer.allRightsReserved")}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="font-body text-sm text-cream/40 hover:text-cream/60">
              {t("footer.privacyPolicy")}
            </Link>
            <Link to="/terms-of-service" className="font-body text-sm text-cream/40 hover:text-cream/60">
              {t("footer.termsOfService")}
            </Link>
          </div>
        </motion.div>
      </div>
      </footer>
    </>
  );
};

export default Footer;
