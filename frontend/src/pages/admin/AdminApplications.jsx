import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Building2,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const AdminApplications = () => {
  const [data, setData] = useState({
    internshipApplications: [],
    universityApplications: [],
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/admin/applications");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Helper function for status styling
  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle size={12} />,
          bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
          text: "text-white",
          label: "Approved",
        };
      case "rejected":
        return {
          icon: <XCircle size={12} />,
          bg: "bg-gradient-to-r from-red-500 to-red-600",
          text: "text-white",
          label: "Rejected",
        };
      default:
        return {
          icon: <Clock size={12} />,
          bg: "bg-gradient-to-r from-[#fec20f] to-[#fec20f]/80",
          text: "text-[#1c1f4c]",
          label: "Pending",
        };
    }
  };

  // Statistics calculations (frontend only)
  const internshipStats = {
    total: data.internshipApplications.length,
    approved: data.internshipApplications.filter((a) => a.status === "approved")
      .length,
    pending: data.internshipApplications.filter((a) => a.status === "pending")
      .length,
    rejected: data.internshipApplications.filter((a) => a.status === "rejected")
      .length,
  };

  const universityStats = {
    total: data.universityApplications.length,
    approved: data.universityApplications.filter((a) => a.status === "approved")
      .length,
    pending: data.universityApplications.filter((a) => a.status === "pending")
      .length,
    rejected: data.universityApplications.filter((a) => a.status === "rejected")
      .length,
  };

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/10 to-[#fec20f]/5 rounded-3xl blur-xl"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              Application Managment
            </h1>
            <p className="text-gray-500 dark:text-white/40 mt-2 font-mono text-sm tracking-wide">
              Monitor and manage all internship & university applications
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10">
            <TrendingUp size={16} className="text-[#00848c]" />
            <span className="text-sm font-mono text-gray-600 dark:text-white/60">
              Total: {internshipStats.total + universityStats.total}{" "}
              applications
            </span>
          </div>
        </div>
      </div>

      {/* ================= INTERNSHIP APPLICATIONS ================= */}
      <div className="relative group">
        {/* Decorative glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 border border-gray-200/50 dark:border-white/10 overflow-hidden">
          {/* Section Header with Stats */}
          <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent border-b border-gray-200/50 dark:border-white/10 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
                  <Briefcase
                    size={20}
                    className="text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-white">
                    Internship Applications
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-white/40 font-mono">
                    Student internship submissions
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    ✓ {internshipStats.approved}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#fec20f]/10 border border-[#fec20f]/20">
                  <span className="text-xs font-mono text-[#fec20f]">
                    ⏱ {internshipStats.pending}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <span className="text-xs font-mono text-red-600 dark:text-red-400">
                    ✗ {internshipStats.rejected}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 dark:bg-white/5">
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="p-4 text-left">
                    <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                      Student
                    </span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                      Internship
                    </span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                      Company
                    </span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                      Status
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.internshipApplications.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                          <Briefcase
                            size={32}
                            className="text-gray-400 dark:text-white/20"
                            strokeWidth={1.5}
                          />
                        </div>
                        <p className="text-gray-500 dark:text-white/40 font-medium">
                          No internship applications yet
                        </p>
                        <p className="text-sm text-gray-400 dark:text-white/20">
                          Applications will appear here when students submit
                          them
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.internshipApplications.map((a, index) => {
                    const statusConfig = getStatusConfig(a.status);
                    return (
                      <tr
                        key={a._id}
                        className="border-t border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-200 group/row"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                              <Users size={14} className="text-[#00848c]" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {a.student?.name || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <BookOpen
                              size={14}
                              className="text-gray-400 dark:text-white/30"
                            />
                            <span className="text-gray-700 dark:text-white/80">
                              {a.internship?.title || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2
                              size={14}
                              className="text-gray-400 dark:text-white/30"
                            />
                            <span className="text-gray-700 dark:text-white/80">
                              {a.internship?.company?.name || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} shadow-sm`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= UNIVERSITY APPLICATIONS ================= */}
      <div className="relative group mt-8">
        {/* Decorative glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 border border-gray-200/50 dark:border-white/10 overflow-hidden">
          {/* Section Header with Stats */}
          <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent border-b border-gray-200/50 dark:border-white/10 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
                  <GraduationCap
                    size={20}
                    className="text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-white">
                    University Applications
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-white/40 font-mono">
                    Student university enrollment requests
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    ✓ {universityStats.approved}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-[#fec20f]/10 border border-[#fec20f]/20">
                  <span className="text-xs font-mono text-[#fec20f]">
                    ⏱ {universityStats.pending}
                  </span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <span className="text-xs font-mono text-red-600 dark:text-red-400">
                    ✗ {universityStats.rejected}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 dark:bg-white/5">
                <tr className="border-b border-gray-200 dark:border-white/10">
                  <th className="p-4 text-left">
                    <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                      Student
                    </span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                      University
                    </span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                      Department
                    </span>
                  </th>
                  <th className="p-4 text-left">
                    <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                      Status
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.universityApplications.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                          <GraduationCap
                            size={32}
                            className="text-gray-400 dark:text-white/20"
                            strokeWidth={1.5}
                          />
                        </div>
                        <p className="text-gray-500 dark:text-white/40 font-medium">
                          No university applications yet
                        </p>
                        <p className="text-sm text-gray-400 dark:text-white/20">
                          Applications will appear here when students submit
                          them
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.universityApplications.map((a, index) => {
                    const statusConfig = getStatusConfig(a.status);
                    return (
                      <tr
                        key={a._id}
                        className="border-t border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-200 group/row"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                              <Users size={14} className="text-[#00848c]" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {a.student?.name || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2
                              size={14}
                              className="text-gray-400 dark:text-white/30"
                            />
                            <span className="text-gray-700 dark:text-white/80">
                              {a.university?.name || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <BookOpen
                              size={14}
                              className="text-gray-400 dark:text-white/30"
                            />
                            <span className="text-gray-700 dark:text-white/80">
                              {a.department || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} shadow-sm`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApplications;
