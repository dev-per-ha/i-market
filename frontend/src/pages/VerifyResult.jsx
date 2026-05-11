import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  LogIn,
  Sparkles,
} from "lucide-react";

const VerifyResult = () => {
  const [params] = useSearchParams();
  const status = params.get("status");
  const navigate = useNavigate();

  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          title: "Account Activated!",
          message:
            "Thank you! Your account has been successfully activated. You can now log in to your account.",
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          border: "border-emerald-200 dark:border-emerald-500/20",
          icon: (
            <CheckCircle
              size={64}
              className="text-emerald-500"
              strokeWidth={1.5}
            />
          ),
          buttonText: "Go to Login",
        };
      case "invalid":
        return {
          title: "Invalid Link",
          message:
            "This verification link is invalid or has expired. Please request a new verification email.",
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-50 dark:bg-red-500/10",
          border: "border-red-200 dark:border-red-500/20",
          icon: (
            <XCircle size={64} className="text-red-500" strokeWidth={1.5} />
          ),
          buttonText: "Back to Login",
        };
      case "rejected":
        return {
          title: "Account Rejected",
          message:
            "Your registration has been rejected. Please contact support for more information.",
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-500/10",
          border: "border-amber-200 dark:border-amber-500/20",
          icon: (
            <AlertCircle
              size={64}
              className="text-amber-500"
              strokeWidth={1.5}
            />
          ),
          buttonText: "Contact Support",
        };
      default:
        return {
          title: "Something Went Wrong",
          message:
            "An unexpected error occurred. Please try again or contact support.",
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-50 dark:bg-white/5",
          border: "border-gray-200 dark:border-white/10",
          icon: (
            <AlertCircle
              size={64}
              className="text-gray-400"
              strokeWidth={1.5}
            />
          ),
          buttonText: "Go to Login",
        };
    }
  };

  const config = getStatusConfig();

  const handleButtonClick = () => {
    if (status === "rejected") {
      window.location.href = "mailto:support@i-market.com";
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 flex items-center justify-center p-6">
      {/* Decorative Background Orbs */}
      <div className="absolute top-[-120px] right-[-80px] w-96 h-96 bg-[#fec20f]/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-[-80px] w-80 h-80 bg-[#00848c]/20 rounded-full blur-3xl animate-pulse animation-delay-1000 pointer-events-none"></div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(28,31,76,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28,31,76,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Verification Card */}
      <div className="relative max-w-md w-full">
        {/* Glow Effect */}
        <div
          className={`absolute -inset-0.5 rounded-3xl blur-xl opacity-30 ${
            status === "success"
              ? "bg-gradient-to-r from-emerald-500 to-[#00848c]"
              : status === "invalid"
                ? "bg-gradient-to-r from-red-500 to-rose-500"
                : status === "rejected"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-gray-500 to-gray-600"
          }`}
        ></div>

        {/* Main Card */}
        <div className="relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className={`p-4 rounded-full ${config.bg} border ${config.border}`}
            >
              {config.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className={`text-2xl font-serif font-bold mb-3 ${config.color}`}>
            {config.title}
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed mb-6">
            {config.message}
          </p>

          {/* Button */}
          <button
            onClick={handleButtonClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 font-medium shadow-lg shadow-[#00848c]/25 hover:shadow-[#fec20f]/25"
          >
            <LogIn size={16} />
            {config.buttonText}
          </button>

          {/* Decorative Line */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 dark:text-white/30 font-mono">
              <Sparkles size={10} />
              <span>i-Market Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyResult;
