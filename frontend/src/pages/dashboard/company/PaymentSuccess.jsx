import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tx_ref = params.get("tx_ref"); // ONLY THIS
    const transaction_id = params.get("transaction_id");
    const reference = params.get("reference");

    console.log("TX_REF:", tx_ref);
    console.log("Transaction ID:", transaction_id);
    console.log("Reference:", reference);

    if (!tx_ref) {
      setStatus("failed");
      setErrorMessage(
        "No transaction reference found. Please contact support.",
      );
      return;
    }

    // Set a timeout for the verification request
    const timeoutId = setTimeout(() => {
      if (status === "verifying") {
        setStatus("failed");
        setErrorMessage(
          "Verification timeout. Please check your email for confirmation or contact support.",
        );
      }
    }, 30000); // 30 second timeout

    API.get(`/payment/verify?tx_ref=${tx_ref}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        clearTimeout(timeoutId);
        console.log("VERIFY RESPONSE:", res.data);

        if (res.data?.success === true) {
          setStatus("success");
          setPaymentDetails({
            creditsAdded: res.data.creditsAdded || 2,
            totalCredits: res.data.totalCredits,
            transactionId: res.data.transactionId || transaction_id,
          });
        } else {
          setStatus("failed");
          setErrorMessage(
            res.data?.message ||
              "Payment verification failed. Please contact support.",
          );
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        console.log("VERIFY ERROR:", err.response?.data || err.message);
        setStatus("failed");
        setErrorMessage(
          err.response?.data?.message ||
            "Unable to verify payment. Please check your email for confirmation or contact support.",
        );
      });

    return () => clearTimeout(timeoutId);
  }, [token]);

  // Loading State
  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 flex items-center justify-center p-6">
        <div className="relative max-w-md w-full">
          {/* Decorative background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-3xl blur-2xl"></div>

          <div className="relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/10 p-8 text-center">
            {/* Animated Loader */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-[#00848c]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-[#00848c] border-r-[#fec20f] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={32} className="text-[#00848c] animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-500 dark:text-white/40">
              Please wait while we confirm your transaction...
            </p>
            <div className="mt-4 flex justify-center gap-1">
              <div
                className="w-2 h-2 rounded-full bg-[#00848c] animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-[#00848c] animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-[#00848c] animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Failed State
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 flex items-center justify-center p-6">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-2xl"></div>

          <div className="relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/10 p-8 text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <XCircle
                size={48}
                className="text-red-500 dark:text-red-400"
                strokeWidth={1.5}
              />
            </div>

            <h1 className="text-2xl font-serif font-bold text-red-600 dark:text-red-400 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600 dark:text-white/60 mb-4">
              {errorMessage || "Something went wrong. Please try again."}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/company/post")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900 transition-all duration-300 shadow-lg"
              >
                <ArrowLeft size={18} />
                Return to Post Internship
              </button>

              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 ml-3"
              >
                Try Again
              </button>
            </div>

            <p className="mt-6 text-xs text-gray-400 dark:text-white/30">
              If funds were deducted, please contact support with your
              transaction reference.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1c1f4c] dark:to-[#1c1f4c]/95 flex items-center justify-center p-6">
      <div className="relative max-w-md w-full">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/30 to-[#fec20f]/30 rounded-3xl blur-2xl animate-pulse"></div>

        {/* Confetti effect overlay (decorative) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-[#fec20f] animate-float"></div>
          <div className="absolute top-10 right-1/3 w-3 h-3 rounded-full bg-[#00848c] animate-float animation-delay-500"></div>
          <div className="absolute top-20 left-1/2 w-2 h-2 rounded-full bg-[#fec20f] animate-float animation-delay-1000"></div>
          <div className="absolute top-32 right-1/4 w-2 h-2 rounded-full bg-[#00848c] animate-float animation-delay-1500"></div>
        </div>

        <div className="relative bg-white/90 dark:bg-[#1c1f4c]/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/10 p-8 text-center">
          {/* Success Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#00848c] to-[#006b72] flex items-center justify-center shadow-2xl">
              <CheckCircle size={56} className="text-white" strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-[#00848c] to-[#fec20f] bg-clip-text text-transparent mb-2">
            Payment Successful!
          </h1>

          {/* Success Message with dynamic credits */}
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 my-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={18} className="text-[#fec20f]" />
              <p className="text-gray-700 dark:text-white/80 font-medium">
                You unlocked{" "}
                <span className="font-bold text-[#00848c]">
                  {paymentDetails?.creditsAdded || 2}
                </span>{" "}
                more internship posts!
              </p>
            </div>
            {paymentDetails?.totalCredits !== undefined && (
              <p className="text-xs text-gray-500 dark:text-white/40">
                Total credits available: {paymentDetails.totalCredits}
              </p>
            )}
          </div>

          {/* Transaction Details (if available) */}
          {paymentDetails?.transactionId && (
            <div className="mb-6 p-3 rounded-lg bg-gray-50 dark:bg-white/5 text-left">
              <p className="text-xs text-gray-500 dark:text-white/40 font-mono">
                Transaction ID: {paymentDetails.transactionId}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/company/post")}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 shadow-lg shadow-[#00848c]/25 font-medium"
            >
              Post New Internship
              <TrendingUp
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={() => navigate("/company/dashboard")}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300"
            >
              Go to Dashboard
            </button>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-xs text-gray-400 dark:text-white/30">
            Need help? Contact our support team at support@i-market.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
