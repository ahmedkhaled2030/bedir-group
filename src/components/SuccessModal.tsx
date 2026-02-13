import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, User, Phone, Mail, MapPin, Briefcase, DollarSign, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  serviceType: string;
  projectType: string;
  budget: string;
  message: string;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
}

const SuccessModal = ({ isOpen, onClose, formData }: SuccessModalProps) => {
  const { t, dir } = useLanguage();

  const details = [
    { icon: User, label: t("contact.form.fullName"), value: formData.fullName },
    { icon: Phone, label: t("contact.form.phoneNumber"), value: formData.phoneNumber },
    { icon: Mail, label: t("contact.form.emailAddress"), value: formData.email },
    { icon: MapPin, label: t("contact.form.selectCity"), value: formData.city },
    { icon: Briefcase, label: t("contact.form.serviceType"), value: formData.serviceType },
    { icon: Briefcase, label: t("contact.form.projectType"), value: formData.projectType },
    { icon: DollarSign, label: t("contact.form.budget"), value: formData.budget || "-" },
    { icon: MessageSquare, label: t("contact.form.message"), value: formData.message || "-" },
  ];

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
            className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-cream shadow-2xl"
            dir={dir}
          >
            {/* Header with success animation */}
            <div className="relative bg-gradient-to-br from-gold to-gold-light px-6 py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              >
                <CheckCircle className="h-10 w-10 text-charcoal" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-2 font-display text-2xl font-medium text-charcoal"
              >
                {t("success.title")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-body text-sm text-charcoal/80"
              >
                {t("success.message")}
              </motion.p>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-charcoal transition-all hover:bg-white/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Details */}
            <div className="max-h-[40vh] overflow-y-auto overscroll-contain p-6">
              <h3 className="mb-4 font-body text-sm font-semibold uppercase tracking-wider text-charcoal-light">
                {t("success.yourDetails")}
              </h3>
              <div className="space-y-3">
                {details.map((detail, index) => (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3 rounded-lg bg-white p-3"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold/10">
                      <detail.icon className="h-4 w-4 text-gold" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-xs text-charcoal-light">{detail.label}</p>
                      <p className="font-body text-sm font-medium text-charcoal break-words">
                        {detail.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-charcoal/10 p-4">
              <motion.button
                onClick={onClose}
                className="w-full rounded-xl bg-charcoal py-3 font-body text-sm font-medium text-cream transition-all hover:bg-charcoal/90"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {t("success.close")}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
