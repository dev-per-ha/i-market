import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Briefcase,
  Building2,
  MapPin,
  Users,
  Calendar,
  Trash2,
  TrendingUp,
  Clock,
  Eye,
} from "lucide-react";

const AdminInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await API.get("/admin/internships");
      setInternships(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteInternship = async (id) => {
    if (!window.confirm("Delete this internship?")) return;

    try {
      await API.delete(`/admin/internships/${id}`);
      fetchInternships();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate statistics (frontend only)
  const stats = {
    total: internships.length,
    totalApplicants: internships.reduce(
      (sum, i) => sum + (i.applicants?.length || 0),
      0,
    ),
    activeInternships: internships.filter(
      (i) => new Date(i.deadline) > new Date(),
    ).length,
    companies: new Set(internships.map((i) => i.company?._id)).size,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 font-mono text-sm">
            Loading internships...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* PREMIUM HEADER */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/10 to-[#fec20f]/5 rounded-3xl blur-xl"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              All Internships
            </h1>
            <p className="text-gray-500 dark:text-white/40 mt-2 font-mono text-sm tracking-wide">
              Manage and monitor all internship postings
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10">
            <TrendingUp size={16} className="text-[#00848c]" />
            <span className="text-sm font-mono text-gray-600 dark:text-white/60">
              {stats.total} total internships
            </span>
          </div>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Internships"
          value={stats.total}
          icon={<Briefcase size={20} />}
          gradient="from-[#00848c] to-[#00848c]/80"
          color="#00848c"
        />
        <StatCard
          title="Total Applicants"
          value={stats.totalApplicants}
          icon={<Users size={20} />}
          gradient="from-[#fec20f] to-[#fec20f]/80"
          color="#fec20f"
        />
        <StatCard
          title="Active Internships"
          value={stats.activeInternships}
          icon={<Clock size={20} />}
          gradient="from-emerald-500 to-emerald-600"
          color="#10b981"
        />
        <StatCard
          title="Companies"
          value={stats.companies}
          icon={<Building2 size={20} />}
          gradient="from-[#1c1f4c] to-[#1c1f4c]/80"
          color="#1c1f4c"
        />
      </div>

      {/* PREMIUM INTERNSHIPS TABLE */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 border border-gray-200/50 dark:border-white/10 overflow-hidden">
          {/* Table Header with stats summary */}
          <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent border-b border-gray-200/50 dark:border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10">
                  <Briefcase size={18} className="text-[#00848c]" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-semibold text-gray-900 dark:text-white">
                    Internship Listings
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-white/40 font-mono">
                    {internships.length} internships • {stats.totalApplicants}{" "}
                    total applicants
                  </p>
                </div>
              </div>
            </div>
          </div>

          {internships.length === 0 ? (
            // Premium Empty State
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                  <Briefcase
                    size={48}
                    className="text-gray-400 dark:text-white/20"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-gray-500 dark:text-white/40 font-medium">
                  No internships found
                </p>
                <p className="text-sm text-gray-400 dark:text-white/20">
                  Internships will appear here when companies post them
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-white/5">
                  <tr className="border-b border-gray-200 dark:border-white/10">
                    <th className="p-4 text-left">
                      <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                        Title
                      </span>
                    </th>
                    <th className="p-4 text-left">
                      <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                        Company
                      </span>
                    </th>
                    <th className="p-4 text-left">
                      <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                        Location
                      </span>
                    </th>
                    <th className="p-4 text-left">
                      <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                        Applicants
                      </span>
                    </th>
                    <th className="p-4 text-left">
                      <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                        Created
                      </span>
                    </th>
                    <th className="p-4 text-left">
                      <span className="text-xs font-mono font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {internships.map((i, index) => (
                    <tr
                      key={i._id}
                      className="border-t border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-200 group/row"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* TITLE with icon */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-[#00848c]/10">
                            <Briefcase size={14} className="text-[#00848c]" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {i.title}
                          </span>
                        </div>
                      </td>

                      {/* COMPANY */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Building2
                            size={14}
                            className="text-gray-400 dark:text-white/30"
                          />
                          <span className="text-gray-700 dark:text-white/80">
                            {i.company?.name || "N/A"}
                          </span>
                        </div>
                      </td>

                      {/* LOCATION */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin
                            size={14}
                            className="text-gray-400 dark:text-white/30"
                          />
                          <span className="text-gray-700 dark:text-white/80">
                            {i.location || "Remote"}
                          </span>
                        </div>
                      </td>

                      {/* APPLICANTS with badge */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Users
                            size={14}
                            className="text-gray-400 dark:text-white/30"
                          />
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              (i.applicants?.length || 0) > 0
                                ? "bg-[#00848c]/10 text-[#00848c]"
                                : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/30"
                            }`}
                          >
                            {i.applicants?.length || 0}
                          </span>
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={14}
                            className="text-gray-400 dark:text-white/30"
                          />
                          <span className="text-gray-600 dark:text-white/60 font-mono text-sm">
                            {new Date(i.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="p-4">
                        <button
                          onClick={() => deleteInternship(i._id)}
                          className="group/btn relative bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500 hover:to-red-600 text-red-600 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5 border border-red-500/30 hover:border-red-500/60"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover/btn:from-red-500/20 transition-all duration-500 rounded-lg"></div>
                          <Trash2 size={14} className="relative z-10" />
                          <span className="relative z-10 text-sm font-medium hidden sm:inline">
                            Delete
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Optional Footer with timestamp */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100/50 dark:bg-white/5">
          <Clock size={12} className="text-gray-400 dark:text-white/30" />
          <span className="text-[10px] font-mono text-gray-400 dark:text-white/30">
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ================= PREMIUM STAT CARD COMPONENT ================= */
const StatCard = ({ title, value, icon, gradient, color }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/30 to-[#fec20f]/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-5 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <div className="text-white">{icon}</div>
        </div>
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

export default AdminInternships;
