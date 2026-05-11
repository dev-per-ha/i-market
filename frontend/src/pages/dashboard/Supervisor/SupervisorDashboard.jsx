import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageCircle,
  FileText,
  UserMinus,
  UsersRound,
  MessageSquare,
  FileBarChart,
  TrendingUp,
  ChevronRight,
  Clock,
  Mail,
  Phone,
  Building2,
  Loader2,
} from "lucide-react";

const SupervisorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [groupChat, setGroupChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [chattingId, setChattingId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchGroupChat();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/supervisor/my-students");
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupChat = async () => {
    try {
      const res = await API.get("/chat");
      const group = res.data.find((c) => c.isGroup && c.members.length === 3);
      setGroupChat(group);
    } catch (err) {
      console.error(err);
    }
  };

  const startChat = async (userId) => {
    setChattingId(userId);
    try {
      const res = await API.post("/chat/access", { userId });
      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to start chat");
      setTimeout(() => setError(""), 3000);
    } finally {
      setChattingId(null);
    }
  };

  // REMOVE STUDENT
  const removeStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to remove this student?"))
      return;

    setRemovingId(studentId);
    try {
      const res = await API.put("/company/supervisor/remove-student", {
        studentId,
      });
      console.log(res.data);
      setStudents((prev) => prev.filter((s) => s._id !== studentId));
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to remove student");
      setTimeout(() => setError(""), 3000);
    } finally {
      setRemovingId(null);
    }
  };

  // Calculate statistics from real data
  const stats = {
    totalStudents: students.length,
    hasGroupChat: !!groupChat,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
              <UsersRound size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                Supervisor Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                Manage your students, track reports, and communicate
              </p>
            </div>
          </div>

          {/* Stats Badge */}
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10">
              <TrendingUp size={16} className="text-[#00848c]" />
              <span className="text-sm font-mono text-gray-600 dark:text-white/60">
                {stats.totalStudents} Active Students
              </span>
            </div>
            {stats.hasGroupChat && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 backdrop-blur-sm border border-purple-500/20">
                <MessageSquare size={16} className="text-purple-500" />
                <span className="text-sm font-mono text-purple-600 dark:text-purple-400">
                  Group Active
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-sm text-red-700 dark:text-red-300">
              {error}
            </span>
          </div>
        )}

        {/* Students Grid */}
        {students.length === 0 ? (
          <div className="relative">
            <div className="bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                  <Users
                    size={48}
                    className="text-gray-400 dark:text-white/20"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-gray-500 dark:text-white/40 font-medium">
                  No students assigned yet
                </p>
                <p className="text-sm text-gray-400 dark:text-white/20">
                  When students are assigned to you, they will appear here
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, index) => (
              <div
                key={student._id}
                className="group relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00848c] to-[#fec20f]"></div>

                <div className="p-5">
                  {/* Student Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                        <span className="text-[#00848c] font-bold text-xl">
                          {student.name?.[0]?.toUpperCase() || "S"}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white truncate">
                        {student.name || "Unknown Student"}
                      </h3>
                      {student.email && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Mail size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-white/40 truncate">
                            {student.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-2 mb-4 text-sm">
                    {student.phone && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                        <Phone size={12} className="text-gray-400" />
                        <span className="text-xs">{student.phone}</span>
                      </div>
                    )}
                    {student.department && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                        <Building2 size={12} className="text-gray-400" />
                        <span className="text-xs truncate">
                          {student.department}
                        </span>
                      </div>
                    )}
                    {student.createdAt && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-white/60">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs">
                          Joined{" "}
                          {new Date(student.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startChat(student._id)}
                      disabled={chattingId === student._id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 text-sm font-medium shadow-md"
                    >
                      {chattingId === student._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <MessageCircle size={14} />
                      )}
                      Message
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/supervisor/reports/${student._id}`)
                      }
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium shadow-md"
                    >
                      <FileText size={14} />
                      Reports
                    </button>

                    <button
                      onClick={() => removeStudent(student._id)}
                      disabled={removingId === student._id}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500 hover:to-red-600 text-red-600 hover:text-white transition-all duration-300 text-sm font-medium border border-red-500/30 hover:border-red-500/60 disabled:opacity-50"
                    >
                      {removingId === student._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <UserMinus size={14} />
                      )}
                    </button>
                  </div>

                  {/* Group Chat Button (if available) */}
                  {groupChat && (
                    <button
                      onClick={() => navigate(`/chat/${groupChat._id}`)}
                      className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-600 hover:text-white transition-all duration-300 text-sm font-medium border border-purple-500/30 hover:border-purple-500"
                    >
                      <MessageSquare size={14} />
                      Group Chat
                      <ChevronRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats Footer */}
        {students.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 text-center">
              <Users size={16} className="text-[#00848c] mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-white/40">
                Assigned Students
              </p>
            </div>
            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 text-center">
              <FileBarChart size={16} className="text-[#00848c] mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {students.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-white/40">
                Reports Available
              </p>
            </div>
            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 text-center">
              <MessageSquare
                size={16}
                className="text-[#00848c] mx-auto mb-1"
              />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {groupChat ? "Active" : "Inactive"}
              </p>
              <p className="text-xs text-gray-500 dark:text-white/40">
                Group Chat
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorDashboard;
