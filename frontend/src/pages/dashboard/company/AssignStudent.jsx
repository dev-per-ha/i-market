// frontend/src/pages/company/AdminAssignStudent.jsx
import React, { useState, useEffect } from "react";
import API from "../../../services/api";
import {
  FaUserGraduate,
  FaUserTie,
  FaCheck,
  FaUsers,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";
import { Users, UserPlus, CheckCircle, XCircle } from "lucide-react";

const AdminAssignStudent = () => {
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const [studentsRes, supervisorsRes] = await Promise.all([
        API.get("/company/students"),
        API.get("/company/supervisors"),
      ]);

      // CLEAN STUDENTS (remove null + duplicates)
      const cleanStudents = [
        ...new Map(
          (studentsRes.data || [])
            .filter((s) => s && s._id)
            .map((s) => [s._id, s]),
        ).values(),
      ];

      // CLEAN SUPERVISORS
      const cleanSupervisors = (supervisorsRes.data || []).filter(
        (sup) => sup && sup._id,
      );

      setStudents(cleanStudents);
      setSupervisors(cleanSupervisors);
    } catch (err) {
      console.error("FETCH ERROR:", err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= ASSIGN SUPERVISOR =================
  const handleAssign = async () => {
    if (!selectedStudent || !selectedSupervisor) {
      setMessage({
        type: "error",
        text: "Please select both a student and a supervisor",
      });
      return;
    }

    try {
      setAssigning(true);
      setMessage({ type: "", text: "" });

      const res = await API.patch("/company/assign-supervisor", {
        studentId: selectedStudent,
        supervisorId: selectedSupervisor,
      });

      setMessage({ type: "success", text: res.data.message });

      // Reset selections
      setSelectedStudent("");
      setSelectedSupervisor("");

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("ASSIGN ERROR:", err.response?.data || err.message);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Assignment failed",
      });
    } finally {
      setAssigning(false);
    }
  };

  const getSelectedStudentDetails = () => {
    return students.find((s) => s._id === selectedStudent);
  };

  const getSelectedSupervisorDetails = () => {
    return supervisors.find((s) => s._id === selectedSupervisor);
  };

  const selectedStudentObj = getSelectedStudentDetails();
  const selectedSupervisorObj = getSelectedSupervisorDetails();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 dark:text-white/40 text-sm">
            Loading students and supervisors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              Assign Student to Supervisor
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
              Match students with their supervising mentors
            </p>
          </div>
        </div>

        {/* ASSIGNMENT CARD */}
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-[#00848c]" />
                <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                  New Assignment
                </h2>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-6">
              {/* Alert Messages */}
              {message.text && (
                <div
                  className={`p-3 rounded-xl flex items-center gap-2 ${
                    message.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20"
                      : "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle
                      size={16}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  ) : (
                    <XCircle
                      size={16}
                      className="text-red-600 dark:text-red-400"
                    />
                  )}
                  <span
                    className={`text-sm ${
                      message.type === "success"
                        ? "text-emerald-700 dark:text-emerald-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              )}

              {/* Student Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-2 flex items-center gap-2">
                  <FaUserGraduate className="text-[#00848c]" size={14} />
                  Select Student
                </label>

                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="" className="text-gray-500">
                    Choose a student...
                  </option>

                  {students.length === 0 ? (
                    <option disabled className="text-gray-400">
                      No approved students available
                    </option>
                  ) : (
                    students.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name || "No Name"} • {s.email || "No Email"}
                      </option>
                    ))
                  )}
                </select>

                {/* Selected Student Info */}
                {selectedStudentObj && (
                  <div className="mt-2 p-2 rounded-lg bg-[#00848c]/5 border border-[#00848c]/10">
                    <p className="text-xs text-gray-500 dark:text-white/40">
                      <span className="font-medium">Selected:</span>{" "}
                      {selectedStudentObj.name} ({selectedStudentObj.email})
                    </p>
                  </div>
                )}
              </div>

              {/* Arrow connector (visual only) */}
              {selectedStudent && selectedSupervisor && (
                <div className="flex justify-center">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-white/5">
                    <FaArrowRight className="text-[#00848c]" size={16} />
                  </div>
                </div>
              )}

              {/* Supervisor Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-white/70 mb-2 flex items-center gap-2">
                  <FaUserTie className="text-[#fec20f]" size={14} />
                  Select Supervisor
                </label>

                <select
                  value={selectedSupervisor}
                  onChange={(e) => setSelectedSupervisor(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="" className="text-gray-500">
                    Choose a supervisor...
                  </option>

                  {supervisors.length === 0 ? (
                    <option disabled className="text-gray-400">
                      No supervisors available
                    </option>
                  ) : (
                    supervisors.map((sup) => (
                      <option key={sup._id} value={sup._id}>
                        {sup.name || "No Name"} • {sup.email || "No Email"}{" "}
                        {sup.department ? `(${sup.department})` : ""}
                      </option>
                    ))
                  )}
                </select>

                {/* Selected Supervisor Info */}
                {selectedSupervisorObj && (
                  <div className="mt-2 p-2 rounded-lg bg-[#fec20f]/5 border border-[#fec20f]/10">
                    <p className="text-xs text-gray-500 dark:text-white/40">
                      <span className="font-medium">Selected:</span>{" "}
                      {selectedSupervisorObj.name} (
                      {selectedSupervisorObj.email})
                      {selectedSupervisorObj.department &&
                        ` • ${selectedSupervisorObj.department}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Empty State for no data */}
              {students.length === 0 && supervisors.length === 0 && (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
                      <FaUsers
                        size={32}
                        className="text-gray-400 dark:text-white/20"
                      />
                    </div>
                    <p className="text-gray-500 dark:text-white/40 font-medium">
                      No students or supervisors available
                    </p>
                    <p className="text-sm text-gray-400 dark:text-white/20">
                      Please ensure you have approved students and created
                      supervisors
                    </p>
                  </div>
                </div>
              )}

              {/* Assign Button */}
              {students.length > 0 && supervisors.length > 0 && (
                <button
                  onClick={handleAssign}
                  disabled={
                    assigning || !selectedStudent || !selectedSupervisor
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00848c]/25 font-medium"
                >
                  {assigning ? (
                    <FaSpinner className="animate-spin" size={16} />
                  ) : (
                    <FaCheck size={14} />
                  )}
                  <span>
                    {assigning ? "Assigning..." : "Assign Supervisor"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* STATISTICS CARD - Shows real counts */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-white/10 p-4 text-center">
            <FaUserGraduate className="text-[#00848c] mx-auto mb-2" size={20} />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {students.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/40">
              Available Students
            </p>
          </div>
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-white/10 p-4 text-center">
            <FaUserTie className="text-[#fec20f] mx-auto mb-2" size={20} />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {supervisors.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/40">
              Available Supervisors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignStudent;
