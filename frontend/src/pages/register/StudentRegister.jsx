import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const StudentRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  const handleChange = (e) => {
    if (e.target.name === "name") {
      const value = e.target.value;
      // allow only letters and spaces
      if (/^[A-Za-z\s]*$/.test(value)) {
        setForm({ ...form, name: value });
        setError("");
      }
    } else if (e.target.name === "password") {
      const value = e.target.value;
      setForm({ ...form, password: value });
      checkPasswordStrength(value);
      setError("");
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
      setError("");
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = "";

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    if (score <= 2) feedback = "Weak";
    else if (score <= 4) feedback = "Medium";
    else feedback = "Strong";

    setPasswordStrength({ score, feedback });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.feedback === "Strong") return "text-emerald-400";
    if (passwordStrength.feedback === "Medium") return "text-amber-400";
    if (passwordStrength.feedback === "Weak") return "text-red-400";
    return "text-white/40";
  };

  const getPasswordStrengthWidth = () => {
    return `${(passwordStrength.score / 5) * 100}%`;
  };

  const handleSubmit = async () => {
    // Required fields validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    // Strong password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      );
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "student",
      });

      alert(
        "Registration successful! Check your email to activate your account.",
      );
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    form.name && form.email && form.password && passwordStrength.score >= 4;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#1c1f4c] via-[#1a1d46] to-[#00848c]/20 px-4 relative overflow-hidden">
      {/* Premium Decorative Orbs */}
      <div className="absolute top-[-120px] right-[-80px] w-96 h-96 bg-[#fec20f]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-100px] left-[-80px] w-80 h-80 bg-[#00848c]/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-[#fec20f]/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-[#00848c]/10 rounded-full blur-2xl animate-float animation-delay-2000"></div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Registration Card */}
      <div className="w-full max-w-md mx-4 bg-[#1c1f4c]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(0,132,140,0.3)]">
        {/* Accent Line */}
        <div className="w-20 h-1 bg-gradient-to-r from-[#00848c] via-[#fec20f] to-[#037272] rounded-full mx-auto mb-6"></div>

        {/* Logo/Icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-2xl blur-md opacity-50"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-[#00848c] to-[#00848c]/80 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap
                size={28}
                className="text-white"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-serif font-bold text-center text-white mb-1 tracking-tight">
          Student Registration
        </h2>
        <p className="text-white/40 text-center text-sm mb-6 font-mono tracking-wide">
          Start your internship journey
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <User
                size={16}
                className="text-white/40 group-focus-within:text-[#00848c] transition-colors duration-300"
              />
            </div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00848c] focus:ring-2 focus:ring-[#00848c]/20 transition-all duration-300 text-white placeholder-white/30 font-sans peer"
              placeholder=" "
            />
            <label className="absolute left-10 -top-2.5 bg-[#1c1f4c] px-1 text-xs text-white/60 transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/30 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#00848c]">
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <Mail
                size={16}
                className="text-white/40 group-focus-within:text-[#00848c] transition-colors duration-300"
              />
            </div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00848c] focus:ring-2 focus:ring-[#00848c]/20 transition-all duration-300 text-white placeholder-white/30 font-sans peer"
              placeholder=" "
            />
            <label className="absolute left-10 -top-2.5 bg-[#1c1f4c] px-1 text-xs text-white/60 transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/30 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#00848c]">
              Email Address
            </label>
          </div>

          {/* Password with Toggle */}
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <Lock
                size={16}
                className="text-white/40 group-focus-within:text-[#00848c] transition-colors duration-300"
              />
            </div>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00848c] focus:ring-2 focus:ring-[#00848c]/20 transition-all duration-300 text-white placeholder-white/30 font-sans peer"
              placeholder=" "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#00848c] transition-colors duration-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <label className="absolute left-10 -top-2.5 bg-[#1c1f4c] px-1 text-xs text-white/60 transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/30 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#00848c]">
              Password
            </label>
          </div>

          {/* Password Strength Indicator */}
          {form.password && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      passwordStrength.feedback === "Strong"
                        ? "bg-emerald-500"
                        : passwordStrength.feedback === "Medium"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: getPasswordStrengthWidth() }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ml-2 ${getPasswordStrengthColor()}`}
                >
                  {passwordStrength.feedback}
                </span>
              </div>
              <p className="text-[10px] text-white/35 font-mono">
                • 8+ characters • Uppercase & lowercase • Number & special
                character (@$!%*?&)
              </p>
            </div>
          )}

          {/* Register Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-[#00848c]/25 mt-4"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <GraduationCap size={16} />
            )}
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login Link */}
          <p className="text-center text-xs text-white/40 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#fec20f] cursor-pointer hover:text-white transition-all duration-200 font-medium"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
