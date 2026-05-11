import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import {
  Users,
  User,
  Mail,
  GraduationCap,
  UserCheck,
  UserX,
  Building2,
  Search,
  Filter,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

const UniversityStudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAdvisor, setFilterAdvisor] = useState("all"); // all, assigned, unassigned

  // ================= FETCH STUDENTS =================
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/university/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term and advisor filter
  const filteredStudents = students.filter((student) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchTerm.toLowerCase());

    // Advisor filter
    const matchesAdvisorFilter =
      filterAdvisor === "all" ||
      (filterAdvisor === "assigned" && student.advisor) ||
      (filterAdvisor === "unassigned" && !student.advisor);

    return matchesSearch && matchesAdvisorFilter;
  });

  // Statistics from real data
  const stats = {
    total: students.length,
    assigned: students.filter((s) => s.advisor).length,
    unassigned: students.filter((s) => !s.advisor).length,
    departments: new Set(students.map((s) => s.department).filter(Boolean))
      .size,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-white/70 text-sm">Loading students...</p>
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
              <Users size={20} className="text-white" />
            </div>
            <div>
              {/* ✅ CHANGED: White text */}
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                University Students
              </h1>
              {/* ✅ CHANGED: White text with opacity */}
              <p className="text-sm text-white/60 mt-1">
                Manage and monitor student information
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
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <span className="text-xs font-medium text-white/80">
                {stats.assigned} Assigned
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30">
              <span className="text-xs font-medium text-white/80">
                {stats.unassigned} Unassigned
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2">
            <AlertCircle size={16} className="text-white/80" />
            <span className="text-sm text-white/80">{error}</span>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] focus:border-transparent transition-all duration-200 text-white placeholder:text-white/30"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterAdvisor("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filterAdvisor === "all"
                  ? "bg-gradient-to-r from-[#00848c] to-[#00848c]/80 text-white shadow-lg shadow-[#00848c]/25"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterAdvisor("assigned")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filterAdvisor === "assigned"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <UserCheck size={14} className="inline mr-1" />
              Assigned
            </button>
            <button
              onClick={() => setFilterAdvisor("unassigned")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filterAdvisor === "unassigned"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <UserX size={14} className="inline mr-1" />
              Unassigned
            </button>
          </div>
        </div>

        {/* Students Grid */}
        {students.length === 0 ? (
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-white/5">
                  <Users
                    size={48}
                    className="text-white/20"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-white/50 font-medium">No students found</p>
                <p className="text-sm text-white/30">
                  Students will appear here when they register
                </p>
              </div>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-white/5">
                <Search size={48} className="text-white/20" />
              </div>
              <p className="text-white/50 font-medium">No matching students</p>
              <p className="text-sm text-white/30">
                Try adjusting your search or filter
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((student, index) => (
              <div
                key={student._id}
                className="group relative bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Student Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00848c]/20 to-[#fec20f]/20 flex items-center justify-center">
                          <span className="text-white/80 font-bold text-lg">
                            {student.name?.[0]?.toUpperCase() || "S"}
                          </span>
                        </div>
                        <div>
                          {/* ✅ CHANGED: White text */}
                          <h3 className="font-serif font-bold text-lg text-white">
                            {student.name || "Unknown Student"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="flex items-center gap-1 text-xs text-white/50">
                              <Mail size={12} />
                              {student.email || "No email"}
                            </span>
                            {student.department && (
                              <span className="flex items-center gap-1 text-xs text-white/50">
                                <Building2 size={12} />
                                {student.department}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      {student.phone && (
                        <p className="text-sm text-white/60 mt-2 ml-14">
                          📞 {student.phone}
                        </p>
                      )}
                    </div>

                    {/* Advisor Info */}
                    <div
                      className={`p-3 rounded-xl min-w-[180px] text-center ${
                        student.advisor
                          ? "bg-emerald-500/20 border border-emerald-500/30"
                          : "bg-amber-500/20 border border-amber-500/30"
                      }`}
                    >
                      {student.advisor ? (
                        <>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <UserCheck size={14} className="text-white/80" />
                            <p className="text-white/80 font-medium text-sm">
                              Assigned Advisor
                            </p>
                          </div>
                          <p className="font-semibold text-white text-sm">
                            {student.advisor.name}
                          </p>
                          <p className="text-xs text-white/50 mt-1">
                            {student.advisor.email}
                          </p>
                          {student.advisor.department && (
                            <p className="text-xs text-white/50 mt-1">
                              {student.advisor.department}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <UserX size={14} className="text-white/80" />
                            <p className="text-white/80 font-medium text-sm">
                              No Advisor Assigned
                            </p>
                          </div>
                          <p className="text-xs text-white/50 mt-2">
                            Student needs advisor assignment
                          </p>
                        </>
                      )}
                    </div>

                    {/* Arrow indicator on hover */}
                    <ChevronRight
                      size={16}
                      className="text-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0 hidden sm:block"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats Footer */}
        {students.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-3 text-center border border-white/20">
              <Users size={16} className="text-white/80 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-white/50">Total Students</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center border border-white/20">
              <GraduationCap size={16} className="text-white/80 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">
                {stats.departments}
              </p>
              <p className="text-xs text-white/50">Departments</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center border border-white/20">
              <UserCheck size={16} className="text-white/80 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">
                {stats.total > 0
                  ? Math.round((stats.assigned / stats.total) * 100)
                  : 0}
                %
              </p>
              <p className="text-xs text-white/50">Assignment Rate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityStudentDashboard;
