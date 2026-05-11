// frontend/src/pages/university/UniversityApplications.jsx
import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import {
  User,
  GraduationCap,
  FileText,
  Check,
  X,
  Clock,
  Mail,
  Phone,
  Calendar,
  Building2,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";

export default function UniversityApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Fetch all university applications
  const fetchApplications = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await API.get("/university/applications");
      setApps(res.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(true);
    const interval = setInterval(() => fetchApplications(false), 10000); // refresh every 10s
    setRefreshInterval(interval);
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);

  // Approve / Reject application
  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      await API.patch(`/university/applications/${id}/${action}`);
      setApps((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Action error:", err);
      setError(
        err.response?.data?.message || `Failed to ${action} application`,
      );
      setTimeout(() => setError(""), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-emerald-500/20",
          text: "text-white/80",
          border: "border-emerald-500/30",
          icon: <Check size={14} className="text-white/80" />,
          label: "Approved",
        };
      case "rejected":
        return {
          bg: "bg-red-500/20",
          text: "text-white/80",
          border: "border-red-500/30",
          icon: <X size={14} className="text-white/80" />,
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-amber-500/20",
          text: "text-white/80",
          border: "border-amber-500/30",
          icon: <Clock size={14} className="text-white/80" />,
          label: "Pending Review",
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Statistics from real data
  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "waiting").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-white/70 text-sm">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1f4c] to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              {/* ✅ CHANGED: White text */}
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                Student Applications
              </h1>
              {/* ✅ CHANGED: White text with opacity */}
              <p className="text-sm text-white/60 mt-1">
                Review and manage university admission requests
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">
              <span className="text-xs font-medium text-white/80">
                {stats.total} Total
              </span>
            </div>
            {stats.pending > 0 && (
              <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
                <span className="text-xs font-medium text-white/80">
                  {stats.pending} Pending
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2">
            <AlertCircle size={16} className="text-white/80" />
            <span className="text-sm text-white/80">{error}</span>
          </div>
        )}

        {/* Applications List */}
        {apps.length === 0 ? (
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-white/5">
                  <GraduationCap
                    size={48}
                    className="text-white/20"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-white/50 font-medium">No applications yet</p>
                <p className="text-sm text-white/30">
                  Applications will appear here when students submit them
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app, index) => {
              const statusConfig = getStatusConfig(app.status);

              return (
                <div
                  key={app._id}
                  className="group relative bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Status Ribbon */}
                  <div
                    className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1 ${statusConfig.bg} ${statusConfig.border}`}
                  >
                    {statusConfig.icon}
                    <span className={statusConfig.text}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      {/* Student Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00848c]/20 to-[#fec20f]/20 flex items-center justify-center">
                            <User size={20} className="text-white/80" />
                          </div>
                          <div>
                            {/* ✅ CHANGED: White text */}
                            <h3 className="font-serif font-bold text-lg text-white">
                              {app.student?.name || "Unknown Student"}
                            </h3>
                            <p className="text-sm text-white/50 flex items-center gap-2">
                              <Mail size={12} />
                              {app.student?.email || "No email"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-3 border-l-2 border-white/20">
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <GraduationCap
                              size={14}
                              className="text-white/40"
                            />
                            <span>
                              <strong>Department:</strong>{" "}
                              {app.student?.department || "N/A"}
                            </span>
                          </div>

                          {app.student?.phone && (
                            <div className="flex items-center gap-2 text-sm text-white/70">
                              <Phone size={14} className="text-white/40" />
                              <span>{app.student.phone}</span>
                            </div>
                          )}

                          {app.createdAt && (
                            <div className="flex items-center gap-2 text-sm text-white/50">
                              <Calendar size={14} className="text-white/40" />
                              <span>Applied: {formatDate(app.createdAt)}</span>
                            </div>
                          )}
                        </div>

                        {/* ID File Link */}
                        {app.idImage && (
                          <div className="mt-2">
                            <a
                              href={`http://localhost:5000/uploads/cvs/${app.idImage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-[#fec20f] transition-colors duration-200"
                            >
                              <Eye size={14} />
                              View ID Document
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons (only for pending applications) */}
                      {app.status === "waiting" && (
                        <div className="flex gap-3 mt-4 md:mt-0">
                          <button
                            onClick={() => handleAction(app._id, "approve")}
                            disabled={actionLoading === app._id}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 shadow-md"
                          >
                            {actionLoading === app._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Check size={16} />
                            )}
                            <span className="font-medium">Accept</span>
                          </button>
                          <button
                            onClick={() => handleAction(app._id, "reject")}
                            disabled={actionLoading === app._id}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 shadow-md"
                          >
                            {actionLoading === app._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <X size={16} />
                            )}
                            <span className="font-medium">Reject</span>
                          </button>
                        </div>
                      )}

                      {/* Status Badge for resolved applications */}
                      {app.status !== "waiting" && (
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.border}`}
                        >
                          {statusConfig.icon}
                          <span
                            className={`text-sm font-medium ${statusConfig.text}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
