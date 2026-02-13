import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Globe,
  Plus,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  careersApi,
} from "@/lib/api";
import { toast } from "sonner";

type LangKey = "en" | "ar" | "fr" | "de";
const langTabs: { code: LangKey; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

const jobTypes = ["full-time", "part-time", "contract", "remote"] as const;

const AdminCareerEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState<LangKey>("en");
  const [title, setTitle] = useState<Record<string, string>>({ en: "", ar: "", fr: "", de: "" });
  const [department, setDepartment] = useState<Record<string, string>>({ en: "", ar: "", fr: "", de: "" });
  const [description, setDescription] = useState<Record<string, string>>({ en: "", ar: "", fr: "", de: "" });
  const [requirements, setRequirements] = useState<Record<string, string[]>>({ en: [], ar: [], fr: [], de: [] });
  const [benefits, setBenefits] = useState<Record<string, string[]>>({ en: [], ar: [], fr: [], de: [] });
  const [location, setLocation] = useState("");
  const [type, setType] = useState<typeof jobTypes[number]>("full-time");
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("careers@bedirgroup.com");
  const [status, setStatus] = useState<"active" | "closed">("active");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Input refs for adding items
  const [reqInput, setReqInput] = useState("");
  const [benInput, setBenInput] = useState("");

  useEffect(() => {
    if (isEditing && id) {
      careersApi.getCareerById(id).then((career) => {
        setTitle(career.title);
        setDepartment(career.department);
        setDescription(career.description);
        setRequirements(career.requirements);
        setBenefits(career.benefits);
        setLocation(career.location);
        setType(career.job_type as typeof jobTypes[number]);
        setSalary(career.salary || "");
        setEmail(career.application_email);
        setStatus(career.status);
      }).catch(() => navigate("/admin/careers"));
    }
  }, [id, isEditing, navigate]);

  const addRequirement = () => {
    const val = reqInput.trim();
    if (!val) return;
    setRequirements({
      ...requirements,
      [activeTab]: [...(requirements[activeTab] || []), val],
    });
    setReqInput("");
  };

  const removeRequirement = (index: number) => {
    setRequirements({
      ...requirements,
      [activeTab]: (requirements[activeTab] || []).filter((_, i) => i !== index),
    });
  };

  const addBenefit = () => {
    const val = benInput.trim();
    if (!val) return;
    setBenefits({
      ...benefits,
      [activeTab]: [...(benefits[activeTab] || []), val],
    });
    setBenInput("");
  };

  const removeBenefit = (index: number) => {
    setBenefits({
      ...benefits,
      [activeTab]: (benefits[activeTab] || []).filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        title: title as any,
        department: department as any,
        description: description as any,
        requirements,
        benefits,
        location,
        job_type: type,
        salary: salary || "",
        application_email: email,
        status,
      };

      if (isEditing && id) {
        await careersApi.updateCareer(id, payload);
        toast.success("Career listing updated successfully!", { duration: 3000 });
      } else {
        await careersApi.createCareer(payload);
        toast.success("Career listing created successfully!", { duration: 3000 });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setTimeout(() => navigate("/admin/careers"), 500);
    } catch (err) {
      console.error("Failed to save career:", err);
      toast.error("Failed to save career listing", {
        description: (err as Error).message,
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/careers")}
            className="rounded-xl p-2 text-charcoal-light hover:bg-gray-100 hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl text-charcoal">
            {isEditing ? t("admin.editListing") : t("admin.newListing")}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-body text-sm text-green-600"
            >
              {t("admin.saved")} ✓
            </motion.span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-charcoal px-5 py-2.5 font-body text-sm font-medium text-cream hover:bg-charcoal/90 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {t("admin.saveListing")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Language Tabs */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-1 mb-4 border-b border-gray-100 pb-3">
              <Globe className="h-4 w-4 text-charcoal-light mr-2" />
              {langTabs.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveTab(lang.code)}
                  className={`rounded-lg px-3 py-1.5 font-body text-xs font-medium transition-all ${
                    activeTab === lang.code
                      ? "bg-charcoal text-cream"
                      : "text-charcoal-light hover:bg-gray-100"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="font-body text-sm font-medium text-charcoal mb-1.5 block">
                {t("admin.jobTitle")} ({activeTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={title[activeTab] || ""}
                onChange={(e) => setTitle({ ...title, [activeTab]: e.target.value })}
                placeholder="e.g. Senior Interior Designer"
                dir={activeTab === "ar" ? "rtl" : "ltr"}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-body text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="font-body text-sm font-medium text-charcoal mb-1.5 block">
                {t("admin.department")} ({activeTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={department[activeTab] || ""}
                onChange={(e) => setDepartment({ ...department, [activeTab]: e.target.value })}
                placeholder="e.g. Design"
                dir={activeTab === "ar" ? "rtl" : "ltr"}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-body text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="font-body text-sm font-medium text-charcoal mb-1.5 block">
                {t("admin.jobDescription")} ({activeTab.toUpperCase()})
              </label>
              <textarea
                value={description[activeTab] || ""}
                onChange={(e) => setDescription({ ...description, [activeTab]: e.target.value })}
                placeholder="Describe the role..."
                rows={4}
                dir={activeTab === "ar" ? "rtl" : "ltr"}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-body text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none"
              />
            </div>

            {/* Requirements */}
            <div className="mb-4">
              <label className="font-body text-sm font-medium text-charcoal mb-1.5 block">
                {t("admin.requirements")} ({activeTab.toUpperCase()})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                  placeholder="Add requirement..."
                  dir={activeTab === "ar" ? "rtl" : "ltr"}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-body text-sm text-charcoal focus:border-gold focus:outline-none"
                />
                <button
                  onClick={addRequirement}
                  className="rounded-lg bg-gray-100 p-2 text-charcoal hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                {(requirements[activeTab] || []).map((req, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                    <span className="font-body text-sm text-charcoal flex-1">{req}</span>
                    <button
                      onClick={() => removeRequirement(i)}
                      className="text-charcoal-light hover:text-red-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label className="font-body text-sm font-medium text-charcoal mb-1.5 block">
                {t("admin.benefits")} ({activeTab.toUpperCase()})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={benInput}
                  onChange={(e) => setBenInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                  placeholder="Add benefit..."
                  dir={activeTab === "ar" ? "rtl" : "ltr"}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-body text-sm text-charcoal focus:border-gold focus:outline-none"
                />
                <button
                  onClick={addBenefit}
                  className="rounded-lg bg-gray-100 p-2 text-charcoal hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                {(benefits[activeTab] || []).map((ben, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-green-50/50 px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="font-body text-sm text-charcoal flex-1">{ben}</span>
                    <button
                      onClick={() => removeBenefit(i)}
                      className="text-charcoal-light hover:text-red-500 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-display text-base text-charcoal">{t("admin.jobDetails")}</h3>

            <div>
              <label className="font-body text-xs font-medium text-charcoal-light mb-1 block">
                {t("admin.location")}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Cairo, Egypt"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-body text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="font-body text-xs font-medium text-charcoal-light mb-1 block">
                {t("admin.jobType")}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof jobTypes[number])}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-body text-sm text-charcoal focus:border-gold focus:outline-none"
              >
                {jobTypes.map((jt) => (
                  <option key={jt} value={jt}>
                    {jt.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-body text-xs font-medium text-charcoal-light mb-1 block">
                {t("admin.salary")} ({t("admin.optional")})
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. $50,000 - $70,000"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-body text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="font-body text-xs font-medium text-charcoal-light mb-1 block">
                {t("admin.applicationEmail")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-body text-sm text-charcoal focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Status */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="font-display text-base text-charcoal mb-3">{t("admin.status")}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus("active")}
                className={`flex-1 rounded-lg py-2 font-body text-sm font-medium transition-all ${
                  status === "active"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-charcoal-light hover:bg-gray-200"
                }`}
              >
                {t("admin.active")}
              </button>
              <button
                onClick={() => setStatus("closed")}
                className={`flex-1 rounded-lg py-2 font-body text-sm font-medium transition-all ${
                  status === "closed"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 text-charcoal-light hover:bg-gray-200"
                }`}
              >
                {t("admin.closed")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCareerEditor;
