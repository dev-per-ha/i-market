import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import { useParams } from "react-router-dom";
import {
  FileText,
  Download,
  Edit,
  Save,
  X,
  Share2,
  fetchReports,
  CheckCircle,
  Calendar,
  CheckSquare,
} from "lucide-react";

const ReportPage = () => {
  const { studentId } = useParams();

  const [reports, setReports] = useState([]);
  const [role, setRole] = useState("");
  const [advisorExists, setAdvisorExists] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sharingId, setSharingId] = useState(null);

  const [form, setForm] = useState({
    week: "",
    tasks: "",
    description: "",
    monday: "present",
    tuesday: "present",
    wednesday: "present",
    thursday: "present",
    friday: "present",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.role || "";
    setRole(userRole);

    if (userRole === "student") checkAdvisor();
  }, []);

  useEffect(() => {
    if (!role) return;
    fetchReports();
  }, [role, studentId]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = "";

      if (role === "supervisor") url = `/reports/supervisor/${studentId}`;
      else if (role === "advisor") url = `/reports/advisor/${studentId}`;
      else url = `/reports/student`;

      const res = await API.get(url);
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const checkAdvisor = async () => {
    try {
      const res = await API.get("/student/connections");
      if (!res.data?.advisor) setAdvisorExists(false);
    } catch (err) {}
  };

  const validateForm = () => {
    if (!form.week || !form.tasks || !form.description) {
      alert("Please fill all required fields (Week, Tasks, Description)");
      return false;
    }
    const weekNum = parseInt(form.week);
    if (isNaN(weekNum) || weekNum < 1) {
      alert("Week must be a positive number");
      return false;
    }
    return true;
  };

  const createReport = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await API.post(`/reports/${studentId}`, {
        week: form.week,
        tasks: form.tasks
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        description: form.description,
        attendance: {
          monday: form.monday,
          tuesday: form.tuesday,
          wednesday: form.wednesday,
          thursday: form.thursday,
          friday: form.friday,
        },
      });

      resetForm();
      await fetchReports();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create report");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (report) => {
    setEditingId(report._id);
    setForm({
      week: report.week,
      tasks: report.tasks.join(", "),
      description: report.description,
      monday: report.attendance?.monday || "present",
      tuesday: report.attendance?.tuesday || "present",
      wednesday: report.attendance?.wednesday || "present",
      thursday: report.attendance?.thursday || "present",
      friday: report.attendance?.friday || "present",
    });
  };

  const updateReport = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await API.put(`/reports/${editingId}`, {
        week: form.week,
        tasks: form.tasks
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        description: form.description,
        attendance: {
          monday: form.monday,
          tuesday: form.tuesday,
          wednesday: form.wednesday,
          thursday: form.thursday,
          friday: form.friday,
        },
      });

      setEditingId(null);
      resetForm();
      await fetchReports();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update report");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      week: "",
      tasks: "",
      description: "",
      monday: "present",
      tuesday: "present",
      wednesday: "present",
      thursday: "present",
      friday: "present",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const shareReport = async (id) => {
    setSharingId(id);
    try {
      await API.put(`/reports/share/${id}`);
      await fetchReports();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to share report");
    } finally {
      setSharingId(null);
    }
  };

  const downloadReports = () => {
    window.print();
  };

  const getAttendanceSummary = (attendance) => {
    if (!attendance) return { present: 0, total: 5 };
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const present = days.filter((day) => attendance[day] === "present").length;
    return { present, total: 5 };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 text-sm">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              Internship Reports
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
              {reports.length} report{reports.length !== 1 ? "s" : ""} submitted
            </p>
          </div>
        </div>

        <button
          onClick={downloadReports}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white/10 text-white hover:bg-gray-800 transition-all duration-300 shadow-lg"
        >
          <Download size={16} />
          <span className="text-sm font-medium">Download All</span>
        </button>
      </div>

      {/* CREATE/EDIT FORM - Only for supervisors */}
      {role === "supervisor" && (
        <div className="relative mb-8">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                {editingId ? "Edit Report" : "Create New Report"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                    Week Number *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Week"
                    value={form.week}
                    onChange={(e) => setForm({ ...form, week: e.target.value })}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                    Tasks (comma separated) *
                  </label>
                  <input
                    placeholder="e.g., API Development, Documentation, Testing"
                    value={form.tasks}
                    onChange={(e) =>
                      setForm({ ...form, tasks: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                  Description *
                </label>
                <textarea
                  placeholder="Detailed description of work completed this week..."
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Attendance This Week
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {["monday", "tuesday", "wednesday", "thursday", "friday"].map(
                    (day) => (
                      <div key={day} className="space-y-1">
                        <label className="text-xs font-medium text-gray-500 dark:text-white/40 capitalize">
                          {day.slice(0, 3)}
                        </label>
                        <select
                          value={form[day]}
                          onChange={(e) =>
                            setForm({ ...form, [day]: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00848c] text-sm capitalize"
                        >
                          <option value="present">✓ Present</option>
                          <option value="absent">✗ Absent</option>
                        </select>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={editingId ? updateReport : createReport}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00848c]/25"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : editingId ? (
                    <Save size={16} />
                  ) : (
                    <CheckSquare size={16} />
                  )}
                  <span>
                    {submitting
                      ? "Saving..."
                      : editingId
                        ? "Update Report"
                        : "Save Report"}
                  </span>
                </button>

                {editingId && (
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-all duration-300"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT LIST */}
      {reports.length === 0 ? (
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                <FileText
                  size={48}
                  className="text-gray-400 dark:text-white/20"
                />
              </div>
              <p className="text-gray-500 dark:text-white/40 font-medium">
                No reports yet
              </p>
              {role === "supervisor" && (
                <p className="text-sm text-gray-400 dark:text-white/20">
                  Create your first report using the form above
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report, index) => {
            const attendance = getAttendanceSummary(report.attendance);
            const attendancePercentage =
              (attendance.present / attendance.total) * 100;

            return (
              <div
                key={report._id}
                className="group relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header with Week and Actions */}
                <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-5 py-4 border-b border-gray-200/50 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center">
                        <Calendar size={18} className="text-[#00848c]" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                          Week {report.week}
                        </h3>
                        {report.createdAt && (
                          <p className="text-xs text-gray-400 dark:text-white/30">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {role === "supervisor" && (
                      <button
                        onClick={() => startEdit(report)}
                        className="p-2 rounded-lg text-gray-400 hover:text-[#00848c] hover:bg-[#00848c]/10 transition-all duration-200"
                        title="Edit Report"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  {/* Tasks */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-1">
                      Tasks Completed
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {report.tasks?.map((task, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-[#00848c]/10 text-[#00848c]"
                        >
                          {task}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-1">
                      Description
                    </p>
                    <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                      {report.description}
                    </p>
                  </div>

                  {/* Attendance */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-1">
                      Attendance ({attendance.present}/{attendance.total} days)
                    </p>
                    <div className="flex gap-1">
                      {["M", "T", "W", "T", "F"].map((day, i) => {
                        const dayName = [
                          "monday",
                          "tuesday",
                          "wednesday",
                          "thursday",
                          "friday",
                        ][i];
                        const isPresent =
                          report.attendance?.[dayName] === "present";
                        return (
                          <div
                            key={day}
                            className={`flex-1 text-center py-1.5 text-xs font-medium rounded-lg ${
                              isPresent
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Share Button - Only for students with advisor */}
                  {role === "student" &&
                    advisorExists &&
                    !report.sharedWithAdvisor && (
                      <button
                        onClick={() => shareReport(report._id)}
                        disabled={sharingId === report._id}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 shadow-md"
                      >
                        {sharingId === report._id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <Share2 size={14} />
                        )}
                        <span className="text-sm font-medium">
                          Share with Advisor
                        </span>
                      </button>
                    )}

                  {/* Shared Status */}
                  {report.sharedWithAdvisor && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle size={14} className="text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Shared with Advisor
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReportPage;
