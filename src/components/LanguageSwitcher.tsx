import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "ar", name: "العربية", flag: "https://flagcdn.com/w40/eg.png" },
  { code: "fr", name: "Français", flag: "https://flagcdn.com/w40/fr.png" },
  { code: "de", name: "Deutsch", flag: "https://flagcdn.com/w40/de.png" },
];

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

const LanguageSwitcher = ({ isScrolled = false }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full px-3 py-2 font-body text-sm transition-all ${
          isScrolled 
            ? "bg-charcoal/10 text-charcoal hover:bg-charcoal/20" 
            : "bg-cream/10 text-cream hover:bg-cream/20"
        }`}
      >
        <img src={currentLang?.flag} alt={currentLang?.name} className="h-5 w-5 rounded-sm object-cover" />
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-xl bg-white shadow-xl"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left font-body text-sm transition-colors hover:bg-cream ${
                  language === lang.code ? "bg-cream" : ""
                }`}
              >
                <img src={lang.flag} alt={lang.name} className="h-5 w-5 rounded-sm object-cover" />
                <span className="flex-1 text-charcoal">{lang.name}</span>
                {language === lang.code && (
                  <Check className="h-4 w-4 text-gold" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
