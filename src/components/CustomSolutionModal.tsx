import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CustomSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomSolutionModal = ({ isOpen, onClose }: CustomSolutionModalProps) => {
  const { t, dir } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      onClose();
    }, 3000);
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
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/90 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-4 z-50 flex items-center justify-center md:inset-8 lg:inset-12"
            dir={dir}
          >
            <div className="relative max-h-full w-full max-w-lg overflow-hidden rounded-2xl bg-cream">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/10 text-charcoal transition-all hover:bg-charcoal hover:text-cream"
              >
                <X className="h-5 w-5" />
              </button>

              {isSubmitted ? (
                // Success State
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
                  >
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </motion.div>
                  <h3 className="mb-2 font-display text-2xl font-medium text-charcoal">
                    {t("ticket.submitted") || "Ticket Submitted!"}
                  </h3>
                  <p className="font-body text-charcoal-light">
                    {t("ticket.response") || "We'll get back to you within 24 hours."}
                  </p>
                </motion.div>
              ) : (
                // Form State
                <div className="overflow-y-auto overscroll-contain p-6 md:p-8">
                  {/* Header */}
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                      <MessageSquare className="h-7 w-7 text-gold" />
                    </div>
                    <h2 className="font-display text-2xl font-medium text-charcoal md:text-3xl">
                      {t("ticket.title") || "Custom Solutions"}
                    </h2>
                    <p className="mt-2 font-body text-sm text-charcoal-light">
                      {t("ticket.subtitle") || "Tell us about your unique project needs"}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-light" />
                      <input
                        type="text"
                        required
                        placeholder={t("contact.form.fullName")}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-charcoal/10 bg-white py-3 pl-12 pr-4 font-body text-charcoal placeholder:text-charcoal-light/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-light" />
                      <input
                        type="email"
                        required
                        placeholder={t("contact.form.emailAddress")}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-charcoal/10 bg-white py-3 pl-12 pr-4 font-body text-charcoal placeholder:text-charcoal-light/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-light" />
                      <input
                        type="tel"
                        placeholder={t("contact.form.phoneNumber")}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-charcoal/10 bg-white py-3 pl-12 pr-4 font-body text-charcoal placeholder:text-charcoal-light/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <input
                        type="text"
                        required
                        placeholder={t("ticket.subject") || "Subject"}
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full rounded-xl border border-charcoal/10 bg-white px-4 py-3 font-body text-charcoal placeholder:text-charcoal-light/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <textarea
                        required
                        rows={4}
                        placeholder={t("ticket.message") || "Describe your project requirements..."}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full resize-none rounded-xl border border-charcoal/10 bg-white px-4 py-3 font-body text-charcoal placeholder:text-charcoal-light/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-4 font-body text-sm font-medium uppercase tracking-wider text-charcoal transition-colors hover:bg-gold-light"
                    >
                      <Send className="h-4 w-4" />
                      {t("ticket.send") || "Send Request"}
                    </motion.button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomSolutionModal;
