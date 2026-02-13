import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll for new page navigations, then smooth settle
    // First jump close to top, then smooth finish
    const scrollToTop = () => {
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    };

    // Small delay to let the new route render, then smooth scroll
    const timer = setTimeout(scrollToTop, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
