import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import {
  Briefcase,
  Plus,
  X,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  GraduationCap,
  Users,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Zap,
  Building2,
  Clock,
  Award,
} from "lucide-react";

const PostInternship = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    duration: "",
    jobType: "",
    gpa: "",
    slots: "",
    requiredSkills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [internships, setInternships] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  // ===== FETCH INTERNSHIPS =====
  const fetchMyInternships = async () => {
    try {
      const res = await API.get("/company/my-internships", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInternships(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyInternships();
  }, []);

  // ===== FORM HANDLER =====
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ===== SKILLS =====
  const addSkill = () => {
    if (!skillInput.trim() || form.requiredSkills.includes(skillInput.trim()))
      return;

    setForm({
      ...form,
      requiredSkills: [...form.requiredSkills, skillInput.trim()],
    });

    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm({
      ...form,
      requiredSkills: form.requiredSkills.filter((s) => s !== skill),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // ===== SUBMIT (CREATE / UPDATE) =====
  const handleSubmit = async () => {
    setError("");
    setMessage("");

    // Validation
    if (
      !form.title ||
      !form.description ||
      !form.slots ||
      !form.gpa ||
      !form.jobType
    ) {
      setError(
        "Please fill all required fields: Title, Description, Slots, GPA, and Job Type",
      );
      return;
    }

    if (form.requiredSkills.length === 0) {
      setError("Please add at least one required skill");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        slots: form.slots ? Number(form.slots) : null,
        gpa: form.gpa ? Number(form.gpa) : null,
      };

      if (editId) {
        await API.put(`/company/internship/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Internship updated successfully!");
      } else {
        await API.post("/company/internship/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Internship posted successfully!");
      }

      // reset form
      setForm({
        title: "",
        description: "",
        department: "",
        location: "",
        duration: "",
        gpa: "",
        slots: "",
        requiredSkills: [],
        jobType: "",
      });

      setEditId(null);
      fetchMyInternships();

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.requiresPayment) {
        setShowPaywall(true);
      } else {
        setError(err.response?.data?.message || "Failed to save internship");
        setTimeout(() => setError(""), 3000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ===== PAYMENT (CHAPA) =====
  const handleUpgrade = async () => {
    setPaymentLoading(true);

    try {
      const res = await API.post(
        "/payment/initiate",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      window.location.href = res.data.checkout_url;
    } catch (err) {
      console.error("Full error:", err.response?.data);

      setError(
        typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : "Payment initiation failed. Please try again.",
      );

      setPaymentLoading(false);
    }
  };

  // ===== DELETE =====
  const deleteInternship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship?"))
      return;

    setDeletingId(id);
    try {
      await API.delete(`/company/internship/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyInternships();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete internship");
      setTimeout(() => setError(""), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  // ===== EDIT =====
  const startEdit = (item) => {
    setForm({
      ...item,
      requiredSkills: item.requiredSkills || [],
    });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      title: "",
      description: "",
      department: "",
      location: "",
      duration: "",
      gpa: "",
      slots: "",
      requiredSkills: [],
      jobType: "",
    });
  };

  const totalApplicants = internships.reduce(
    (sum, i) => sum + (i.applicants?.length || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
            <Briefcase size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              Internship Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
              {internships.length} active internship
              {internships.length !== 1 ? "s" : ""} • {totalApplicants} total
              applicants
            </p>
          </div>
        </div>

        {/* ===== PAYWALL MODAL ===== */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1c1f4c] rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-white/10 animate-fadeInUp">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#fec20f]/20 to-amber-500/20 flex items-center justify-center">
                  <Zap size={32} className="text-[#fec20f]" />
                </div>

                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                  Free Limit Reached
                </h2>

                <p className="text-gray-500 dark:text-white/40">
                  You've used your 2 free internship posts. Upgrade to{" "}
                  <strong className="text-[#00848c]">Premium</strong> to
                  continue.
                </p>

                <div className="bg-gradient-to-r from-[#00848c]/10 to-[#fec20f]/10 rounded-xl p-4 text-left space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-white/80">
                    Premium includes:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white/60 flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00848c]" />
                    Unlock 2 more internship posts
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white/60 flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00848c]" />
                    Priority placement
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white/60 flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#00848c]" />
                    Verified company badge
                  </p>
                </div>

                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  500 ETB
                </p>

                <button
                  onClick={handleUpgrade}
                  disabled={paymentLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 font-semibold"
                >
                  {paymentLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <CreditCard size={16} />
                  )}
                  {paymentLoading ? "Processing..." : "Pay with Chapa →"}
                </button>

                <button
                  onClick={() => setShowPaywall(false)}
                  className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-white/60 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== FORM CARD ===== */}
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {editId ? (
                    <Edit2 size={18} className="text-[#00848c]" />
                  ) : (
                    <Briefcase size={18} className="text-[#00848c]" />
                  )}
                  <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                    {editId ? "Edit Internship" : "Post New Internship"}
                  </h2>
                </div>
                {editId && (
                  <button
                    onClick={cancelEdit}
                    className="text-sm text-gray-500 hover:text-red-500 transition"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Alert Messages */}
              {message && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    {message}
                  </span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Internship Title *"
                  className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                />
               <select
  name="jobType"
  value={form.jobType}
  onChange={handleChange}
  className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#0f1230]/60 text-white focus:outline-none focus:ring-2 focus:ring-[#00848c] backdrop-blur-md transition-all"
>
  <option value="">Select Job Type *</option>
  <option value="remote" className="text-[#00d4ff] bg-[#0f1230]">
    Remote
  </option>
  <option value="full-time" className="text-[#fec20f] bg-[#0f1230]">
    Full Time
  </option>
  <option value="hybrid" className="text-[#00ff9d] bg-[#0f1230]">
    Hybrid
  </option>
</select>
              </div>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description *"
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Department"
                  className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl"
                />
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="Duration (e.g., 3 months)"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl"
                  />
                </div>
                
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Users
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="slots"
                    type="number"
                    value={form.slots}
                    onChange={handleChange}
                    placeholder="Number of Slots *"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl"
                  />
                </div>
                <div className="relative">
                  <GraduationCap
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="gpa"
                    type="number"
                    step="0.01"
                    value={form.gpa}
                    onChange={handleChange}
                    placeholder="Minimum GPA *"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl"
                  />
                </div>
              </div>

              {/* SKILLS SECTION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Required Skills *
                </label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a skill (e.g., React, Python)"
                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {form.requiredSkills.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00848c]/10 text-[#00848c] text-sm"
                    >
                      {s}
                      <button
                        onClick={() => removeSkill(s)}
                        className="hover:text-red-500 transition"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                {form.requiredSkills.length === 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    No skills added yet
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 font-semibold shadow-lg shadow-[#00848c]/25"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : editId ? (
                  <Edit2 size={16} />
                ) : (
                  <Briefcase size={16} />
                )}
                {submitting
                  ? "Saving..."
                  : editId
                    ? "Update Internship"
                    : "Post Internship"}
              </button>
            </div>
          </div>
        </div>

        {/* ===== MY INTERNSHIPS LIST ===== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#00848c]/10">
                <Briefcase size={16} className="text-[#00848c]" />
              </div>
              <h2 className="font-serif font-semibold text-xl text-gray-900 dark:text-white">
                My Internships
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-[#00848c]/10 text-[#00848c] text-xs font-medium">
              {internships.length} total
            </span>
          </div>

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
                  No internships posted yet
                </p>
                <p className="text-sm text-gray-400 dark:text-white/20">
                  Create your first internship using the form above
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {internships.map((internship) => (
                <div
                  key={internship._id}
                  className="group relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                          {internship.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-white/40">
                          {internship.department} • {internship.location}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#00848c]/10 text-[#00848c] text-xs font-medium">
                        {internship.slots} Slot
                        {internship.slots !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <p className="text-sm text-gray-600 dark:text-white/60 flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {internship.duration}
                      </p>
                      {internship.stipend && (
                        <p className="text-sm text-gray-600 dark:text-white/60 flex items-center gap-2">
                          <DollarSign size={14} className="text-gray-400" />
                          {internship.stipend}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-white/60 flex items-center gap-2">
                        <GraduationCap size={14} className="text-gray-400" />
                        GPA {internship.gpa}+
                      </p>
                      <p className="text-sm text-gray-600 dark:text-white/60 flex items-center gap-2">
                        <Users size={14} className="text-gray-400" />
                        {internship.applicants?.length || 0} Applicants
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {internship.requiredSkills
                        ?.slice(0, 3)
                        .map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60"
                          >
                            {skill}
                          </span>
                        ))}
                      {internship.requiredSkills?.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500">
                          +{internship.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-white/10">
                      <button
                        onClick={() => startEdit(internship)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-200 text-sm"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteInternship(internship._id)}
                        disabled={deletingId === internship._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 text-sm disabled:opacity-50"
                      >
                        {deletingId === internship._id ? (
                          <div className="w-3 h-3 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 size={14} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostInternship;
