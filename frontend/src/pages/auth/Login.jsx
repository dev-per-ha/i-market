import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      const userData = {
        ...res.data.user,
        token: res.data.token,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      const role = userData.role;

      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "student") navigate("/student/dashboard");
      else if (role === "company") navigate("/company/dashboard");
      else if (role === "university") navigate("/university/dashboard");
      else if (role === "advisor") navigate("/advisor/dashboard");
      else if (role === "supervisor") navigate("/supervisor/dashboard");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0d1028] via-[#1c1f4c] to-[#05161b]">
      {/* BACKGROUND LIGHTS */}
      <div className="absolute top-[-120px] right-[-100px] w-[320px] h-[320px] bg-[#fec20f]/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-120px] left-[-100px] w-[320px] h-[320px] bg-[#00848c]/20 rounded-full blur-3xl"></div>

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "38px 38px",
        }}
      />

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24 pb-4">
        {/* CARD */}
        <div className="w-full max-w-[430px]">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
            {/* TOP BORDER */}
            <div className="h-[3px] bg-gradient-to-r from-[#00848c] via-[#fec20f] to-[#00848c]" />

            <div className="px-6 py-6">
              {/* ICON */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00848c] blur-2xl opacity-40 rounded-full"></div>

                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00848c] to-[#006b72] flex items-center justify-center border border-white/10">
                    <Sparkles size={22} className="text-white" />
                  </div>
                </div>
              </div>

              {/* TITLE */}
              <h1 className="text-2xl font-bold text-center text-white tracking-tight">
                Welcome Back
              </h1>

              <p className="text-center text-white/45 text-xs mt-1 mb-5">
                Login to continue your journey
              </p>

              {/* FORM */}
              <form onSubmit={handleLogin} className="space-y-3">
                {/* EMAIL */}
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />

                  
  <input
  type="email"
  name="email"
  value={form.email}
  onChange={handleChange}
  required
  placeholder="Email Address"
  className="w-full h-11 rounded-xl bg-[#0f1230]/60 border border-white/10 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00848c] focus:ring-2 focus:ring-[#00848c]/20 transition-all backdrop-blur-md"
/>               </div>

                {/* PASSWORD */}
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />

                  
<input
  type={showPassword ? "text" : "password"}
  name="password"
  value={form.password}
  onChange={handleChange}
  required
  placeholder="Password"
  className="w-full h-11 rounded-xl bg-[#0f1230]/60 border border-white/10 pl-10 pr-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#00848c] focus:ring-2 focus:ring-[#00848c]/20 transition-all backdrop-blur-md"
/>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#00848c] transition-all"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* FORGOT PASSWORD */}
                <div className="flex justify-end">
  <Link
    to="/forgot-password"
    className="text-[11px] text-white/40 hover:text-[#00848c] cursor-pointer transition-all"
  >
    Forgot password?
  </Link>
</div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  className="group relative w-full h-11 rounded-xl overflow-hidden bg-gradient-to-r from-[#00848c] to-[#006b72] hover:from-[#fec20f] hover:to-[#e5b00d] text-white hover:text-[#1c1f4c] font-semibold text-sm transition-all duration-500 shadow-lg shadow-[#00848c]/20"
                >
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                  <div className="relative flex items-center justify-center gap-2">
                    <LogIn
                      size={16}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    Login
                  </div>
                </button>
              </form>

              {/* DIVIDER */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-[#1b1e48] px-3 text-[10px] text-white/40 tracking-[0.25em]">
                    REGISTER
                  </span>
                </div>
              </div>

              {/* HORIZONTAL REGISTER LINKS */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => navigate("/register/student")}
                  className="h-10 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-medium text-[#00b7c2] hover:bg-[#00848c]/15 hover:border-[#00848c]/30 hover:text-white transition-all duration-300"
                >
                  Student
                </button>

                <button
                  onClick={() => navigate("/register/university")}
                  className="h-10 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-medium text-[#00b7c2] hover:bg-[#00848c]/15 hover:border-[#00848c]/30 hover:text-white transition-all duration-300"
                >
                  University
                </button>

                <button
                  onClick={() => navigate("/register/company")}
                  className="h-10 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-medium text-[#00b7c2] hover:bg-[#00848c]/15 hover:border-[#00848c]/30 hover:text-white transition-all duration-300"
                >
                  Company
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
