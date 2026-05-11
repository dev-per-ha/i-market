import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import API from "../../services/api";
import { Mail, ArrowLeft, Sparkles, Send } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/auth/forgot-password",
        { email }
      );

      alert(res.data.message);

      setEmail("");

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
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
                Forgot Password
              </h1>

              <p className="text-center text-white/45 text-xs mt-1 mb-5">
                Enter your email to receive a new password
              </p>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* EMAIL */}
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                    className="w-full h-11 rounded-xl bg-white/[0.05] border border-white/10 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00848c] focus:ring-2 focus:ring-[#00848c]/20 transition-all"
                  />
                </div>

                {/* SEND BUTTON */}
                <button
                  type="submit"
                  className="group relative w-full h-11 rounded-xl overflow-hidden bg-gradient-to-r from-[#00848c] to-[#006b72] hover:from-[#fec20f] hover:to-[#e5b00d] text-white hover:text-[#1c1f4c] font-semibold text-sm transition-all duration-500 shadow-lg shadow-[#00848c]/20"
                >
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                  <div className="relative flex items-center justify-center gap-2">
                    <Send
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                    Send New Password
                  </div>
                </button>
              </form>

              {/* BACK TO LOGIN */}
              <div className="mt-5 flex justify-center">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-[12px] text-white/40 hover:text-[#00848c] transition-all"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;