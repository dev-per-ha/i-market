import React, { useEffect, useState } from "react";
import API from "../../../services/api";
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
  Legend,
} from "recharts";
import {
  Briefcase,
  Users,
  FileText,
  UserCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
} from "lucide-react";

const COLORS = ["#fec20f", "#00848c", "#ef4444"];

const CompanyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await API.get("/company/dashboard");
      setData(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Calculate approval rate from real data
  const calculateApprovalRate = () => {
    if (!data?.applicationStats) return 0;
    const { approved, pending, rejected } = data.applicationStats;
    const total = approved + pending + rejected;
    if (total === 0) return 0;
    return Math.round((approved / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 text-sm">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-3 px-4 py-2 bg-[#00848c] text-white rounded-lg hover:bg-[#006b72] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pieData = [
    {
      name: "Pending",
      value: data.applicationStats?.pending || 0,
      color: COLORS[0],
    },
    {
      name: "Approved",
      value: data.applicationStats?.approved || 0,
      color: COLORS[1],
    },
    {
      name: "Rejected",
      value: data.applicationStats?.rejected || 0,
      color: COLORS[2],
    },
  ].filter((item) => item.value > 0);

  const approvalRate = calculateApprovalRate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                Company Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                Overview of your internship ecosystem
              </p>
            </div>
          </div>

          {/* Approval Rate Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10">
            <TrendingUp size={16} className="text-[#00848c]" />
            <span className="text-sm font-mono text-gray-600 dark:text-white/60">
              Approval Rate: {approvalRate}%
            </span>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Active Internships"
            value={data.totalInternships || 0}
            icon={<Briefcase size={20} />}
            gradient="from-[#00848c] to-[#00848c]/80"
            trend={data.totalInternships > 0 ? "+ Active" : "0"}
          />
          <StatCard
            title="Total Applications"
            value={data.totalApplications || 0}
            icon={<FileText size={20} />}
            gradient="from-[#fec20f] to-[#fec20f]/80"
          />
          <StatCard
            title="Students Applied"
            value={data.totalStudents || 0}
            icon={<Users size={20} />}
            gradient="from-[#1c1f4c] to-[#1c1f4c]/80"
          />
          <StatCard
            title="Supervisors"
            value={data.supervisorCount || 0}
            icon={<UserCheck size={20} />}
            gradient="from-emerald-500 to-emerald-600"
          />
        </div>

        {/* Application Status Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 text-center border border-amber-200 dark:border-amber-500/20">
            <Clock
              size={18}
              className="text-amber-600 dark:text-amber-400 mx-auto mb-1"
            />
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
              {data.applicationStats?.pending || 0}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400/70">
              Pending Review
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 text-center border border-emerald-200 dark:border-emerald-500/20">
            <CheckCircle
              size={18}
              className="text-emerald-600 dark:text-emerald-400 mx-auto mb-1"
            />
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {data.applicationStats?.approved || 0}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400/70">
              Approved
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-4 text-center border border-red-200 dark:border-red-500/20">
            <XCircle
              size={18}
              className="text-red-600 dark:text-red-400 mx-auto mb-1"
            />
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">
              {data.applicationStats?.rejected || 0}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400/70">
              Rejected
            </p>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* PIE CHART - Application Status */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-[#00848c]/10">
                  <PieChart size={16} className="text-[#00848c]" />
                </div>
                <h3 className="font-serif font-semibold text-gray-900 dark:text-white">
                  Application Status Distribution
                </h3>
              </div>

              {pieData.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  No application data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={{ stroke: "#666", strokeWidth: 1 }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="rgba(255,255,255,0.3)"
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
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span className="text-gray-600 dark:text-white/60 text-sm">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* BAR CHART - Internships vs Applicants */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-[#00848c]/10">
                  <BarChart size={16} className="text-[#00848c]" />
                </div>
                <h3 className="font-serif font-semibold text-gray-900 dark:text-white">
                  Internships vs Applicants
                </h3>
              </div>

              {!data.internshipStats || data.internshipStats.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-gray-400">
                  No internship data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.internshipStats}>
                    <XAxis
                      dataKey="title"
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                      axisLine={{ stroke: "#E5E7EB" }}
                      angle={-25}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fill: "#6B7280", fontSize: 11 }}
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
                      dataKey="applicants"
                      fill="#00848c"
                      radius={[8, 8, 0, 0]}
                      label={{ position: "top", fill: "#00848c", fontSize: 11 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[#00848c]">
              {data.totalInternships || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/40">
              Total Internship Posts
            </p>
          </div>
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[#fec20f]">
              {data.totalApplications || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/40">
              Total Applications Received
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= PREMIUM STAT CARD ================= */
const StatCard = ({ title, value, icon, gradient, trend }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/30 to-[#fec20f]/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-5 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <div className="text-white">{icon}</div>
        </div>
        {trend && (
          <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
            {trend}
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

export default CompanyDashboard;
