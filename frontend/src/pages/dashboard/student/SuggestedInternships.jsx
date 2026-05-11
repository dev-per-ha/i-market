import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Send,
  X,
  FileText,
  Upload,
  AlertCircle,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

const SuggestedInternships = () => {
  const [internships, setInternships] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);
  const [applications, setApplications] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/student/internships/suggested");

      // HANDLE NO CV
      if (res.data.message === "NO_CV") {
        setInternships([]);
        setError("NO_CV");
        setLoading(false);
        return;
      }

      setInternships(res.data.internships || []);

      // PROFILE SKILLS
      const profileRes = await API.get("/student/profile");
      const skills = (profileRes.data?.skills || []).map((s) =>
        s.toString().toLowerCase().trim().replace(/\s+/g, " "),
      );
      setStudentSkills([...new Set(skills)]);

      // APPLICATIONS
      const appRes = await API.get("/student/internships/applications");
      setApplications(appRes.data || []);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("FAILED");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= STATUS =================
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
          buttonClass: "bg-emerald-500 cursor-default",
          buttonText: "Approved",
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
          buttonClass: "bg-red-500 cursor-default",
          buttonText: "Rejected",
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
          buttonClass: "bg-gray-400 cursor-default",
          buttonText: "Waiting...",
        };
      default:
        return {
          bg: "",
          text: "",
          border: "",
          icon: null,
          label: "",
          buttonClass:
            "bg-gradient-to-r from-[#00848c] to-[#006b72] hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c]",
          buttonText: "Apply Now",
        };
    }
  };

  const getMatchColor = (match) => {
    if (match >= 70)
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
    if (match >= 40)
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
    return "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/40";
  };

  // ================= OPEN FORM =================
  const openForm = (internship) => {
    setSelectedInternship(internship);
    setCoverLetter("");
    setCvFile(null);
    setCvFileName("");
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedInternship(null);
    setCoverLetter("");
    setCvFile(null);
    setCvFileName("");
    setFormError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("File size must be less than 5MB");
        setCvFile(null);
        setCvFileName("");
        return;
      }
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        setFormError("Only PDF, DOC, and DOCX files are allowed");
        setCvFile(null);
        setCvFileName("");
        return;
      }
      setCvFile(file);
      setCvFileName(file.name);
      setFormError("");
    }
  };

  // ================= APPLY =================
  const handleApply = async () => {
    if (!coverLetter.trim()) {
      setFormError("Please write a cover letter");
      return;
    }
    if (!cvFile) {
      setFormError("Please upload your CV");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const form = new FormData();
      form.append("internshipId", selectedInternship._id);
      form.append("coverLetter", coverLetter);
      form.append("cv", cvFile);

      await API.post("/student/internships/apply", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchData();
      closeForm();
    } catch (err) {
      console.error(err);
      setFormError(
        err.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate statistics
  const stats = {
    total: internships.length,
    highMatch: internships.filter((i) => (i.matchPercent || 0) >= 70).length,
    applied: applications.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 text-sm">
            Finding best matches for you...
          </p>
        </div>
      </div>
    );
  }

  if (error === "FAILED") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-6 text-center">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-600 dark:text-red-400 font-medium">
            Failed to load internships
          </p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-[#00848c] text-white rounded-lg hover:bg-[#006b72] transition"
          >
            Try Again
          </button>
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
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                Suggested Internships
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                AI-powered matches based on your skills and profile
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          {internships.length > 0 && (
            <div className="flex gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-[#00848c]/10 border border-[#00848c]/20">
                <span className="text-xs font-medium text-[#00848c]">
                  {stats.total} Matches
                </span>
              </div>
              {stats.highMatch > 0 && (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {stats.highMatch} High Match
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* NO CV STATE */}
        {error === "NO_CV" ? (
          <div className="relative">
            <div className="bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-500/20">
                  <FileText
                    size={48}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>
                <p className="text-gray-700 dark:text-white/70 font-medium text-lg">
                  No CV Found
                </p>
                <p className="text-gray-500 dark:text-white/40 max-w-md">
                  Please create your CV first to get personalized internship
                  suggestions based on your skills and qualifications.
                </p>
              </div>
            </div>
          </div>
        ) : internships.length === 0 ? (
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
                  No matching internships found
                </p>
                <p className="text-sm text-gray-400 dark:text-white/20">
                  Try updating your skills or check back later for new
                  opportunities
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {internships.map((internship, index) => {
              const match = internship.matchPercent || 0;
              const status = getStatus(internship._id);
              const statusConfig = getStatusConfig(status);
              const matchColor = getMatchColor(match);

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
                    {/* Header with Match Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <Briefcase size={18} className="text-[#00848c]" />
                        {internship.title}
                      </h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${matchColor}`}
                      >
                        {match}% Match
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-white/60 text-sm mb-4 line-clamp-2">
                      {internship.description}
                    </p>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
                        <Building2
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="truncate">
                          {internship.company?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
                        <MapPin
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="truncate">
                          {internship.location || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
                        <Clock
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span>{internship.duration || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
                        <DollarSign
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span>{internship.jobType || "N/A"}</span>
                      </div>
                    </div>

                    {/* Skills Section */}
                    {internship.requiredSkills?.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Award size={14} className="text-[#00848c]" />
                          <h4 className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                            Required Skills
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {internship.requiredSkills.map((skill, i) => {
                            // Normalize skill matching
                            const normalizedSkill = skill
                              .toLowerCase()
                              .trim()
                              .replace(/\s+/g, " ")
                              .replace(/[^a-z0-9]/g, "");

                            const isMatch = studentSkills.some(
                              (studentSkill) => {
                                const normalizedStudentSkill = studentSkill
                                  .toLowerCase()
                                  .trim()
                                  .replace(/\s+/g, " ")
                                  .replace(/[^a-z0-9]/g, "");
                                return (
                                  normalizedStudentSkill === normalizedSkill ||
                                  normalizedStudentSkill.includes(
                                    normalizedSkill,
                                  ) ||
                                  normalizedSkill.includes(
                                    normalizedStudentSkill,
                                  )
                                );
                              },
                            );

                            return (
                              <span
                                key={i}
                                className={`px-2 py-1 rounded-full text-xs ${
                                  isMatch
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/40"
                                }`}
                              >
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Apply Button */}
                    <button
                      onClick={() => openForm(internship)}
                      disabled={statusConfig.buttonText !== "Apply Now"}
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
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    {formError}
                  </span>
                </div>
              )}

              {/* Match Percentage Display */}
              <div
                className={`p-3 rounded-xl flex items-center justify-between ${getMatchColor(selectedInternship.matchPercent || 0)}`}
              >
                <span className="text-sm font-medium">Match Score</span>
                <span className="text-lg font-bold">
                  {selectedInternship.matchPercent || 0}%
                </span>
              </div>

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
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 shadow-md"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send size={14} />
                )}
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedInternships;
