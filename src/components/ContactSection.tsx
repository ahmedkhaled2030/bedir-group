import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import SuccessModal from "./SuccessModal";

const ContactSection = () => {
  const { t, dir } = useLanguage();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    city: "",
    serviceType: "",
    projectType: "",
    budget: "",
    message: "",
  });

  const cities = [
    { key: "city.cairo", value: "Cairo" },
    { key: "city.giza", value: "Giza" },
    { key: "city.sheikhZayed", value: "Sheikh Zayed" },
    { key: "city.october", value: "6th of October" },
    { key: "city.newCairo", value: "New Cairo" },
    { key: "city.other", value: "Other" },
  ];

  const serviceTypes = [
    { key: "serviceType.interiorDesign", value: "Interior Design" },
    { key: "serviceType.consultation", value: "Consultation" },
    { key: "serviceType.costEstimation", value: "Cost Estimation" },
    { key: "serviceType.visualization", value: "3D Visualization" },
    { key: "serviceType.projectManagement", value: "Project Management" },
  ];

  const projectTypes = [
    { key: "projectType.residentialApartment", value: "Residential - Apartment" },
    { key: "projectType.residentialVilla", value: "Residential - Villa" },
    { key: "projectType.commercialOffice", value: "Commercial - Office" },
    { key: "projectType.commercialRetail", value: "Commercial - Retail" },
    { key: "projectType.commercialRestaurant", value: "Commercial - Restaurant" },
    { key: "projectType.other", value: "Other" },
  ];

  const budgetRanges = [
    { key: "budget.under10k", value: "Under $10,000" },
    { key: "budget.10kTo25k", value: "$10,000 - $25,000" },
    { key: "budget.25kTo50k", value: "$25,000 - $50,000" },
    { key: "budget.50kTo100k", value: "$50,000 - $100,000" },
    { key: "budget.over100k", value: "Over $100,000" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSuccessOpen(true);
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      city: "",
      serviceType: "",
      projectType: "",
      budget: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="bg-cream py-24 lg:py-32" dir={dir}>
      <div className="container mx-auto px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="mb-4 font-body text-sm uppercase tracking-[0.3em] text-charcoal-light">
              {t("contact.subtitle")}
            </p>
            <h2 className="mb-6 font-display text-4xl font-medium text-charcoal md:text-5xl">
              {t("contact.title1")} <span className="italic text-gold">{t("contact.title2")}</span>
            </h2>
            <p className="mb-12 font-body text-lg text-charcoal-light">
              {t("contact.description")}
            </p>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Head Office */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="mb-1 font-body font-semibold text-charcoal">
                    {t("contact.headOffice")}
                  </h4>
                  <p className="font-body text-charcoal-light">
                    Mall [7] - Office [1]
                    <br />
                    Beverly Hills, Sheikh Zayed
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="mb-1 font-body font-semibold text-charcoal">
                    {t("contact.address")}
                  </h4>
                  <p className="font-body text-charcoal-light">
                    WEST TOWN MALL, BEVERLY HILLS
                    <br />
                    Second Al Sheikh Zayed
                    <br />
                    Giza Governorate 3240234, Egypt
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="mb-1 font-body font-semibold text-charcoal">
                    {t("contact.phone")}
                  </h4>
                  <p className="font-body text-charcoal-light">
                    <a href="tel:+201061443212" className="hover:text-gold transition-colors">
                      +20 106 144 3212
                    </a>
                    <br />
                    <a href="tel:+19197778222" className="hover:text-gold transition-colors">
                      +1 (919) 777-8222
                    </a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <Mail className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="mb-1 font-body font-semibold text-charcoal">
                    {t("contact.email")}
                  </h4>
                  <a
                    href="mailto:ahmed@bedirgroup.us"
                    className="font-body text-charcoal-light hover:text-gold transition-colors"
                  >
                    ahmed@bedirgroup.us
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: dir === "rtl" ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-xl">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <input
                  type="text"
                  name="fullName"
                  placeholder={`${t("contact.form.fullName")} *`}
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-200 px-4 py-3 font-body text-charcoal placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />

                {/* Phone Number */}
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder={`${t("contact.form.phoneNumber")} *`}
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-200 px-4 py-3 font-body text-charcoal placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder={`${t("contact.form.emailAddress")} *`}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-200 px-4 py-3 font-body text-charcoal placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />

                {/* City */}
                <select
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-200 px-4 py-3 font-body text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="">{t("contact.form.selectCity")} *</option>
                  {cities.map((city) => (
                    <option key={city.value} value={city.value}>
                      {t(city.key)}
                    </option>
                  ))}
                </select>

                {/* Service Type */}
                <select
                  name="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-200 px-4 py-3 font-body text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="">{t("contact.form.serviceType")} *</option>
                  {serviceTypes.map((service) => (
                    <option key={service.value} value={service.value}>
                      {t(service.key)}
                    </option>
                  ))}
                </select>

                {/* Project Type */}
                <select
                  name="projectType"
                  required
                  value={formData.projectType}
                  onChange={handleChange}
                  className="rounded-lg border border-gray-200 px-4 py-3 font-body text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="">{t("contact.form.projectType")} *</option>
                  {projectTypes.map((project) => (
                    <option key={project.value} value={project.value}>
                      {t(project.key)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget - Full Width */}
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="mt-4 w-full rounded-lg border border-gray-200 px-4 py-3 font-body text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="">{t("contact.form.budget")}</option>
                {budgetRanges.map((budget) => (
                  <option key={budget.value} value={budget.value}>
                    {t(budget.key)}
                  </option>
                ))}
              </select>

              {/* Message */}
              <textarea
                name="message"
                placeholder={t("contact.form.message")}
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="mt-4 w-full resize-none rounded-lg border border-gray-200 px-4 py-3 font-body text-charcoal placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="mt-6 w-full rounded-lg bg-charcoal py-4 font-body text-sm font-medium uppercase tracking-wider text-cream transition-all hover:bg-charcoal/90"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {t("contact.form.submit")}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={handleCloseSuccess}
        formData={formData}
      />
    </section>
  );
};

export default ContactSection;
