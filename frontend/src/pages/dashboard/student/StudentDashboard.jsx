import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";
import {
  User,
  UserCheck,
  MessageCircle,
  Users,
  Plus,
  FileText,
  ChevronRight,
  GraduationCap,
  Mail,
  Building2,
} from "lucide-react";

const StudentDashboard = () => {
  const [advisor, setAdvisor] = useState(null);
  const [supervisor, setSupervisor] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setFetching(true);
      await Promise.all([fetchConnections(), fetchGroups()]);
      setFetching(false);
    };
    loadData();
  }, []);

  // ================= CONNECTIONS =================
  const fetchConnections = async () => {
    try {
      const res = await API.get("/student/connections");
      setAdvisor(res.data?.advisor || null);
      setSupervisor(res.data?.supervisor || null);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= GROUPS =================
  const fetchGroups = async () => {
    try {
      const res = await API.get("/chat");
      const myGroups = res.data.filter((chat) => chat.isGroup);
      setGroups(myGroups);
    } catch (err) {
      console.error(err);
    }
  };

  const createGroupChat = async () => {
    if (!advisor || !supervisor) {
      alert(
        "Both an advisor and supervisor are required to create a group chat",
      );
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/chat/group", {
        advisorId: advisor._id,
        supervisorId: supervisor._id,
      });
      setGroups((prev) => [res.data, ...prev]);
      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create group chat");
    } finally {
      setLoading(false);
    }
  };

  // ================= 1-TO-1 CHAT =================
  const startChat = async (userId) => {
    try {
      const res = await API.post("/chat/access", { userId });
      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to start chat");
    }
  };

  if (fetching) {
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

  return (
 <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              Student Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
              Manage your connections, chats, and reports
            </p>
          </div>
        </div>

        {/* STATS SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-white/10 p-4 text-center">
            <User size={18} className="text-[#00848c] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {advisor ? 1 : 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/40">
              Advisor Assigned
            </p>
          </div>
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-white/10 p-4 text-center">
            <UserCheck size={18} className="text-[#00848c] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {supervisor ? 1 : 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/40">
              Supervisor Assigned
            </p>
          </div>
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-white/10 p-4 text-center">
            <Users size={18} className="text-[#00848c] mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {groups.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/40">
              Active Group Chats
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* ================= ADVISOR CARD ================= */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-5 py-4 border-b border-gray-200/50 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-[#00848c]" />
                  <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                    Academic Advisor
                  </h2>
                </div>
              </div>


              <div className="p-5">
                {advisor ? (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                        <span className="text-[#00848c] font-bold text-xl">
                          {advisor.name?.[0]?.toUpperCase() || "A"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                          {advisor.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-white/40 flex items-center gap-1">
                          <Mail size={12} />
                          {advisor.email}
                        </p>
                      </div>
                    </div>

                    {advisor.department && (
                      <p className="text-sm text-gray-600 dark:text-white/60 flex items-center gap-2 mb-3">
                        <Building2 size={14} className="text-gray-400" />
                        {advisor.department}
                      </p>
                    )}

                    <button
                      onClick={() => startChat(advisor._id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 shadow-md"
                    >
                      <MessageCircle size={16} />
                      Message Advisor
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                      <User
                        size={28}
                        className="text-gray-400 dark:text-white/20"
                      />
                    </div>
                    <p className="text-gray-500 dark:text-white/40 font-medium">
                      No advisor assigned
                    </p>
                    <p className="text-xs text-gray-400 dark:text-white/20 mt-1">
                      An advisor will be assigned to you soon
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= SUPERVISOR CARD ================= */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-5 py-4 border-b border-gray-200/50 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <UserCheck size={18} className="text-[#00848c]" />
                  <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                    Supervisor
                  </h2>
                </div>
              </div>


              <div className="p-5">
                {supervisor ? (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#fec20f]/10 to-amber-500/10 flex items-center justify-center">
                        <span className="text-[#fec20f] font-bold text-xl">
                          {supervisor.name?.[0]?.toUpperCase() || "S"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                          {supervisor.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-white/40 flex items-center gap-1">
                          <Mail size={12} />
                          {supervisor.email}
                        </p>
                      </div>
                    </div>

                    {supervisor.department && (
                      <p className="text-sm text-gray-600 dark:text-white/60 flex items-center gap-2 mb-3">
                        <Building2 size={14} className="text-gray-400" />
                        {supervisor.department}
                      </p>
                    )}

                    <button
                      onClick={() => startChat(supervisor._id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#fec20f] to-amber-500 text-[#1c1f4c] hover:from-[#00848c] hover:to-[#006b72] hover:text-white transition-all duration-300 shadow-md"
                    >
                      <MessageCircle size={16} />
                      Message Supervisor
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                      <UserCheck
                        size={28}
                        className="text-gray-400 dark:text-white/20"
                      />
                    </div>
                    <p className="text-gray-500 dark:text-white/40 font-medium">
                      No supervisor assigned
                    </p>
                    <p className="text-xs text-gray-400 dark:text-white/20 mt-1">
                      A supervisor will be assigned based on your internship
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= GROUP CHAT SECTION ================= */}
        <div className="relative group mt-6">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-5 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[#00848c]" />
                  <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                    Group Chat
                  </h2>
                </div>


                {advisor && supervisor && (
                  <button
                    onClick={createGroupChat}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 text-sm"
                  >
                    {loading ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Plus size={14} />
                    )}
                    Create Group
                  </button>
                )}
              </div>
            </div>

            <div className="p-5">
              {groups.length > 0 ? (
                <div className="space-y-2">
                  {groups.map((group) => (
                    <div
                      key={group._id}
                      onClick={() => navigate(`/chat/${group._id}`)}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-all duration-200 group/item"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                          <Users size={16} className="text-[#00848c]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {group.groupName || "Internship Group"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {group.members?.length || 3} members
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
                    <Users
                      size={28}
                      className="text-gray-400 dark:text-white/20"
                    />
                  </div>
                  <p className="text-gray-500 dark:text-white/40 font-medium">
                    No group chats yet
                  </p>
                  <p className="text-xs text-gray-400 dark:text-white/20 mt-1">
                    {advisor && supervisor
                      ? "Click 'Create Group' to start a conversation with your advisor and supervisor"
                      : "You need both an advisor and supervisor to create a group chat"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* ================= REPORTS SECTION ================= */}
        <div className="relative group mt-6">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-5 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#00848c]" />
                <h2 className="font-serif font-semibold text-lg text-white">
                  Weekly Reports
                </h2>
              </div>
            </div>

            <div className="p-5">
              <p className="text-gray-600 dark:text-white/70 mb-4">
                Track your internship progress by submitting and reviewing
                weekly reports.
              </p>
              <button
                onClick={() => navigate("/student/reports")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-md"
              >
                <FileText size={16} />
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default StudentDashboard;
