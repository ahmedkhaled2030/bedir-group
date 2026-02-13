import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "EN", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "ar", name: "عربي", flag: "https://flagcdn.com/w40/eg.png" },
  { code: "fr", name: "FR", flag: "https://flagcdn.com/w40/fr.png" },
  { code: "de", name: "DE", flag: "https://flagcdn.com/w40/de.png" },
];

interface NavbarProps {
  onOpenAIModal: () => void;
}

const Navbar = ({ onOpenAIModal }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t, dir, language, setLanguage } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { key: "nav.about", href: "/about" },
    { key: "nav.services", href: "/services" },
    { key: "nav.portfolio", href: "/portfolio" },
    { key: "nav.blog", href: "/blog" },
    { key: "nav.contact", href: "/#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a hash link for contact section
    if (href === "/#contact") {
      e.preventDefault();
      if (location.pathname === "/") {
        // Already on home page, just scroll
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to home page then scroll
        navigate("/");
        setTimeout(() => {
          const contactSection = document.getElementById("contact");
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`fixed left-0 right-0 top-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-white/70 py-3 shadow-lg backdrop-blur-xl border-b border-white/20"
          : "bg-transparent py-4 md:py-6"
      }`}
      dir={dir}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={isScrolled ? "/logo-dark.png" : "/logo-light.png"}
            alt="Bedir Group"
            className="h-16 md:h-20 lg:h-24 w-auto transition-all duration-300 drop-shadow-md"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`font-body text-sm uppercase tracking-wider transition-colors hover:text-gold ${
                isScrolled ? "text-charcoal" : "text-cream"
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Right Section - Language & CTA */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Switcher - Desktop/Tablet */}
          <div className="hidden md:block">
            <LanguageSwitcher isScrolled={isScrolled} />
          </div>

          {/* CTA Button - Desktop */}
          <button
            onClick={onOpenAIModal}
            className={`hidden lg:block rounded-full px-6 py-2 font-body text-sm uppercase tracking-wider transition-all ${
              isScrolled
                ? "bg-charcoal text-cream hover:bg-charcoal/90"
                : "bg-cream/20 text-cream backdrop-blur-sm hover:bg-cream/30"
            }`}
          >
            {t("hero.tryAI")}
          </button>

          {/* Auth Section - Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 font-body text-xs uppercase tracking-wider transition-all ${
                    isScrolled
                      ? "text-charcoal hover:bg-charcoal/10"
                      : "text-cream hover:bg-cream/10"
                  }`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    isScrolled ? "bg-charcoal/10" : "bg-cream/20"
                  }`}>
                    <User className="h-3.5 w-3.5" />
                  </div>
                  {user?.name?.split(" ")[0]}
                  <svg
                    className={`h-3 w-3 transition-transform duration-200 ${
                      isUserDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xl"
                  >
                    {/* User info */}
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="font-body text-sm font-medium text-charcoal truncate">
                        {user?.name}
                      </p>
                      <p className="font-body text-xs text-charcoal-light truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-charcoal hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-charcoal-light" />
                          {t("admin.dashboard")}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                          navigate("/");
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 font-body text-sm text-charcoal hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-charcoal-light" />
                        {t("admin.logout")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 font-body text-xs uppercase tracking-wider transition-all border ${
                  isScrolled
                    ? "border-charcoal/20 text-charcoal hover:bg-charcoal/5"
                    : "border-cream/30 text-cream hover:bg-cream/10"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                {t("nav.signIn")}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled 
                ? "text-charcoal hover:bg-charcoal/10" 
                : "text-cream hover:bg-cream/20"
            }`}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-cream lg:hidden"
      >
        <nav className="container mx-auto flex flex-col gap-2 px-4 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.href}
              onClick={(e) => {
                handleNavClick(e, link.href);
                setIsMobileMenuOpen(false);
              }}
              className="font-body text-lg text-charcoal py-2 px-3 rounded-lg hover:bg-charcoal/5 transition-colors"
            >
              {t(link.key)}
            </Link>
          ))}
          
          {/* Divider */}
          <div className="my-3 h-px bg-charcoal/10" />
          
          {/* Language Selection - Full in Mobile Menu */}
          <div className="px-3">
            <p className="font-body text-xs uppercase tracking-wider text-charcoal-light mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t("lang.english") === "English" ? "Select Language" : "اختر اللغة"}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all ${
                    language === lang.code
                      ? "bg-gold text-charcoal font-medium"
                      : "bg-charcoal/5 text-charcoal hover:bg-charcoal/10"
                  }`}
                >
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="h-5 w-5 rounded-sm object-cover"
                  />
                  <span>{lang.code === "en" ? "English" : lang.code === "ar" ? "العربية" : lang.code === "fr" ? "Français" : "Deutsch"}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Auth Section - Mobile */}
          <div className="my-3 h-px bg-charcoal/10" />
          <div className="px-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg font-body text-lg text-charcoal hover:bg-charcoal/5 transition-colors"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    {t("admin.dashboard")}
                  </Link>
                )}
                <button
                  onClick={() => { logout(); navigate("/"); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg font-body text-lg text-charcoal hover:bg-charcoal/5 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  {t("admin.logout")}
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 px-3 rounded-lg font-body text-lg text-charcoal hover:bg-charcoal/5 transition-colors"
              >
                <User className="h-5 w-5" />
                {t("nav.signIn")}
              </Link>
            )}
          </div>
          
          {/* CTA Button */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenAIModal();
            }}
            className="mt-4 mx-3 rounded-full bg-charcoal py-3 font-body text-sm uppercase tracking-wider text-cream hover:bg-charcoal/90 transition-colors"
          >
            {t("hero.tryAI")}
          </button>
        </nav>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;
