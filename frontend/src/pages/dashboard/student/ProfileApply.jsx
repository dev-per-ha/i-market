// ApplyUniversity.jsx

import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import {
  GraduationCap,
  Building2,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  ArrowLeft,
  RefreshCw,
  XCircle,
} from "lucide-react";

export default function ApplyUniversity() {
  const [universities, setUniversities] = useState([]);
  const [selected, setSelected] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // fetch universities
        const uniRes = await API.get("/university");
        setUniversities(uniRes.data || []);

        // check existing application
        try {
          const appRes = await API.get("/application/my");
          setApplication(appRes.data);
        } catch (err) {
          // 404 means no application found - that's fine
          if (err.response?.status !== 404) {
            console.error("Application fetch error:", err);
          }
          setApplication(null);
        }
      } catch (err) {
        console.error("Failed to fetch universities:", err);
        setError("Failed to load universities. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setFile(null);
        setFileName("");
        return;
      }
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Only JPG, PNG, and PDF files are allowed");
        setFile(null);
        setFileName("");
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selected) {
      setError("Please select a university");
      return;
    }

    if (!file) {
      setError("Please upload your ID/document");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("universityId", selected);
    formData.append("idImage", file);

    try {
      await API.post("/application/apply", formData);
      setSuccess("Application submitted successfully!");

      // Refresh application status
      const appRes = await API.get("/application/my");
      setApplication(appRes.data);

      // Reset form
      setSelected("");
      setFile(null);
      setFileName("");

      // Auto-clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Application error:", err);
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          text: "text-emerald-700 dark:text-emerald-400",
          border: "border-emerald-200 dark:border-emerald-500/20",
          icon: (
            <CheckCircle
              size={20}
              className="text-emerald-600 dark:text-emerald-400"
            />
          ),
          label: "Approved",
          message:
            "Your application has been approved! You can now access university resources.",
        };
      case "rejected":
        return {
          bg: "bg-red-50 dark:bg-red-500/10",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-200 dark:border-red-500/20",
          icon: (
            <XCircle size={20} className="text-red-600 dark:text-red-400" />
          ),
          label: "Rejected",
          message:
            "Your application was not approved. Please contact support for more information.",
        };
      default:
        return {
          bg: "bg-amber-50 dark:bg-amber-500/10",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-500/20",
          icon: (
            <Clock size={20} className="text-amber-600 dark:text-amber-400" />
          ),
          label: "Pending Review",
          message:
            "Your application is being reviewed by the university. You'll be notified once a decision is made.",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 text-sm">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ✅ IF ALREADY APPLIED - Show application status
  if (application) {
    const statusConfig = getStatusConfig(application.status);
    const university = universities.find(
      (u) => u._id === application.universityId,
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold bg-gradient-to-r from-[#1c1f4c] to-[#00848c] bg-clip-text text-transparent">
                University Application Status
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                Track your application progress
              </p>
            </div>
          </div>

          {/* Application Status Card */}
          <div className="relative">
            <div
              className={`p-6 rounded-2xl ${statusConfig.bg} border ${statusConfig.border}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-white/50 dark:bg-white/5">
                  {statusConfig.icon}
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                    {university?.name || "University Application"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-white/40">
                    Submitted on{" "}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} border ${statusConfig.border}`}
                >
                  {statusConfig.icon}
                  <span
                    className={`text-sm font-semibold ${statusConfig.text}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-white/70 leading-relaxed">
                {statusConfig.message}
              </p>

              {application.reviewedAt && (
                <p className="text-xs text-gray-400 dark:text-white/30 mt-4 pt-3 border-t border-gray-200 dark:border-white/10">
                  Last updated:{" "}
                  {new Date(application.reviewedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Application Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold bg-gradient-to-r from-[#1c1f4c] to-[#00848c] bg-clip-text text-transparent">
              Apply to University
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
              Submit your application to join a university
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span className="text-sm text-emerald-700 dark:text-emerald-300">
              {success}
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">
              {error}
            </span>
          </div>
        )}

        {/* Application Form */}
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#00848c]" />
                <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                  Application Form
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* University Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Select University *
                </label>
                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={selected}
                    onChange={(e) => {
                      setSelected(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Choose a university...</option>
                    {universities.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {universities.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    No universities available at the moment
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Upload ID / Document *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#00848c] file:text-white hover:file:bg-[#006b72] cursor-pointer"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    required
                  />
                </div>
                {fileName && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={14} />
                    <span>{fileName} uploaded</span>
                  </div>
                )}
                <p className="text-xs text-gray-400 dark:text-white/30 mt-2">
                  Accepted formats: JPG, PNG, PDF (Max 5MB)
                </p>
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Your application will be reviewed by
                  the university administration. You'll receive a notification
                  once a decision is made.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !selected || !file}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-[#00848c]/25"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Upload size={18} />
                )}
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
