import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Inbox,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { contactApi, type ContactInquiry } from "@/lib/api";
import { toast } from "sonner";

const AdminInquiries = () => {
  const { t } = useLanguage();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadInquiries = async () => {
    try {
      const data = await contactApi.getAllInquiries();
      setInquiries(data);
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const filteredInquiries = inquiries.filter((inq) => {
    if (filter === "unread") return !inq.read;
    if (filter === "read") return inq.read;
    return true;
  });

  const unreadCount = inquiries.filter((i) => !i.read).length;

  const handleMarkRead = async (id: string) => {
    try {
      await contactApi.markAsRead(id);
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, read: true } : i))
      );
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contactApi.deleteInquiry(id);
      toast.success("Inquiry deleted");
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      toast.error("Failed to delete inquiry");
    }
    setDeleteConfirm(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    // Auto-mark as read when opening
    const inq = inquiries.find((i) => i.id === id);
    if (inq && !inq.read) {
      handleMarkRead(id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-charcoal">
            Contact Inquiries
          </h1>
          <p className="font-body text-charcoal-light mt-1">
            View and manage consultation requests
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
                {unreadCount} new
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-xl border border-gray-200 bg-white p-1 w-fit mb-6">
        {(["all", "unread", "read"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-1.5 font-body text-xs font-medium transition-all ${
              filter === f
                ? "bg-charcoal text-cream"
                : "text-charcoal-light hover:text-charcoal"
            }`}
          >
            {f === "all" ? "All" : f === "unread" ? `Unread (${unreadCount})` : "Read"}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 rounded bg-gray-200" />
                  <div className="h-3 w-60 rounded bg-gray-100" />
                </div>
                <div className="h-4 w-24 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredInquiries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 rounded-2xl bg-white border border-gray-100"
        >
          <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-display text-xl text-charcoal mb-2">
            No Inquiries Found
          </h3>
          <p className="font-body text-sm text-charcoal-light">
            {filter === "unread"
              ? "All inquiries have been read."
              : "No consultation requests yet."}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inq, index) => (
            <motion.div
              key={inq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`rounded-2xl bg-white shadow-sm border transition-all ${
                !inq.read
                  ? "border-gold/30 bg-gold/[0.02]"
                  : "border-gray-100"
              }`}
            >
              {/* Summary Row */}
              <button
                onClick={() => toggleExpand(inq.id)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${
                    !inq.read
                      ? "bg-gold/10 text-gold"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {!inq.read ? (
                    <Mail className="h-5 w-5" />
                  ) : (
                    <MailOpen className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-display text-base truncate ${
                        !inq.read
                          ? "text-charcoal font-semibold"
                          : "text-charcoal"
                      }`}
                    >
                      {inq.full_name}
                    </h3>
                    {!inq.read && (
                      <span className="h-2 w-2 rounded-full bg-gold flex-shrink-0" />
                    )}
                  </div>
                  <p className="font-body text-sm text-charcoal-light truncate">
                    {inq.service_type} · {inq.project_type || "General"}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-body text-xs text-charcoal-light hidden sm:block">
                    {new Date(inq.created_at).toLocaleDateString("en-GB")} ·{" "}
                    {new Date(inq.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {expandedId === inq.id ? (
                    <ChevronUp className="h-4 w-4 text-charcoal-light" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-charcoal-light" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === inq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t border-gray-100 px-5 pb-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-2 font-body text-sm text-charcoal-light">
                      <Mail className="h-4 w-4 text-gold" />
                      <a
                        href={`mailto:${inq.email}`}
                        className="hover:text-gold transition-colors"
                      >
                        {inq.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 font-body text-sm text-charcoal-light">
                      <Phone className="h-4 w-4 text-gold" />
                      <a
                        href={`tel:${inq.phone_number}`}
                        className="hover:text-gold transition-colors"
                      >
                        {inq.phone_number}
                      </a>
                    </div>
                    {inq.city && (
                      <div className="flex items-center gap-2 font-body text-sm text-charcoal-light">
                        <MapPin className="h-4 w-4 text-gold" />
                        {inq.city}
                      </div>
                    )}
                    {inq.service_type && (
                      <div className="flex items-center gap-2 font-body text-sm text-charcoal-light">
                        <Briefcase className="h-4 w-4 text-gold" />
                        {inq.service_type}
                      </div>
                    )}
                    {inq.project_type && (
                      <div className="flex items-center gap-2 font-body text-sm text-charcoal-light">
                        <Briefcase className="h-4 w-4 text-gold" />
                        {inq.project_type}
                      </div>
                    )}
                    {inq.budget && (
                      <div className="flex items-center gap-2 font-body text-sm text-charcoal-light">
                        <DollarSign className="h-4 w-4 text-gold" />
                        {inq.budget}
                      </div>
                    )}
                  </div>

                  {inq.message && (
                    <div className="mt-4 rounded-xl bg-gray-50 p-4">
                      <p className="font-body text-sm text-charcoal-light whitespace-pre-wrap">
                        {inq.message}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                    {!inq.read && (
                      <button
                        onClick={() => handleMarkRead(inq.id)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-xs text-charcoal-light hover:bg-gray-100 transition-colors"
                      >
                        <MailOpen className="h-3.5 w-3.5" />
                        Mark as read
                      </button>
                    )}
                    {deleteConfirm === inq.id ? (
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => handleDelete(inq.id)}
                          className="rounded-lg px-3 py-1.5 bg-red-500 text-white font-body text-xs hover:bg-red-600 transition-colors"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded-lg px-3 py-1.5 bg-gray-100 text-charcoal font-body text-xs hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(inq.id)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-xs text-charcoal-light hover:bg-red-50 hover:text-red-500 transition-colors ml-auto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
