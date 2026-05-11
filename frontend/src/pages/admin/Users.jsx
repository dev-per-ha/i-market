import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Users as UsersIcon,
  UserCheck,
  Mail,
  CheckCircle,
  Clock,
  TrendingUp,
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  GraduationCap,
  Sparkles,
  UserPlus,
  UserX,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();

    const savedState = localStorage.getItem("sidebarCollapsed");

    if (savedState !== null) {
      setSidebarCollapsed(savedState === "true");
    }

    const handleSidebarToggle = (event) => {
      setSidebarCollapsed(event.detail?.collapsed || false);
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);

    return () =>
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
  }, []);

  const fetchUsers = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setActionLoading(`delete-${id}`);
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const approveUser = async (id) => {
    setActionLoading(`approve-${id}`);
    try {
      await API.put(`/admin/users/${id}`, {
        status: "approved",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // FILTER USERS
  const filtered =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  // SEARCH USERS
  const searchedUsers = searchTerm
    ? filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : filtered;

  // PAGINATION
  const totalPages = Math.ceil(searchedUsers.length / itemsPerPage);

  const paginatedUsers = searchedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // STATS
  const stats = {
    total: users.length,
    students: users.filter((u) => u.role === "student").length,
    companies: users.filter((u) => u.role === "company").length,
    universities: users.filter((u) => u.role === "university").length,
    advisors: users.filter((u) => u.role === "advisor").length,
    supervisors: users.filter((u) => u.role === "supervisor").length,
    pending: users.filter((u) => u.status !== "approved").length,
    approved: users.filter((u) => u.status === "approved").length,
  };

  // ROLE BADGE
  const getRoleBadge = (role) => {
    const configs = {
      student: {
        bg: "bg-[#00c4cf]/15",
        text: "text-[#00c4cf]",
        border: "border-[#00c4cf]/20",
        icon: <UsersIcon size={9} />,
      },
      company: {
        bg: "bg-[#fec20f]/15",
        text: "text-[#fec20f]",
        border: "border-[#fec20f]/20",
        icon: <Building2 size={9} />,
      },
      university: {
        bg: "bg-white/10",
        text: "text-white/70",
        border: "border-white/10",
        icon: <GraduationCap size={9} />,
      },
      advisor: {
        bg: "bg-purple-500/15",
        text: "text-purple-300",
        border: "border-purple-500/20",
        icon: <UserCheck size={9} />,
      },
      supervisor: {
        bg: "bg-emerald-500/15",
        text: "text-emerald-300",
        border: "border-emerald-500/20",
        icon: <UserCheck size={9} />,
      },
    };

    return (
      configs[role] || {
        bg: "bg-gray-500/15",
        text: "text-gray-300",
        border: "border-gray-500/20",
        icon: <UsersIcon size={9} />,
      }
    );
  };

  return (
    <div
      className={`
        transition-all duration-300
        min-h-screen bg-gradient-to-br from-[#1a1c4e] to-[#232558]
        ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}
      `}
    >
      <div className="p-4 md:p-5 lg:p-6">
        {/* MAIN CARD */}
        <div className="w-full rounded-3xl border border-white/10 bg-[#232558]/50 backdrop-blur-sm overflow-hidden shadow-2xl">
          {/* HEADER SECTION */}
          <div className="p-4 md:p-5 lg:p-6 space-y-5">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00a8b5] to-[#00848c] shadow-lg">
                  <UsersIcon size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                    User Management
                  </h1>
                  <p className="text-white/40 text-sm mt-0.5">
                    Manage and monitor all platform users
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 w-fit hover:bg-white/10 transition-all duration-300 group">
                <TrendingUp
                  size={14}
                  className="text-[#00c4cf] group-hover:scale-110 transition-transform"
                />
                <span className="text-sm text-white/70 font-medium">
                  {stats.total} total users
                </span>
              </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
              <StatCard
                title="Total"
                value={stats.total}
                icon={<UsersIcon size={12} />}
              />
              <StatCard
                title="Students"
                value={stats.students}
                icon={<UsersIcon size={12} />}
              />
              <StatCard
                title="Companies"
                value={stats.companies}
                icon={<Building2 size={12} />}
              />
              <StatCard
                title="Universities"
                value={stats.universities}
                icon={<GraduationCap size={12} />}
              />
              <StatCard
                title="Advisors"
                value={stats.advisors}
                icon={<UserCheck size={12} />}
              />
              <StatCard
                title="Supervisors"
                value={stats.supervisors}
                icon={<UserCheck size={12} />}
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                icon={<Clock size={12} />}
              />
              <StatCard
                title="Approved"
                value={stats.approved}
                icon={<CheckCircle size={12} />}
              />
            </div>

            {/* SEARCH + FILTER */}
            <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
              {/* SEARCH */}
              <div className="relative w-full xl:max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 transition-all duration-200"
                />

                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00c4cf]/40 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* FILTER BUTTONS */}
              <div className="w-full xl:w-auto">
                <div className="flex flex-wrap gap-2">
                  {[
                    "all",
                    "student",
                    "company",
                    "university",
                    "advisor",
                    "supervisor",
                  ].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setFilter(r);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all duration-300 ${
                        filter === r
                          ? "bg-gradient-to-r from-[#00a8b5] to-[#00848c] text-white shadow-lg shadow-[#00a8b5]/25 scale-[1.02]"
                          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                      }`}
                    >
                      {r === "all" ? "All Users" : r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* TABLE SECTION - NO HORIZONTAL SCROLL */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-white/5 border-y border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] text-white/50 font-semibold uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] text-white/50 font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] text-white/50 font-semibold uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] text-white/50 font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] text-white/50 font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-white/5">
                          <UsersIcon size={32} className="text-white/20" />
                        </div>
                        <p className="text-white/40 text-sm">No users found</p>
                        <p className="text-white/20 text-xs">
                          {searchTerm
                            ? "Try adjusting your search"
                            : "Users will appear here when they register"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((u, index) => {
                    const roleBadge = getRoleBadge(u.role);
                    const isLoading =
                      actionLoading === `approve-${u._id}` ||
                      actionLoading === `delete-${u._id}`;

                    return (
                      <tr
                        key={u._id}
                        className="border-b border-white/5 hover:bg-white/[0.04] transition-all duration-200 group"
                      >
                        {/* USER */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00a8b5]/30 to-[#fec20f]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                              <span className="text-white text-[11px] font-bold">
                                {u.name?.[0]?.toUpperCase() || "U"}
                              </span>
                            </div>
                            <span className="text-sm text-white font-medium truncate max-w-[120px]">
                              {u.name}
                            </span>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Mail
                              size={11}
                              className="text-white/30 flex-shrink-0 group-hover:text-white/50 transition-colors"
                            />
                            <span className="text-sm text-white/60 truncate max-w-[160px]">
                              {u.email}
                            </span>
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}
                          >
                            {roleBadge.icon}
                            {u.role === "supervisor"
                              ? "Supervisor"
                              : u.role === "university"
                                ? "University"
                                : u.role}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              u.status === "approved"
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                                : "bg-orange-500/15 text-orange-300 border border-orange-500/20"
                            }`}
                          >
                            {u.status === "approved" ? (
                              <CheckCircle size={8} />
                            ) : (
                              <Clock size={8} />
                            )}
                            {u.status === "approved" ? "Approved" : "Pending"}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {u.status !== "approved" && (
                              <button
                                onClick={() => approveUser(u._id)}
                                disabled={isLoading}
                                className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white text-[10px] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                              >
                                {actionLoading === `approve-${u._id}` ? (
                                  <div className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle size={9} />
                                )}
                                Approve
                              </button>
                            )}

                            <button
                              onClick={() => deleteUser(u._id)}
                              disabled={isLoading}
                              className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-[10px] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {actionLoading === `delete-${u._id}` ? (
                                <div className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <UserX size={9} />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 p-4 border-t border-white/10 bg-white/5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft size={14} className="text-white/60" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-[#00a8b5] to-[#00848c] text-white"
                          : "text-white/50 hover:bg-white/10"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight size={14} className="text-white/60" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-2xl p-3 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-default">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <div className="text-white/40 group-hover:text-[#00c4cf] transition-colors">
          {icon}
        </div>
        <p className="text-xl font-bold text-white group-hover:text-[#00c4cf] transition-colors">
          {value?.toLocaleString() || 0}
        </p>
      </div>
      <p className="text-[9px] uppercase tracking-wider text-white/40 font-medium">
        {title}
      </p>
    </div>
  );
};

export default Users;
