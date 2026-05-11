// frontend/src/pages/dashboard/student/Profile.jsx
import React, { useState, useEffect } from "react";
import API from "../../../services/api";
import {
  User,
  Phone,
  GraduationCap,
  FileText,
  Award,
  Mail,
  Building2,
  Upload,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit2,
  Save,
  Trash2,
  Briefcase,
  Calendar,
  MapPin,
  Globe,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [applyMode, setApplyMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    department: "",
    bio: "",
    skills: "",
    email: "",
  });

  const [applyForm, setApplyForm] = useState({
    fullName: "",
    department: "",
    university: "",
    idImage: null,
  });

  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      const res = await API.get("/student/profile");
      setProfile(res.data);

      setForm({
        name: res.data.name || "",
        phone: res.data.phone || "",
        department: res.data.department || "",
        bio: res.data.bio || "",
        skills: res.data.skills?.join(", ") || "",
        email: res.data.email || "",
      });

      setApplyForm((prev) => ({
        ...prev,
        fullName: res.data.name || "",
        department: res.data.department || "",
      }));
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH UNIVERSITIES =================
  const fetchUniversities = async () => {
    try {
      const res = await API.get("/university/universities");
      setUniversities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchProfile();
    fetchUniversities();
  }, []);

  // ================= UPDATE PROFILE =================
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await API.put("/student/profile", {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setEditMode(false);
      setSuccess("Profile updated successfully!");
      fetchProfile();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save profile");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // ================= APPLY =================
  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyForm.idImage) {
      setError("Please upload your ID image");
      return;
    }
    if (!applyForm.university) {
      setError("Please select a university");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("fullName", applyForm.fullName);
      data.append("department", applyForm.department);
      data.append("university", applyForm.university);
      data.append("profileImage", applyForm.idImage);
      await API.post("/student/applications/submit", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApplyMode(false);
      setSuccess("University application submitted successfully!");
      fetchProfile();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Application failed");
      setTimeout(() => setError(""), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // ================= CANCEL APPLICATION =================
  const handleCancel = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel your university application?",
      )
    )
      return;

    setCancelling(true);
    try {
      await API.delete("/student/cancel-application");
      setSuccess("Application cancelled successfully");
      fetchProfile();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to cancel application");
      setTimeout(() => setError(""), 3000);
    } finally {
      setCancelling(false);
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
              size={16}
              className="text-emerald-600 dark:text-emerald-400"
            />
          ),
          label: "Approved",
        };
      case "rejected":
        return {
          bg: "bg-red-50 dark:bg-red-500/10",
          text: "text-red-700 dark:text-red-400",
          border: "border-red-200 dark:border-red-500/20",
          icon: (
            <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
          ),
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-amber-50 dark:bg-amber-500/10",
          text: "text-amber-700 dark:text-amber-400",
          border: "border-amber-200 dark:border-amber-500/20",
          icon: (
            <Clock size={16} className="text-amber-600 dark:text-amber-400" />
          ),
          label: "Pending Review",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const applicationStatus = profile?.application
    ? getStatusConfig(profile.application.status)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              My Profile
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
              Manage your personal information and university application
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

        {/* ================= PROFILE SECTION ================= */}
        <div className="relative mb-8">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-[#00848c]" />
                  <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                    Personal Information
                  </h2>
                </div>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#00848c] hover:bg-[#00848c]/10 transition-all duration-200"
                  >
                    <Edit2 size={14} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {editMode ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          value={form.email}
                          disabled
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 cursor-not-allowed"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                        Department
                      </label>
                      <div className="relative">
                        <GraduationCap
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          value={form.department}
                          onChange={(e) =>
                            setForm({ ...form, department: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                          placeholder="Department"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={form.bio}
                      onChange={(e) =>
                        setForm({ ...form, bio: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                      Skills (comma separated)
                    </label>
                    <div className="relative">
                      <Award
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        value={form.skills}
                        onChange={(e) =>
                          setForm({ ...form, skills: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                        placeholder="React, Python, UI/UX, etc."
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 shadow-lg shadow-[#00848c]/25"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                        Full Name
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium flex items-center gap-2">
                        <User size={14} className="text-[#00848c]" />
                        {profile?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                        Email
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium flex items-center gap-2">
                        <Mail size={14} className="text-[#00848c]" />
                        {profile?.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                        Phone
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium flex items-center gap-2">
                        <Phone size={14} className="text-[#00848c]" />
                        {profile?.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                        Department
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium flex items-center gap-2">
                        <GraduationCap size={14} className="text-[#00848c]" />
                        {profile?.department || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {profile?.bio && (
                    <div>
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                        Bio
                      </p>
                      <p className="text-gray-600 dark:text-white/70">
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  {profile?.skills?.length > 0 && (
                    <div>
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full bg-[#00848c]/10 text-[#00848c] text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= UNIVERSITY APPLICATION SECTION ================= */}
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <GraduationCap size={18} className="text-[#00848c]" />
                <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                  University Application
                </h2>
              </div>
            </div>

            <div className="p-6">
              {!profile?.application ? (
                applyMode ? (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                          Full Name
                        </label>
                        <input
                          value={applyForm.fullName}
                          onChange={(e) =>
                            setApplyForm({
                              ...applyForm,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                          placeholder="Full Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                          Department
                        </label>
                        <input
                          value={applyForm.department}
                          onChange={(e) =>
                            setApplyForm({
                              ...applyForm,
                              department: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                          placeholder="Department"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                        Select University
                      </label>
                      <select
                        value={applyForm.university}
                        onChange={(e) =>
                          setApplyForm({
                            ...applyForm,
                            university: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                        required
                      >
                        <option value="">Select a university</option>
                        {universities.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                        Upload ID / Document
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={(e) =>
                            setApplyForm({
                              ...applyForm,
                              idImage: e.target.files[0],
                            })
                          }
                          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#00848c] file:text-white hover:file:bg-[#006b72]"
                          accept="image/*,.pdf"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Accepted formats: JPG, PNG, PDF (Max 5MB)
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 shadow-lg shadow-[#00848c]/25"
                      >
                        {submitting ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Upload size={16} />
                        )}
                        {submitting ? "Submitting..." : "Submit Application"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplyMode(false)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                        <GraduationCap
                          size={48}
                          className="text-gray-400 dark:text-white/20"
                        />
                      </div>
                      <div>
                        <p className="text-gray-700 dark:text-white/70 font-medium">
                          You haven't applied to any university yet
                        </p>
                        <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                          Submit your application to get started
                        </p>
                      </div>
                      <button
                        onClick={() => setApplyMode(true)}
                        className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 shadow-md"
                      >
                        Apply to University
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div
                  className={`p-5 rounded-xl ${applicationStatus.bg} border ${applicationStatus.border}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                        {profile.application.university?.name ||
                          "University Application"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-white/60 mt-1">
                        Applied on{" "}
                        {new Date(
                          profile.application.createdAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${applicationStatus.bg} ${applicationStatus.border}`}
                    >
                      {applicationStatus.icon}
                      <span
                        className={`text-sm font-medium ${applicationStatus.text}`}
                      >
                        {applicationStatus.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                        Full Name
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium">
                        {profile.application.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                        Department
                      </p>
                      <p className="text-gray-800 dark:text-white font-medium">
                        {profile.application.department}
                      </p>
                    </div>
                  </div>

                  {profile.application.status === "waiting" && (
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 shadow-md"
                    >
                      {cancelling ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Cancel Application
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
