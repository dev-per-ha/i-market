import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Users,
  Building2,
  GraduationCap,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  UserCheck,
  UserX,
  Download,
  Eye,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [tab, setTab] = useState("pending");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPending();
    fetchUsers();
    fetchAnalytics();
  }, []);

  const fetchPending = async () => {
    const res = await API.get("/admin/pending");
    setPendingUsers(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setAllUsers(res.data);
  };

  const fetchAnalytics = async () => {
    const res = await API.get("/admin/analytics");
    setAnalytics(res.data);
  };

  const handleApprove = async (id) => {
    await API.put(`/admin/approve/${id}`);
    fetchPending();
    fetchUsers();
  };

  const handleReject = async (id) => {
    await API.put(`/admin/reject/${id}`);
    fetchPending();
  };

  const filteredUsers =
    filter === "all" ? allUsers : allUsers.filter((u) => u.role === filter);

  /* ================= CHART DATA ================= */
  const roleData = analytics
    ? [
        { name: "Students", value: analytics.totalStudents },
        { name: "Companies", value: analytics.totalCompanies },
        { name: "Universities", value: analytics.totalUniversities },
        { name: "Advisors", value: analytics.totalAdvisors },
        { name: "Supervisors", value: analytics.totalSupervisors },
      ]
    : [];

  const applicationData = analytics
    ? [
        {
          name: "Internship Apps",
          value: analytics.totalInternshipApplications,
        },
        {
          name: "University Apps",
          value: analytics.totalUniversityApplications,
        },
      ]
    : [];

  // Color palette for charts (premium)
  const CHART_COLORS = ["#00848c", "#fec20f", "#1c1f4c", "#00a3ad", "#fed954"];

  return (
    <div className="space-y-8">
      {/* PREMIUM HEADER */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/10 to-[#fec20f]/5 rounded-3xl blur-xl"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 dark:text-white/40 mt-2 font-mono text-sm tracking-wide">
              System overview & user management
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10">
            <TrendingUp size={16} className="text-[#00848c]" />
            <span className="text-sm font-mono text-gray-600 dark:text-white/60">
              Live Analytics
            </span>
          </div>
        </div>
      </div>

      {/* ================= ANALYTICS SECTION ================= */}
      {analytics && (
        <>
          {/* PREMIUM STATISTICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            <PremiumCard
              title="Students"
              value={analytics.totalStudents}
              icon={<Users size={20} />}
              gradient="from-[#00848c] to-[#00848c]/80"
              trend="+12%"
            />
            <PremiumCard
              title="Companies"
              value={analytics.totalCompanies}
              icon={<Building2 size={20} />}
              gradient="from-[#fec20f] to-[#fec20f]/80"
              trend="+8%"
            />
            <PremiumCard
              title="Universities"
              value={analytics.totalUniversities}
              icon={<GraduationCap size={20} />}
              gradient="from-[#1c1f4c] to-[#1c1f4c]/80"
              trend="+5%"
            />
            <PremiumCard
              title="Advisors"
              value={analytics.totalAdvisors}
              icon={<UserCheck size={20} />}
              gradient="from-[#00a3ad] to-[#00a3ad]/80"
              trend="+3%"
            />
            <PremiumCard
              title="Supervisors"
              value={analytics.totalSupervisors}
              icon={<Users size={20} />}
              gradient="from-[#fed954] to-[#fed954]/80"
              trend="+7%"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <PremiumCard
              title="Internships"
              value={analytics.totalInternships}
              icon={<FileText size={20} />}
              gradient="from-[#00848c] to-[#00848c]/80"
            />
            <PremiumCard
              title="Internship Apps"
              value={analytics.totalInternshipApplications}
              icon={<FileText size={20} />}
              gradient="from-[#fec20f] to-[#fec20f]/80"
            />
            <PremiumCard
              title="University Apps"
              value={analytics.totalUniversityApplications}
              icon={<FileText size={20} />}
              gradient="from-[#1c1f4c] to-[#1c1f4c]/80"
            />
            <PremiumCard
              title="Total Applications"
              value={analytics.totalApplications}
              icon={<TrendingUp size={20} />}
              gradient="from-[#00848c] to-[#fec20f]"
              isLarge
            />
          </div>

          {/* ================= PREMIUM CHARTS ================= */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* PIE CHART CARD */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10">
                      <PieChartIcon size={20} className="text-[#00848c]" />
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white">
                      User Distribution
                    </h3>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={roleData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={110}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={{ stroke: "#666", strokeWidth: 1 }}
                    >
                      {roleData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                          stroke="rgba(255,255,255,0.5)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(28, 31, 76, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "white",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BAR CHART CARD */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10">
                      <BarChartIcon size={20} className="text-[#00848c]" />
                    </div>
                    <h3 className="text-lg font-serif font-semibold text-gray-900 dark:text-white">
                      Applications Overview
                    </h3>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={applicationData}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      axisLine={{ stroke: "#E5E7EB" }}
                    />
                    <YAxis
                      tick={{ fill: "#6B7280", fontSize: 12 }}
                      axisLine={{ stroke: "#E5E7EB" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(28, 31, 76, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "white",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#00848c"
                      radius={[8, 8, 0, 0]}
                      barSize={60}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= PREMIUM TABS ================= */}
      <div className="flex gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
        <PremiumTabBtn
          active={tab === "pending"}
          onClick={() => setTab("pending")}
          icon={<Clock size={16} />}
        >
          Pending Requests
          {pendingUsers.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#fec20f] text-[#1c1f4c] font-bold">
              {pendingUsers.length}
            </span>
          )}
        </PremiumTabBtn>
        <PremiumTabBtn
          active={tab === "users"}
          onClick={() => setTab("users")}
          icon={<Users size={16} />}
        >
          All Users
        </PremiumTabBtn>
      </div>

      {/* ================= PENDING USERS SECTION ================= */}
      {tab === "pending" && (
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                    <UserCheck
                      size={48}
                      className="text-gray-400 dark:text-white/20"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-gray-500 dark:text-white/40 font-medium">
                    No pending requests
                  </p>
                  <p className="text-sm text-gray-400 dark:text-white/20">
                    All users have been reviewed
                  </p>
                </div>
              </div>
            </div>
          ) : (
            pendingUsers.map((user, index) => (
              <div
                key={user._id}
                className="relative group hover:scale-[1.01] transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex gap-5 items-start">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-full blur-md opacity-50"></div>
                        <div className="relative w-14 h-14 bg-gradient-to-br from-[#00848c] to-[#00848c]/80 flex items-center justify-center rounded-full shadow-lg">
                          <span className="text-white font-bold text-xl">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-serif font-semibold text-xl text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-gray-500 dark:text-white/60 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00848c]"></span>
                          {user.email}
                        </p>
                        <p className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#fec20f]/10 text-[#fec20f] text-xs font-mono capitalize">
                          <Clock size={10} />
                          {user.role}
                        </p>
                        {user.document && (
                          <p className="mt-2">
                            <a
                              href={`http://localhost:5000/${user.document}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#00848c] hover:text-[#fec20f] transition-colors"
                            >
                              <Eye size={12} />
                              View Uploaded Document
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(user._id)}
                        className="group/btn relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-lg shadow-emerald-500/25"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                        <CheckCircle size={16} className="relative z-10" />
                        <span className="relative z-10 font-medium">
                          Approve
                        </span>
                      </button>
                      <button
                        onClick={() => handleReject(user._id)}
                        className="group/btn relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-lg shadow-red-500/25"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                        <XCircle size={16} className="relative z-10" />
                        <span className="relative z-10 font-medium">
                          Reject
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= USERS TABLE SECTION ================= */}
      {tab === "users" && (
        <>
          {/* Premium Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {["all", "student", "company", "university"].map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === r
                    ? "bg-gradient-to-r from-[#00848c] to-[#00848c]/80 text-white shadow-lg shadow-[#00848c]/25"
                    : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10"
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          {/* Premium Users Table */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 dark:bg-white/5">
                    <tr className="border-b border-gray-200 dark:border-white/10">
                      <th className="p-4 text-left">
                        <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                          User
                        </span>
                      </th>
                      <th className="p-4 text-left">
                        <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                          Email
                        </span>
                      </th>
                      <th className="p-4 text-left">
                        <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                          Role
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
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                              <Users
                                size={32}
                                className="text-gray-400 dark:text-white/20"
                              />
                            </div>
                            <p className="text-gray-500 dark:text-white/40 font-medium">
                              No users found
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, index) => (
                        <tr
                          key={u._id}
                          className="border-t border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-200"
                          style={{ animationDelay: `${index * 20}ms` }}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                                <span className="text-[#00848c] font-bold">
                                  {u.name?.[0]?.toUpperCase() || "U"}
                                </span>
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {u.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 dark:text-white/70 font-mono text-sm">
                            {u.email}
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#00848c]/10 text-[#00848c] text-xs font-mono capitalize">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                              <CheckCircle size={10} />
                              {u.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ================= PREMIUM CARD COMPONENT ================= */
const PremiumCard = ({ title, value, icon, gradient, trend, isLarge }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/30 to-[#fec20f]/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div
      className={`relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-5 hover:shadow-2xl transition-all duration-300 ${isLarge ? "lg:col-span-2" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <div className="text-white">{icon}</div>
        </div>
        {trend && (
          <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
            ↑ {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
        {value?.toLocaleString() || 0}
      </h3>
      <p className="text-sm text-gray-500 dark:text-white/40 mt-1 font-medium">
        {title}
      </p>
    </div>
  </div>
);

/* ================= PREMIUM TAB BUTTON ================= */
const PremiumTabBtn = ({ children, active, icon, ...props }) => (
  <button
    {...props}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-[#00848c] to-[#00848c]/80 text-white shadow-lg shadow-[#00848c]/25"
        : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10"
    }`}
  >
    {icon}
    {children}
  </button>
);

export default AdminDashboard;
