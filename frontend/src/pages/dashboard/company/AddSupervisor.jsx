import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import {
  UserPlus,
  Users,
  Trash2,
  Mail,
  Building2,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";

const AddSupervisor = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const [supervisors, setSupervisors] = useState([]);

  const [message, setMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [error, setError] = useState("");

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  /* ================= FETCH SUPERVISORS ================= */
  const fetchSupervisors = async () => {
    try {
      const { data } = await API.get("/company/supervisors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSupervisors(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  /* ================= ADD SUPERVISOR ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setEmailMessage("");
    setError("");

    if (!name || !email || !department) {
      setError("All fields are required");
      return;
    }

    try {
      const { data } = await API.post(
        "/company/supervisor/add",
        { name, email, department },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessage("Supervisor created successfully");
      setName("");
      setEmail("");
      setDepartment("");

      if (data.emailSent === false) {
        setEmailMessage("Supervisor created, but email failed");
      } else {
        setEmailMessage("Email sent successfully");
      }

      fetchSupervisors();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add supervisor");
    }
  };

  /* ================= DELETE SUPERVISOR ================= */
  const deleteSupervisor = async (id) => {
    if (!window.confirm("Delete supervisor?")) return;

    try {
      await API.delete(`/company/supervisor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchSupervisors();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                Supervisor Management
              </h1>
              <p className="text-sm text-white/40 mt-0.5">
                {supervisors.length} supervisor
                {supervisors.length !== 1 ? "s" : ""} on your team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 w-fit hover:bg-white/10 transition-all duration-300 group">
            <TrendingUp
              size={14}
              className="text-[#00c4cf] group-hover:scale-110 transition-transform"
            />
            <span className="text-sm text-white/70 font-medium">
              Total: {supervisors.length}
            </span>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-[#00848c]" />
                <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                  Add New Supervisor
                </h2>
              </div>
            </div>

            <div className="p-6">
              {/* Alert Messages */}
              {message && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    {message}
                  </span>
                </div>
              )}

              {emailMessage && (
                <div
                  className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${
                    emailMessage.includes("failed")
                      ? "bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20"
                      : "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20"
                  }`}
                >
                  {emailMessage.includes("failed") ? (
                    <AlertCircle size={16} className="text-amber-600" />
                  ) : (
                    <Mail size={16} className="text-blue-600" />
                  )}
                  <span
                    className={`text-sm ${
                      emailMessage.includes("failed")
                        ? "text-amber-700 dark:text-amber-300"
                        : "text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    {emailMessage}
                  </span>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
                  <XCircle
                    size={16}
                    className="text-red-600 dark:text-red-400"
                  />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40"
                    />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40"
                    />
                    <input
                      type="email"
                      placeholder="supervisor@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-1">
                    Department *
                  </label>
                  <div className="relative">
                    <Building2
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40"
                    />
                    <input
                      type="text"
                      placeholder="Engineering, HR, Sales, etc."
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 font-medium shadow-lg shadow-[#00848c]/25"
                >
                  <UserPlus size={16} />
                  Add Supervisor
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ================= LIST ================= */}
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[#00848c]" />
                  <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                    Your Supervisors
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#00848c]/10 text-[#00848c] text-xs font-medium">
                  {supervisors.length} total
                </span>
              </div>
            </div>

            <div className="p-6">
              {supervisors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                    <Users
                      size={48}
                      className="text-gray-400 dark:text-white/20"
                    />
                  </div>
                  <p className="text-gray-500 dark:text-white/40 font-medium">
                    No supervisors yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-white/20 mt-1">
                    Add your first supervisor using the form above
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {supervisors.map((s) => (
                    <div
                      key={s._id}
                      className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:shadow-md hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00848c]/10 to-[#fec20f]/10 flex items-center justify-center flex-shrink-0">
                          <User size={18} className="text-[#00848c]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {s.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-white/40">
                              <Mail size={10} />
                              {s.email}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-white/40">
                              <Building2 size={10} />
                              {s.department}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteSupervisor(s._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <Trash2 size={14} />
                        <span className="text-sm font-medium hidden sm:inline">
                          Remove
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSupervisor;
