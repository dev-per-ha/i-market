import React, { useState, useEffect } from "react";
import API from "../../../services/api";
import {
  GraduationCap,
  Building2,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  User,
  BookOpen,
  FileText,
  Send,
} from "lucide-react";

const StudentUniversityForm = () => {
  const [form, setForm] = useState({
    studentName: "",
    department: "",
    university: "",
  });
  const [studentImage, setStudentImage] = useState(null);
  const [studentImageName, setStudentImageName] = useState("");
  const [idCard, setIdCard] = useState(null);
  const [idCardName, setIdCardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [universities, setUniversities] = useState([]);
  const [fetchingUnis, setFetchingUnis] = useState(true);

  // Fetch universities from API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await API.get("/university/universities");
        setUniversities(res.data || []);
      } catch (err) {
        console.error("Failed to fetch universities:", err);
        // Fallback to default options if API fails
        setUniversities([
          { _id: "uni_a", name: "University A" },
          { _id: "uni_b", name: "University B" },
        ]);
      } finally {
        setFetchingUnis(false);
      }
    };
    fetchUniversities();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (type, file) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(
        `${type === "student" ? "Student image" : "ID card"} must be less than 5MB`,
      );
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG and PNG images are allowed");
      return;
    }

    setError("");
    if (type === "student") {
      setStudentImage(file);
      setStudentImageName(file.name);
    } else {
      setIdCard(file);
      setIdCardName(file.name);
    }
  };

  const removeFile = (type) => {
    if (type === "student") {
      setStudentImage(null);
      setStudentImageName("");
    } else {
      setIdCard(null);
      setIdCardName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.studentName || !form.department || !form.university) {
      setError("Please fill in all fields");
      return;
    }

    if (!studentImage) {
      setError("Please upload a student image");
      return;
    }

    if (!idCard) {
      setError("Please upload an ID card");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("studentName", form.studentName);
    data.append("department", form.department);
    data.append("university", form.university);
    if (studentImage) data.append("studentImage", studentImage);
    if (idCard) data.append("idCard", idCard);

    try {
      const res = await API.post("/university/apply", data);
      setSuccess(res.data.message || "Application submitted successfully!");

      // Reset form
      setForm({ studentName: "", department: "", university: "" });
      setStudentImage(null);
      setStudentImageName("");
      setIdCard(null);
      setIdCardName("");

      // Auto-clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Application failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 p-6 lg:p-8 flex items-center justify-center">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold bg-gradient-to-r from-[#1c1f4c] to-[#00848c] bg-clip-text text-transparent">
              University Application
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
              Submit your application to join a university
            </p>
          </div>
        </div>

        {/* Application Form Card */}
        <div className="relative">
          <div className="bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-[#00848c]/5 to-transparent px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#00848c]" />
                <h2 className="font-serif font-semibold text-lg text-gray-900 dark:text-white">
                  Application Form
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Success/Error Messages */}
              {success && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    {success}
                  </span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2">
                  <AlertCircle
                    size={16}
                    className="text-red-600 dark:text-red-400"
                  />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </span>
                </div>
              )}

              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="studentName"
                    value={form.studentName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Department *
                </label>
                <div className="relative">
                  <BookOpen
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] transition-all duration-200"
                    placeholder="e.g., Computer Science, Engineering"
                    required
                  />
                </div>
              </div>

              {/* University Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Select University *
                </label>
                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    name="university"
                    value={form.university}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] appearance-none cursor-pointer"
                    required
                    disabled={fetchingUnis}
                  >
                    <option value="">
                      {fetchingUnis
                        ? "Loading universities..."
                        : "Select a university"}
                    </option>
                    {universities.map((uni) => (
                      <option key={uni._id} value={uni._id}>
                        {uni.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Student Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  Student Photo *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange("student", e.target.files[0])
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#00848c] file:text-white hover:file:bg-[#006b72] cursor-pointer"
                    accept="image/jpeg,image/png,image/jpg"
                  />
                </div>
                {studentImageName && (
                  <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={14} />
                      <span>{studentImageName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile("student")}
                      className="p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                    >
                      <X size={14} className="text-emerald-600" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 dark:text-white/30 mt-2">
                  Accepted formats: JPG, PNG (Max 5MB)
                </p>
              </div>

              {/* ID Card Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white/60 mb-2">
                  ID Card / Document *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange("id", e.target.files[0])}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-[#00848c] file:text-white hover:file:bg-[#006b72] cursor-pointer"
                    accept="image/jpeg,image/png,image/jpg"
                  />
                </div>
                {idCardName && (
                  <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={14} />
                      <span>{idCardName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile("id")}
                      className="p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
                    >
                      <X size={14} className="text-emerald-600" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 dark:text-white/30 mt-2">
                  Accepted formats: JPG, PNG (Max 5MB)
                </p>
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Your application will be reviewed by
                  the university administration. You'll receive a notification
                  once a decision is made.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-[#00848c]/25"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send size={16} />
                )}
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentUniversityForm;
