import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import {
  User,
  Mail,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Star,
  Phone,
  Building2,
  Calendar,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Users,
} from "lucide-react";

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // =========================
  // Fetch applications
  // =========================
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/company/applications");
        setApps(data);
      } catch (err) {
        console.error("Fetch applications error:", err);
        setError(err.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  // =========================
  // Update status
  // =========================
  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setSuccessMessage("");
    try {
      const { data } = await API.put("/company/applications/status", {
        applicationId: id,
        status,
      });
      setApps((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: data.status } : app,
        ),
      );
      setSuccessMessage(
        `Application ${status === "approved" ? "approved" : "rejected"} successfully`,
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Status update failed:", err);
      setError(err.response?.data?.message || "Failed to update status");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // Status styles & icons
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return (
          <CheckCircle
            size={14}
            className="text-emerald-600 dark:text-emerald-400"
          />
        );
      case "rejected":
        return <XCircle size={14} className="text-red-600 dark:text-red-400" />;
      default:
        return (
          <Clock size={14} className="text-amber-600 dark:text-amber-400" />
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Calculate statistics (frontend only - from real data)
  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 text-sm">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
              <Briefcase size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                Internship Appications
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                Review and manage student applications
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          {apps.length > 0 && (
            <div className="flex gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  Pending: {stats.pending}
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Approved: {stats.approved}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2">
            <CheckCircle
              size={16}
              className="text-emerald-600 dark:text-emerald-400"
            />
            <span className="text-sm text-emerald-700 dark:text-emerald-300">
              {successMessage}
            </span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
            <XCircle size={16} className="text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300">
              {error}
            </span>
          </div>
        )}

        {/* Applications Grid */}
        {apps.length === 0 ? (
          <div className="relative">
            <div className="bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                  <Users
                    size={48}
                    className="text-gray-400 dark:text-white/20"
                  />
                </div>
                <p className="text-gray-500 dark:text-white/40 font-medium">
                  No applications yet
                </p>
                <p className="text-sm text-gray-400 dark:text-white/20">
                  When students apply, they will appear here
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {apps.map((app, index) => (
              <div
                key={app._id}
                className="group relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Status Ribbon */}
                <div
                  className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1 ${getStatusStyle(app.status)} border-l-0 border-t-0`}
                >
                  {getStatusIcon(app.status)}
                  <span className="capitalize">{app.status}</span>
                </div>

                <div className="p-5">
                  {/* Student Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                        <span className="text-[#00848c] font-bold text-lg">
                          {app.student?.name?.[0]?.toUpperCase() || "S"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                          {app.student?.name || "Unknown Student"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-white/40">
                            <Mail size={12} />
                            {app.student?.email || "No email"}
                          </span>
                          {app.student?.phone && (
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-white/40">
                              <Phone size={12} />
                              {app.student.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Internship Info */}
                  <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 size={14} className="text-[#00848c]" />
                      <span className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                        Internship
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/80">
                      {app.internship?.title || "Unknown Position"}
                    </p>
                    {app.internship?.location && (
                      <p className="text-xs text-gray-500 dark:text-white/40 mt-1">
                        📍 {app.internship.location}
                      </p>
                    )}
                  </div>

                  {/* Applied Date */}
                  {app.createdAt && (
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 dark:text-white/30">
                      <Calendar size={12} />
                      <span>Applied {formatDate(app.createdAt)}</span>
                    </div>
                  )}

                  {/* Cover Letter */}
                  {app.coverLetter && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={14} className="text-[#00848c]" />
                        <span className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                          Cover Letter
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed line-clamp-3">
                        {app.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* CV Link */}
                  {app.cvFile && (
                    <div className="mb-4">
                      <a
                        href={`http://localhost:5000${app.cvFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#00848c] hover:text-[#fec20f] transition-colors duration-200"
                      >
                        <Eye size={14} />
                        View CV / Resume
                      </a>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {app.status === "pending" && (
                    <div className="flex gap-3 mt-4 pt-3 border-t border-gray-200 dark:border-white/10">
                      <button
                        onClick={() => updateStatus(app._id, "approved")}
                        disabled={updatingId === app._id}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/25"
                      >
                        {updatingId === app._id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <ThumbsUp size={14} />
                        )}
                        <span className="text-sm font-medium">Approve</span>
                      </button>
                      <button
                        onClick={() => updateStatus(app._id, "rejected")}
                        disabled={updatingId === app._id}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-500/25"
                      >
                        {updatingId === app._id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <ThumbsDown size={14} />
                        )}
                        <span className="text-sm font-medium">Reject</span>
                      </button>
                    </div>
                  )}

                  {/* Status Badge for non-pending (display only) */}
                  {app.status !== "pending" && (
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusStyle(app.status)} border`}
                      >
                        {getStatusIcon(app.status)}
                        <span className="capitalize">{app.status}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
