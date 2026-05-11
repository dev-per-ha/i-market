import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Users,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Send,
  X,
  FileText,
  Upload,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const StudentInternships = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userInfo?.token;

  // FETCH INTERNSHIPS
  const fetchInternships = async () => {
    try {
      const { data } = await API.get("/company/internships", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInternships(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load internships");
    }
  };

  // FETCH STUDENT APPLICATIONS
  const fetchApplications = async () => {
    try {
      const res = await API.get("/student/my-applications");
      setApplications(res.data.internships || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setFetching(true);
      await Promise.all([fetchInternships(), fetchApplications()]);
      setFetching(false);
    };
    loadData();
  }, []);

  // GET STATUS
  const getStatus = (id) => {
    const app = applications.find((a) => a.internship?._id === id);
    return app?.status;
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
              size={14}
              className="text-emerald-600 dark:text-emerald-400"
            />
          ),
          label: "Approved",
          buttonText: "Approved",
          buttonDisabled: true,
          buttonClass: "bg-emerald-500 cursor-default",
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
          buttonText: "Rejected",
          buttonDisabled: true,
          buttonClass: "bg-red-500 cursor-default",
        };
      case "pending":
        return {
          bg: "bg-amber-50 dark:bg-amber-500/10",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-500/20",
          icon: (
            <ClockIcon
              size={14}
              className="text-amber-600 dark:text-amber-400"
            />
          ),
          label: "Pending",
          buttonText: "Waiting...",
          buttonDisabled: true,
          buttonClass: "bg-gray-400 cursor-default",
        };
      default:
        return {
          bg: "",
          text: "",
          border: "",
          icon: null,
          label: "",
          buttonText: "Apply Now",
          buttonDisabled: false,
          buttonClass:
            "bg-gradient-to-r from-[#00848c] to-[#006b72] hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c]",
        };
    }
  };

  // OPEN FORM
  const openForm = (internship) => {
    setSelectedInternship(internship);
    setCoverLetter("");
    setCvFile(null);
    setCvFileName("");
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedInternship(null);
    setCoverLetter("");
    setCvFile(null);
    setCvFileName("");
    setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setCvFile(null);
        setCvFileName("");
        return;
      }
      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        setError("Only PDF, DOC, and DOCX files are allowed");
        setCvFile(null);
        setCvFileName("");
        return;
      }
      setCvFile(file);
      setCvFileName(file.name);
      setError("");
    }
  };

  // APPLY
  const handleApply = async () => {
    if (!coverLetter.trim()) {
      setError("Please write a cover letter");
      return;
    }
    if (!cvFile) {
      setError("Please upload your CV");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("internshipId", selectedInternship._id);
      form.append("coverLetter", coverLetter);
      form.append("cv", cvFile);

      await API.post("/student/internships/apply", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchApplications();
      closeForm();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from real data
  const stats = {
    total: internships.length,
    applied: applications.length,
    approved: applications.filter((a) => a.status === "approved").length,
    pending: applications.filter((a) => a.status === "pending").length,
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 text-sm">
            Loading internships...
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
                Available Internships
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                Find and apply to internship opportunities
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          {internships.length > 0 && (
            <div className="flex gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-[#00848c]/10 border border-[#00848c]/20">
                <span className="text-xs font-medium text-[#00848c]">
                  {stats.total} Available
                </span>
              </div>
              {stats.applied > 0 && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {stats.applied} Applied
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Internships Grid */}
        {internships.length === 0 ? (
          <div className="relative">
            <div className="bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                  <Briefcase
                    size={48}
                    className="text-gray-400 dark:text-white/20"
                  />
                </div>
                <p className="text-gray-500 dark:text-white/40 font-medium">
                  No internships available
                </p>
                <p className="text-sm text-gray-400 dark:text-white/20">
                  Check back later for new opportunities
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {internships.map((internship, index) => {
              const status = getStatus(internship._id);
              const statusConfig = getStatusConfig(status);

              return (
                <div
                  key={internship._id}
                  className="group relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Status Ribbon if applied */}
                  {status && (
                    <div
                      className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-medium flex items-center gap-1 ${statusConfig.bg} ${statusConfig.border}`}
                    >
                      {statusConfig.icon}
                      <span className={statusConfig.text}>
                        {statusConfig.label}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-2">
                      {internship.title}
                    </h3>

                    <p className="text-gray-600 dark:text-white/60 text-sm mb-4 line-clamp-2">
                      {internship.description}
                    </p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                        <Building2
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span>{internship.company?.name || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                        <MapPin
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span>
                          {internship.location || "Location not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                        <Clock
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span>{internship.duration || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                        <DollarSign
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span>{internship.stipend || "Unpaid"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                        <Users
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span>Slots: {internship.slots}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                        <GraduationCap
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span>Minimum GPA: {internship.gpa}</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    {internship.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {internship.requiredSkills
                          .slice(0, 3)
                          .map((skill, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded-full bg-[#00848c]/10 text-[#00848c]"
                            >
                              {skill}
                            </span>
                          ))}
                        {internship.requiredSkills.length > 3 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500">
                            +{internship.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => openForm(internship)}
                      disabled={statusConfig.buttonDisabled}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md ${statusConfig.buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {statusConfig.buttonText === "Apply Now" && (
                        <Send size={14} />
                      )}
                      {statusConfig.buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* APPLICATION MODAL */}
      {showForm && selectedInternship && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white dark:bg-[#1c1f4c] rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-white/10 animate-fadeInUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200 dark:border-white/10 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-[#00848c]" />
                  <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                    Apply for {selectedInternship.title}
                  </h2>
                </div>
                <button
                  onClick={closeForm}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </span>
                </div>
              )}

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] resize-none"
                  placeholder="Write your cover letter explaining why you're a good fit for this position..."
                />
              </div>

              {/* CV Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Upload CV *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#00848c] file:text-white hover:file:bg-[#006b72] cursor-pointer"
                    accept=".pdf,.doc,.docx"
                  />
                </div>
                {cvFileName && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <FileText size={14} />
                    <span>{cvFileName}</span>
                  </div>
                )}
                <p className="text-xs text-gray-400 dark:text-white/30 mt-2">
                  Accepted formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 flex gap-3">
              <button
                onClick={closeForm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send size={14} />
                )}
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInternships;
