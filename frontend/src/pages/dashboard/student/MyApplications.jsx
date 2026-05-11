// frontend/src/pages/student/MyApplications.jsx

import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import {
  Briefcase,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap,
  Trash2,
  RefreshCw,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Mail,
  MapPin,
  Award,
} from "lucide-react";

export default function MyApplications() {
  const [application, setApplication] = useState(null);
  const [internships, setInternships] = useState([]);
  const [view, setView] = useState("university");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // 📥 University Application
  // =========================
  const fetchApplication = async () => {
    try {
      const res = await API.get("/student/applications");
      setApplication(res.data || null);
    } catch (err) {
      console.error(err);
      setApplication(null);
    }
  };

  // =========================
  // 📥 Internship Applications
  // =========================
  const fetchInternships = async () => {
    try {
      const res = await API.get("/student/internships/applications");
      console.log("INTERNSHIPS:", res.data);
      setInternships(res.data || []);
    } catch (err) {
      console.error(err);
      setInternships([]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([fetchApplication(), fetchInternships()]);
    } catch (err) {
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // =========================
  // ❌ Cancel University Application
  // =========================
  const handleCancelUniversity = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel your university application? This action cannot be undone.",
      )
    )
      return;

    setCancelling("university");
    try {
      await API.delete("/student/applications");
      await fetchApplication();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel application");
    } finally {
      setCancelling(null);
    }
  };

  // =========================
  // ❌ Cancel Internship Application
  // =========================
  const handleCancelInternship = async (applicationId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this internship application? This action cannot be undone.",
      )
    )
      return;

    setCancelling(applicationId);
    try {
      await API.delete("/student/internships/applications/cancel", {
        data: { applicationId },
      });

      setInternships((prev) => prev.filter((app) => app._id !== applicationId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Cancel failed");
    } finally {
      setCancelling(null);
    }
  };

  // =========================
  // 🎨 Status Configuration
  // =========================
  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
      case "accepted":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-500/20",
          icon: (
            <CheckCircle
              size={14}
              className="text-emerald-600 dark:text-emerald-400"
            />
          ),
          label: status === "approved" ? "Approved" : "Accepted",
        };
      case "rejected":
        return {
          bg: "bg-red-50 dark:bg-red-500/10",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-200 dark:border-red-500/20",
          icon: (
            <XCircle size={14} className="text-red-600 dark:text-red-400" />
          ),
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-amber-50 dark:bg-amber-500/10",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-500/20",
          icon: (
            <Clock size={14} className="text-amber-600 dark:text-amber-400" />
          ),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 text-sm">
            Loading your applications...
          </p>
        </div>
      </div>
    );
  }

  const universityStatusConfig = application
    ? getStatusConfig(application.status)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                My Applications
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                Track your university and internship applications
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300">
              {error}
            </span>
          </div>
        )}

        {/* TOGGLE TABS */}
        <div className="flex gap-2 mb-8 p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
          <button
            onClick={() => setView("university")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
              view === "university"
                ? "bg-gradient-to-r from-[#00848c] to-[#006b72] text-white shadow-lg shadow-[#00848c]/25"
                : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <GraduationCap size={16} />
            University Application
          </button>

          <button
            onClick={() => setView("internships")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
              view === "internships"
                ? "bg-gradient-to-r from-[#00848c] to-[#006b72] text-white shadow-lg shadow-[#00848c]/25"
                : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Briefcase size={16} />
            Internship Applications
            {internships.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white/20 text-white">
                {internships.length}
              </span>
            )}
          </button>
        </div>

        {/* ================= UNIVERSITY APPLICATION VIEW ================= */}
        {view === "university" && (
          <div className="relative">
            {!application ? (
              <div className="bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                    <GraduationCap
                      size={48}
                      className="text-gray-400 dark:text-white/20"
                    />
                  </div>
                  <p className="text-gray-500 dark:text-white/40 font-medium">
                    No university application found
                  </p>
                  <p className="text-sm text-gray-400 dark:text-white/20">
                    You haven't applied to any university yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={18} className="text-[#00848c]" />
                      <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                        University Application Details
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                          Full Name
                        </p>
                        <p className="text-gray-800 dark:text-white font-medium flex items-center gap-2">
                          <User size={14} className="text-[#00848c]" />
                          {application.fullName}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                          Department
                        </p>
                        <p className="text-gray-800 dark:text-white font-medium flex items-center gap-2">
                          <Award size={14} className="text-[#00848c]" />
                          {application.department}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                        University
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium flex items-center gap-2">
                        <Building2 size={14} className="text-[#00848c]" />
                        {application.university?.name || "N/A"}
                      </p>
                    </div>

                    {application.createdAt && (
                      <div className="space-y-1">
                        <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                          Applied On
                        </p>
                        <p className="text-gray-600 dark:text-white/60 text-sm flex items-center gap-2">
                          <Calendar size={12} />
                          {formatDate(application.createdAt)}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-3">
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${universityStatusConfig.bg} ${universityStatusConfig.border}`}
                      >
                        {universityStatusConfig.icon}
                        <span
                          className={`text-sm font-medium ${universityStatusConfig.text}`}
                        >
                          {universityStatusConfig.label}
                        </span>
                      </div>
                    </div>

                    {application.status === "waiting" && (
                      <button
                        onClick={handleCancelUniversity}
                        disabled={cancelling === "university"}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 shadow-md"
                      >
                        {cancelling === "university" ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Cancel Application
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= INTERNSHIP APPLICATIONS VIEW ================= */}
        {view === "internships" && (
          <div>
            {internships.length === 0 ? (
              <div className="bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                    <Briefcase
                      size={48}
                      className="text-gray-400 dark:text-white/20"
                    />
                  </div>
                  <p className="text-gray-500 dark:text-white/40 font-medium">
                    No internship applications yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-white/20">
                    Apply to internships and they will appear here
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {internships.map((app, index) => {
                  const statusConfig = getStatusConfig(app.status);
                  return (
                    <div
                      key={app._id}
                      className="group relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                              <Briefcase size={18} className="text-[#00848c]" />
                              {app.internship?.title || "Unknown Position"}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-white/40 flex items-center gap-2 mt-1">
                              <Building2 size={14} />
                              {app.internship?.company?.name ||
                                "Unknown Company"}
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${statusConfig.bg} ${statusConfig.border}`}
                          >
                            {statusConfig.icon}
                            <span
                              className={`text-xs font-medium ${statusConfig.text}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>

                        {app.internship?.location && (
                          <p className="text-sm text-gray-600 dark:text-white/60 flex items-center gap-2 mt-2">
                            <MapPin size={14} className="text-gray-400" />
                            {app.internship.location}
                          </p>
                        )}

                        {app.createdAt && (
                          <p className="text-xs text-gray-400 dark:text-white/30 flex items-center gap-2 mt-2">
                            <Calendar size={12} />
                            Applied on {formatDate(app.createdAt)}
                          </p>
                        )}

                        {app.status === "pending" && (
                          <button
                            onClick={() => handleCancelInternship(app._id)}
                            disabled={cancelling === app._id}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 shadow-md mt-4"
                          >
                            {cancelling === app._id ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Cancel Application
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
