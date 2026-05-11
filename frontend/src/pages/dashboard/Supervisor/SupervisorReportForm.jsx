import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  FileText,
  CheckSquare,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
} from "lucide-react";

const SupervisorReportForm = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [week, setWeek] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([""]);
  const [attendance, setAttendance] = useState({
    monday: "present",
    tuesday: "present",
    wednesday: "present",
    thursday: "present",
    friday: "present",
  });
  const [performance, setPerformance] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch student name
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await API.get(`/supervisor/student/${studentId}`);
        setStudentName(res.data?.name || "Student");
      } catch (err) {
        console.error(err);
        setStudentName("Student");
      }
    };
    if (studentId) fetchStudent();
  }, [studentId]);

  // ================= ADD TASK =================
  const addTask = () => setTasks([...tasks, ""]);
  const updateTask = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };
  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    if (!week || week < 1) {
      setError("Please enter a valid week number");
      return false;
    }
    if (!description.trim()) {
      setError("Please enter a report description");
      return false;
    }
    const validTasks = tasks.filter((t) => t.trim());
    if (validTasks.length === 0) {
      setError("Please add at least one task");
      return false;
    }
    if (performance < 0 || performance > 100) {
      setError("Performance must be between 0 and 100");
      return false;
    }
    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const validTasks = tasks.filter((t) => t.trim());
      await API.post(`/reports/create/${studentId}`, {
        week: Number(week),
        description,
        tasks: validTasks,
        attendance,
        performance: Number(performance),
      });

      setSuccess("Report saved successfully!");
      setTimeout(() => {
        navigate(`/supervisor/reports/${studentId}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save report");
    } finally {
      setSubmitting(false);
    }
  };

  const getPerformanceColor = () => {
    if (performance >= 80) return "text-emerald-600";
    if (performance >= 60) return "text-blue-600";
    if (performance >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getAttendanceStats = () => {
    const days = Object.values(attendance);
    const present = days.filter((d) => d === "present").length;
    return { present, total: 5, percentage: (present / 5) * 100 };
  };

  const attendanceStats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold bg-gradient-to-r from-[#1c1f4c] to-[#00848c] bg-clip-text text-transparent">
                Weekly Report
              </h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                For {studentName} • Week {week}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/supervisor/reports/${studentId}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back to Reports</span>
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600" />
            <span className="text-sm text-emerald-700 dark:text-emerald-300">
              {success}
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">
              {error}
            </span>
          </div>
        )}

        {/* Form Card */}
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#00848c]" />
                <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                  Report Details
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Week Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Week Number *
                </label>
                <div className="relative">
                  <Calendar
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    value={week}
                    onChange={(e) => setWeek(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                    min={1}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Enter the week number of the internship
                </p>
              </div>

              {/* Report Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Report Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] resize-none"
                  placeholder="Describe the student's progress, achievements, and areas for improvement..."
                  required
                />
              </div>

              {/* Tasks Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-white/60">
                    Tasks Completed *
                  </label>
                  <button
                    type="button"
                    onClick={addTask}
                    className="flex items-center gap-1 text-xs text-[#00848c] hover:text-[#fec20f] transition-colors"
                  >
                    <Plus size={12} />
                    Add Task
                  </button>
                </div>
                <div className="space-y-2">
                  {tasks.map((task, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="relative flex-1">
                        <CheckSquare
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={task}
                          onChange={(e) => updateTask(i, e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] text-sm"
                          placeholder={`Task ${i + 1}`}
                          required
                        />
                      </div>
                      {tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(i)}
                          className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Attendance Record *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.keys(attendance).map((day) => (
                    <div key={day} className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 dark:text-white/40 capitalize">
                        {day.slice(0, 3)}
                      </label>
                      <select
                        value={attendance[day]}
                        onChange={(e) =>
                          setAttendance({
                            ...attendance,
                            [day]: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00848c] text-sm capitalize"
                      >
                        <option value="present">✓ Present</option>
                        <option value="absent">✗ Absent</option>
                      </select>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00848c] rounded-full transition-all duration-300"
                      style={{ width: `${attendanceStats.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {attendanceStats.present}/{attendanceStats.total} days
                  </span>
                </div>
              </div>

              {/* Performance Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Performance Rating (%)
                </label>
                <div className="relative">
                  <Award
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    value={performance}
                    onChange={(e) => setPerformance(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c]"
                    min={0}
                    max={100}
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        performance >= 80
                          ? "bg-emerald-500"
                          : performance >= 60
                            ? "bg-blue-500"
                            : performance >= 40
                              ? "bg-amber-500"
                              : "bg-red-500"
                      }`}
                      style={{ width: `${performance}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${getPerformanceColor()}`}
                  >
                    {performance}%
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 font-semibold shadow-lg shadow-[#00848c]/25"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save size={16} />
                  )}
                  {submitting ? "Saving..." : "Save Report"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/supervisor/reports/${studentId}`)}
                  className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={16}
              className="text-blue-500 flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> This report will be visible to the student
              and their advisor. Please provide accurate and constructive
              feedback to help the student grow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorReportForm;
