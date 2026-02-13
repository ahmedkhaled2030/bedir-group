import { motion } from "framer-motion";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  LogOut,
  ChevronLeft,
  Menu,
  User,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const sidebarLinks = [
  { key: "admin.dashboard", href: "/admin", icon: LayoutDashboard, end: true },
  { key: "admin.blogPosts", href: "/admin/blog", icon: FileText, end: false },
  { key: "admin.careers", href: "/admin/careers", icon: Briefcase, end: false },
  { key: "admin.inquiries", href: "/admin/inquiries", icon: Mail, end: false },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-charcoal text-cream transition-all duration-300 lg:relative ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          {!collapsed && (
            <img
              src="/logo-light.png"
              alt="Bedir Group"
              className="h-10 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          )}
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className="rounded-lg p-2 text-cream/60 hover:bg-white/10 hover:text-cream transition-colors"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 font-body text-sm transition-all ${
                  isActive
                    ? "bg-gold text-charcoal font-medium shadow-lg shadow-gold/20"
                    : "text-cream/70 hover:bg-white/10 hover:text-cream"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{t(link.key)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-white/10 p-3">
          <div
            className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/20 text-gold flex-shrink-0">
              <User className="h-4 w-4" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-cream truncate">
                  {user?.name}
                </p>
                <p className="font-body text-xs text-cream/50 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`mt-2 flex items-center gap-3 w-full rounded-xl px-3 py-2.5 font-body text-sm text-red-400 hover:bg-red-500/10 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{t("admin.logout")}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-charcoal hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="font-body text-sm text-charcoal-light hover:text-charcoal transition-colors"
            >
              {t("admin.viewSite")} →
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
