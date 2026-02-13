import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(email, password);
    if (result.success) {
      toast.success(t("auth.signInSuccess") || "Welcome back! You have signed in successfully.", {
        description: t("auth.signInSuccessDesc") || "Redirecting you now...",
        duration: 3000,
      });
      navigate(from, { replace: true });
    } else {
      const errorMsg = result.error || t("auth.invalidCredentials");
      setError(errorMsg);
      toast.error(t("auth.signInFailed") || "Sign in failed", {
        description: errorMsg,
        duration: 5000,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex" dir={dir}>
      {/* Left - Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-charcoal">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/90 via-charcoal/70 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/">
            <img src="/logo-light.png" alt="Bedir Group" className="h-16 w-auto" />
          </Link>

          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-gold" />
                <span className="text-gold font-body text-sm uppercase tracking-widest">
                  {t("auth.welcomeBack")}
                </span>
              </div>
              <h2 className="font-display text-4xl text-cream mb-4">
                {t("auth.signInTitle")}
              </h2>
              <p className="font-body text-cream/70 text-lg leading-relaxed">
                {t("auth.signInSubtitle")}
              </p>
            </motion.div>
          </div>

          <p className="font-body text-cream/40 text-sm">
            © {new Date().getFullYear()} Bedir Group. All rights reserved.
          </p>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-[120px]"
        />
      </div>

      {/* Right - Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-cream">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link to="/">
              <img src="/logo-dark.png" alt="Bedir Group" className="h-14 w-auto mx-auto" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl text-charcoal mb-2">
              {t("auth.signIn")}
            </h1>
            <p className="font-body text-charcoal-light">
              {t("auth.signInDescription")}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4"
            >
              <p className="font-body text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="font-body text-sm font-medium text-charcoal mb-1.5 block">
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder")}
                  required
                  className="w-full rounded-xl border border-charcoal/10 bg-white px-11 py-3.5 font-body text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="font-body text-sm font-medium text-charcoal mb-1.5 block">
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-charcoal/10 bg-white px-11 py-3.5 font-body text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-light hover:text-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-charcoal px-6 py-3.5 font-body text-sm font-medium text-cream hover:bg-charcoal/90 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-cream border-t-transparent" />
              ) : (
                <>
                  {t("auth.signInButton")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-charcoal/10" />
            <span className="font-body text-xs text-charcoal-light uppercase tracking-wider">
              {t("auth.or")}
            </span>
            <div className="h-px flex-1 bg-charcoal/10" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center font-body text-sm text-charcoal-light">
            {t("auth.noAccount")}{" "}
            <Link
              to="/signup"
              className="text-gold font-medium hover:text-gold-dark transition-colors"
            >
              {t("auth.signUpLink")}
            </Link>
          </p>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="font-body text-xs text-charcoal-light hover:text-charcoal transition-colors uppercase tracking-wider"
            >
              ← {t("auth.backToHome")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
