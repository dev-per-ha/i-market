import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import {
  UserPlus,
  Users,
  UserCheck,
  Trash2,
  Mail,
  Building2,
  GraduationCap,
  Plus,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const UniversityAdvisorDashboard = () => {
  const [advisors, setAdvisors] = useState([]);
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedAdvisor, setSelectedAdvisor] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ================= FETCH ADVISORS =================
  const fetchAdvisors = async () => {
    try {
      const res = await API.get("/university/advisors");
      setAdvisors(res.data);
    } catch (err) {
      console.error("FETCH ADVISORS ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch advisors");
    }
  };

  // ================= FETCH STUDENTS =================
  const fetchStudents = async () => {
    try {
      const res = await API.get("/university/students");
      setStudents(res.data);
    } catch (err) {
      console.error("FETCH STUDENTS ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch students");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setFetching(true);
      await Promise.all([fetchAdvisors(), fetchStudents()]);
      setFetching(false);
    };
    loadData();
  }, []);

  // ================= ADD ADVISOR =================
  const handleAddAdvisor = async () => {
    if (!name || !email || !department) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/university/advisor", {
        name,
        email,
        department,
      });
      setSuccess(res.data.message || "Advisor added successfully");
      setName("");
      setEmail("");
      setDepartment("");
      await fetchAdvisors();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("ADD ADVISOR ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to add advisor");
      setTimeout(() => setError(""), 3000);
    }
    setLoading(false);
  };

  // ================= DELETE ADVISOR =================
  const handleDeleteAdvisor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this advisor?"))
      return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      await API.delete(`/university/advisor/${id}`);
      setSuccess("Advisor deleted successfully");
      await fetchAdvisors();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("DELETE ADVISOR ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to delete advisor");
      setTimeout(() => setError(""), 3000);
    }
    setDeletingId(null);
  };

  // ================= ASSIGN ADVISOR =================
  const handleAssignAdvisor = async () => {
    if (!selectedStudent || !selectedAdvisor) {
      setError("Please select both a student and an advisor");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.patch("/university/assign-advisor", {
        studentId: selectedStudent,
        advisorId: selectedAdvisor,
      });
      setSuccess(res.data.message || "Advisor assigned successfully");
      setSelectedStudent("");
      setSelectedAdvisor("");
      await fetchStudents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("ASSIGN ADVISOR ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to assign advisor");
      setTimeout(() => setError(""), 3000);
    }
    setLoading(false);
  };

  // Statistics from real data
  const stats = {
    totalAdvisors: advisors.length,
    totalStudents: students.length,
    unassignedStudents: students.filter((s) => !s.advisor).length,
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-white/70 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1f4c] to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
              <UserCheck size={20} className="text-white" />
            </div>
            <div>
              {/* ✅ CHANGED: White text */}
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                Advisor Management
              </h1>
              {/* ✅ CHANGED: White text with opacity */}
              <p className="text-sm text-white/60 mt-1">
                Manage academic advisors and student assignments
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[#00848c]/20 border border-[#00848c]/30">
              <span className="text-xs font-medium text-white/80">
                {stats.totalAdvisors} Advisors
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <span className="text-xs font-medium text-white/80">
                {stats.totalStudents} Students
              </span>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-2">
            <CheckCircle size={16} className="text-white/80" />
            <span className="text-sm text-white/80">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2">
            <AlertCircle size={16} className="text-white/80" />
            <span className="text-sm text-white/80">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ================= ADD ADVISOR SECTION ================= */}
          <div className="relative">
            <div className="bg-white/10 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00848c]/20 to-transparent px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <UserPlus size={18} className="text-white/80" />
                  <h2 className="font-serif font-semibold text-lg text-white">
                    Add New Advisor
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserPlus
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      placeholder="Dr. አለማየሁ ተስፋዬ (Alamayewu Tesfaye)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      placeholder="alamayewu.t@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">
                    Department *
                  </label>
                  <div className="relative">
                    <Building2
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      placeholder="Computer Science, Engineering, etc."
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddAdvisor}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 font-medium shadow-md"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  {loading ? "Adding..." : "Add Advisor"}
                </button>
              </div>
            </div>
          </div>

          {/* ================= ASSIGN ADVISOR SECTION ================= */}
          <div className="relative">
            <div className="bg-white/10 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00848c]/20 to-transparent px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <UserCheck size={18} className="text-white/80" />
                  <h2 className="font-serif font-semibold text-lg text-white">
                    Assign Advisor to Student
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">
                    Select Student *
                  </label>
                  <div className="relative">
                    <GraduationCap
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] appearance-none cursor-pointer text-white"
                    >
                      <option value="" className="text-white/60">
                        -- Select Student --
                      </option>
                      {students.map((s) => (
                        <option
                          key={s._id}
                          value={s._id}
                          className="text-white"
                        >
                          {s.name} ({s.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  {stats.unassignedStudents > 0 && (
                    <p className="text-xs text-white/50 mt-1">
                      {stats.unassignedStudents} student
                      {stats.unassignedStudents !== 1 ? "s" : ""} without
                      advisor
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">
                    Select Advisor *
                  </label>
                  <div className="relative">
                    <UserCheck
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <select
                      value={selectedAdvisor}
                      onChange={(e) => setSelectedAdvisor(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] appearance-none cursor-pointer text-white"
                    >
                      <option value="" className="text-white/60">
                        -- Select Advisor --
                      </option>
                      {advisors.map((a) => (
                        <option
                          key={a._id}
                          value={a._id}
                          className="text-white"
                        >
                          {a.name} {a.department ? `(${a.department})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAssignAdvisor}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 font-medium shadow-md"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <UserCheck size={16} />
                  )}
                  {loading ? "Assigning..." : "Assign Advisor"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ADVISOR LIST SECTION ================= */}
        <div className="relative mt-6">
          <div className="bg-white/10 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/20 to-transparent px-6 py-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-white/80" />
                  <h2 className="font-serif font-semibold text-lg text-white">
                    Advisor Directory
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-medium">
                  {advisors.length} Total
                </span>
              </div>
            </div>

            <div className="p-6">
              {advisors.length === 0 ? (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-full bg-white/5">
                      <Users size={40} className="text-white/20" />
                    </div>
                    <p className="text-white/50 font-medium">
                      No advisors found
                    </p>
                    <p className="text-sm text-white/30">
                      Add your first advisor using the form above
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {advisors.map((advisor) => (
                    <div
                      key={advisor._id}
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00848c]/20 to-[#fec20f]/20 flex items-center justify-center flex-shrink-0">
                          <UserCheck size={18} className="text-white/80" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {advisor.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="flex items-center gap-1 text-xs text-white/50">
                              <Mail size={10} />
                              {advisor.email}
                            </span>
                            {advisor.department && (
                              <span className="flex items-center gap-1 text-xs text-white/50">
                                <Building2 size={10} />
                                {advisor.department}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteAdvisor(advisor._id)}
                        disabled={deletingId === advisor._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-white/80 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50"
                      >
                        {deletingId === advisor._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        <span className="text-sm font-medium hidden sm:inline">
                          Remove
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityAdvisorDashboard;
