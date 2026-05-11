// frontend/src/components/Navbar.jsx
import { useState } from "react";
import { Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to section if on landing page
  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300); // wait for landing page render
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false); // close mobile menu
  };

  return (
    <div className="w-full fixed top-0 z-50 backdrop-blur-2xl bg-white/80 dark:bg-[#1c1f4c]/80 border-b border-white/20 dark:border-white/10 shadow-xl shadow-black/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-8 py-4 lg:py-5">
        {/* PREMIUM LOGO */}
        <div
          className="group relative flex items-center gap-2 cursor-pointer"
          onClick={() => scrollTo("hero")}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/0 via-[#fec20f]/0 to-[#00848c]/0 rounded-2xl blur-xl transition-all duration-700 group-hover:from-[#00848c]/20 group-hover:via-[#fec20f]/10 group-hover:to-[#00848c]/20"></div>

          {/* Logo icon */}
          <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#00848c] to-[#00848c]/80 rounded-xl flex items-center justify-center shadow-lg shadow-[#00848c]/25">
            <Sparkles
              className="w-4 h-4 lg:w-5 lg:h-5 text-white"
              strokeWidth={1.5}
            />
          </div>

          {/* Logo text */}
          <div className="relative">
            <span className="text-2xl lg:text-3xl font-serif font-bold tracking-tight bg-gradient-to-r from-[#1c1f4c] to-[#00848c] dark:from-white dark:to-white/80 bg-clip-text text-transparent">
              i-Market
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00848c] to-[#fec20f] group-hover:w-full transition-all duration-500"></div>
          </div>
        </div>

        {/* DESKTOP LINKS - Premium styling */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-base lg:text-lg font-medium">
          <button
            onClick={() => scrollTo("about")}
            className="group relative text-gray-700 dark:text-white/80 hover:text-[#00848c] dark:hover:text-[#00848c] transition-all duration-300 font-medium tracking-wide"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00848c] to-[#fec20f] group-hover:w-full transition-all duration-500"></span>
          </button>

          <button
            onClick={() => scrollTo("how")}
            className="group relative text-gray-700 dark:text-white/80 hover:text-[#00848c] dark:hover:text-[#00848c] transition-all duration-300 font-medium tracking-wide"
          >
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00848c] to-[#fec20f] group-hover:w-full transition-all duration-500"></span>
          </button>

          <button
            onClick={() => scrollTo("contact")}
            className="group relative text-gray-700 dark:text-white/80 hover:text-[#00848c] dark:hover:text-[#00848c] transition-all duration-300 font-medium tracking-wide"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00848c] to-[#fec20f] group-hover:w-full transition-all duration-500"></span>
          </button>

          <button
            onClick={() => navigate("/login")}
            className="group relative bg-gradient-to-r from-[#00848c] to-[#00848c]/80 hover:from-[#fec20f] hover:to-[#fec20f]/90 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-[#00848c]/25 hover:shadow-xl hover:shadow-[#fec20f]/30 transition-all duration-300 font-medium tracking-wide overflow-hidden"
          >
            {/* Button hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative flex items-center gap-2">
              Get Started
              <ArrowRight
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                strokeWidth={2}
              />
            </span>
          </button>
        </div>

        {/* MOBILE MENU BUTTON - Premium */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-[#00848c]/10 hover:border-[#00848c]/30 transition-all duration-300 group"
          >
            {open ? (
              <X className="w-5 h-5 text-gray-700 dark:text-white/80 group-hover:text-[#00848c] transition-colors" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700 dark:text-white/80 group-hover:text-[#00848c] transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN - Premium glassmorphism */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-2 space-y-3 bg-white/95 dark:bg-[#1c1f4c]/95 backdrop-blur-xl border-t border-white/20 dark:border-white/10 animate-fadeIn shadow-2xl">
          <button
            className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 dark:text-white/80 hover:text-[#00848c] dark:hover:text-[#00848c] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all duration-300"
            onClick={() => scrollTo("about")}
          >
            About
          </button>

          <button
            className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 dark:text-white/80 hover:text-[#00848c] dark:hover:text-[#00848c] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all duration-300"
            onClick={() => scrollTo("how")}
          >
            How It Works
          </button>

          <button
            className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 dark:text-white/80 hover:text-[#00848c] dark:hover:text-[#00848c] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all duration-300"
            onClick={() => scrollTo("contact")}
          >
            Contact
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-[#00848c] to-[#00848c]/80 hover:from-[#fec20f] hover:to-[#fec20f]/90 text-white py-3 rounded-xl mt-4 shadow-lg shadow-[#00848c]/25 hover:shadow-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 group"
          >
            Get Started
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              strokeWidth={2}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
