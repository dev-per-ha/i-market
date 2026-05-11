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
  Sparkles,
  ChevronRight,
  Clock,
} from "lucide-react";

const AdvisorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [groupChat, setGroupChat] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchGroupChat();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/advisor/my-students");
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
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
    const res = await API.post("/chat/access", { userId });
    navigate(`/chat/${res.data._id}`);
  };

  // REMOVE STUDENT (NEW)
  const removeStudent = async (studentId) => {
    try {
      if (!window.confirm("Are you sure you want to remove this student?"))
        return;

      const res = await API.put("/university/advisor/remove-student", {
        studentId,
      });
      console.log(res.data);

      setStudents((prev) => prev.filter((s) => s._id !== studentId));
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to remove student");
    }
  };

  // Calculate statistics (frontend only)
  const stats = {
    totalStudents: students.length,
    hasGroupChat: !!groupChat,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 font-mono text-sm">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      {/* PREMIUM HEADER */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/10 to-[#fec20f]/5 rounded-3xl blur-xl"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
                <UsersRound
                  size={22}
                  className="text-white"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                  Advisor Dashboard
                </h1>
                <p className="text-gray-500 dark:text-white/40 mt-1 font-mono text-sm tracking-wide">
                  Manage your students and track their progress
                </p>
              </div>
            </div>
          </div>

          {/* Stats Badge */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-white/10">
            <TrendingUp size={16} className="text-[#00848c]" />
            <span className="text-sm font-mono text-gray-600 dark:text-white/60">
              {stats.totalStudents} Active Students
            </span>
          </div>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<Users size={20} />}
          gradient="from-[#00848c] to-[#00848c]/80"
          trend={stats.totalStudents > 0 ? "+ Active" : "0"}
        />
        <StatCard
          title="Group Chat"
          value={stats.hasGroupChat ? "Active" : "Inactive"}
          icon={<MessageSquare size={20} />}
          gradient={
            stats.hasGroupChat
              ? "from-emerald-500 to-emerald-600"
              : "from-gray-500 to-gray-600"
          }
          valueIsText={true}
        />
        <StatCard
          title="Reports Available"
          value={students.filter((s) => s.hasReports).length || students.length}
          icon={<FileBarChart size={20} />}
          gradient="from-[#fec20f] to-[#fec20f]/80"
        />
        <StatCard
          title="Response Rate"
          value="98%"
          icon={<Sparkles size={20} />}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* STUDENTS SECTION */}
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10">
              <Users size={18} className="text-[#00848c]" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-gray-900 dark:text-white">
                My Students
              </h2>
              <p className="text-sm text-gray-500 dark:text-white/40 font-mono">
                Manage and communicate with your assigned students
              </p>
            </div>
          </div>
        </div>

        {students.length === 0 ? (
          // Premium Empty State
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
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
                  Students will appear here when they are assigned to you
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, index) => (
              <StudentCard
                key={student._id}
                student={student}
                onMessage={() => startChat(student._id)}
                onReports={() => navigate(`/advisor/reports/${student._id}`)}
                onRemove={() => removeStudent(student._id)}
                groupChat={groupChat}
                onGroupChat={() => navigate(`/chat/${groupChat._id}`)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= PREMIUM STAT CARD ================= */
const StatCard = ({ title, value, icon, gradient, trend, valueIsText }) => (
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
            ↑ {trend}
          </span>
        )}
      </div>
      {valueIsText ? (
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
      ) : (
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
          {value?.toLocaleString() || 0}
        </h3>
      )}
      <p className="text-sm text-gray-500 dark:text-white/40 mt-1 font-medium">
        {title}
      </p>
    </div>
  </div>
);

/* ================= PREMIUM STUDENT CARD ================= */
const StudentCard = ({
  student,
  onMessage,
  onReports,
  onRemove,
  groupChat,
  onGroupChat,
  index,
}) => (
  <div
    className="relative group hover:scale-[1.02] transition-all duration-300"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div className="relative bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
      {/* Card Header with gradient accent */}
      <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent p-5 pb-3 border-b border-gray-200/50 dark:border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                <span className="text-[#00848c] font-bold text-lg">
                  {student.name?.[0]?.toUpperCase() || "S"}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                {student.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/40 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00848c]"></span>
                {student.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Student Stats (decorative) */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <span className="text-gray-500 dark:text-white/40">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-emerald-500 font-mono">Online</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onMessage}
            className="group/btn relative flex-1 bg-gradient-to-r from-[#00848c] to-[#00848c]/80 hover:from-[#fec20f] hover:to-[#fec20f]/90 text-white py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden text-sm font-medium shadow-md shadow-[#00848c]/25 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
            <MessageCircle size={14} className="relative z-10" />
            <span className="relative z-10">Message</span>
          </button>

          <button
            onClick={onReports}
            className="group/btn relative flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden text-sm font-medium shadow-md shadow-emerald-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
            <FileText size={14} className="relative z-10" />
            <span className="relative z-10">Reports</span>
          </button>

          <button
            onClick={onRemove}
            className="group/btn relative bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500 hover:to-red-600 text-red-600 hover:text-white py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden text-sm font-medium border border-red-500/30 hover:border-red-500/60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover/btn:from-red-500/20 transition-all duration-500 rounded-xl"></div>
            <UserMinus size={14} className="relative z-10" />
            <span className="relative z-10">Remove</span>
          </button>
        </div>

        {/* Group Chat Button (if available) */}
        {groupChat && (
          <button
            onClick={onGroupChat}
            className="w-full group/chat relative bg-purple-500/10 hover:bg-purple-500 text-purple-600 hover:text-white py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium border border-purple-500/30 hover:border-purple-500"
          >
            <MessageSquare size={14} />
            <span>Group Chat</span>
            <ChevronRight
              size={14}
              className="opacity-0 group-hover/chat:opacity-100 transition-all duration-300 group-hover/chat:translate-x-1"
            />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default AdvisorDashboard;
