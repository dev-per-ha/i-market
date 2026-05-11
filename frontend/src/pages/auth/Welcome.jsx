// frontend/src/pages/auth/Landing.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  Users,
  Building2,
  GraduationCap,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Linkedin,
  ChevronDown,
  ArrowRight,
  Quote,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const heroRef = useRef(null);

  // FAQ state
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  // Parallax scroll effect
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqs = [
    {
      q: "How do students apply for internships?",
      a: "Students can register, browse curated postings, and apply directly on the platform with their professional profile.",
    },
    {
      q: "How are companies verified?",
      a: "All companies must register and undergo a thorough admin approval process to ensure quality internships.",
    },
    {
      q: "Can universities track student progress?",
      a: "Yes, universities have dedicated dashboards to monitor applications, placements, and internship outcomes in real-time.",
    },
    {
      q: "Is the platform free for students?",
      a: "Absolutely. Students can register, build profiles, and apply to internships completely free of charge.",
    },
  ];

  const stats = [
    { value: "500+", label: "Internships" },
    { value: "50+", label: "Companies" },
    { value: "30+", label: "Universities" },
    { value: "2,000+", label: "Students Placed" },
  ];

  const testimonials = [
    {
      text: "This platform transformed how we connect with talented interns. The process is seamless and professional.",
      author: "Sarah Chen",
      role: "CTO, TechVentures",
      initials: "SC",
    },
    {
      text: "I found my dream internship in just two weeks. The matching algorithm really understands my skills.",
      author: "Abebe Kebede",
      role: "Computer Science Student",
      initials: "AK",
    },
    {
      text: "Managing student placements has never been easier. We can track everything from one dashboard.",
      author: "Dr. Mulu Tesfaye",
      role: "Dean, College of Engineering",
      initials: "MT",
    },
  ];

  return (
    <div className="min-h-screen bg-[#edebd9] overflow-x-hidden">
      <Navbar />

      {/* ==================== HERO ==================== */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-16 lg:pt-20"
        style={{
          background:
            "linear-gradient(175deg, #edebd9 0%, #edebd9 60%, #1c1f4c 60.5%, #1c1f4c 100%)",
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-32 left-20 w-72 h-72 bg-[#00848c]/8 rounded-full blur-4xl pointer-events-none" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-[#fec20f]/6 rounded-full blur-4xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-[#037272]/5 rounded-full blur-4xl pointer-events-none" />

        {/* Floating decorative shapes */}
        <div className="absolute top-28 right-32 w-16 h-16 border-2 border-[#fec20f]/20 rounded-2xl rotate-12 pointer-events-none animate-float-slow" />
        <div className="absolute bottom-52 left-24 w-12 h-12 border-2 border-[#00848c]/15 rounded-full pointer-events-none animate-float" />
        <div
          className="absolute top-1/3 right-1/3 w-8 h-8 bg-[#fec20f]/8 rounded-lg -rotate-6 pointer-events-none animate-float-slow"
          style={{ animationDelay: "1s" }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1c1f4c 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-6xl mx-auto text-center z-10">
          {/* Main Heading */}
          <h1
            className="font-serif text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] text-[#1c1f4c] animate-fadeInUp"
            style={{ animationDelay: "0.1s" }}
          >
            Where Talent
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#00848c] via-[#037272] to-[#00848c] bg-clip-text text-transparent">
                Meets Opportunity
              </span>
              <svg
                className="absolute -bottom-3 left-0 w-full h-3 text-[#fec20f]/40"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 6 Q50 0 100 6 Q150 12 200 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-[#1c1f4c]/50 max-w-xl mx-auto leading-relaxed mb-12 font-medium animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            The elegant internship marketplace connecting ambitious students,
            forward-thinking universities, and innovative companies.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-5 justify-center animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={() => navigate("/login")}
              className="group relative overflow-hidden bg-[#00848c] text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-2xl shadow-[#00848c]/25 hover:shadow-[#00848c]/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-500"
            >
              <span className="relative z-10 inline-flex items-center gap-2.5">
                Get Started
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1.5 transition-transform duration-500"
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] via-[#037272] to-[#00848c] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
            <button
              onClick={() =>
                aboutRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-10 py-4 rounded-2xl text-lg font-bold text-[#1c1f4c] border-2 border-[#1c1f4c]/10 hover:border-[#00848c]/40 hover:text-[#00848c] hover:bg-white/60 backdrop-blur-sm transition-all duration-500"
            >
              Explore More
            </button>
          </div>

          {/* Stats Row */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto animate-fadeInUp"
            style={{ animationDelay: "0.4s" }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-serif text-3xl md:text-4xl font-black text-[#1c1f4c] mb-1">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1c1f4c]/30">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-white/40 animate-scroll" />
          </div>
        </div>
      </section>

      {/* ==================== ABOUT ==================== */}
      <section
        id="about"
        ref={aboutRef}
        className="relative py-32 px-6 bg-[#1c1f4c] overflow-hidden"
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 30px)",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image/Visual */}
            <div className="relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-[#00848c]/30 via-[#037272]/20 to-[#fec20f]/20 border border-white/5 backdrop-blur-sm" />
                <div className="absolute inset-8 rounded-2xl bg-gradient-to-br from-[#00848c]/40 via-[#037272]/30 to-[#fec20f]/30 border border-white/10" />
                <div className="absolute inset-12 rounded-xl bg-gradient-to-br from-[#00848c] to-[#037272] flex items-center justify-center shadow-2xl shadow-[#00848c]/20">
                  <Users size={64} className="text-white/80" />
                </div>
                {/* Floating card */}
                <div className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl">
                  <p className="text-white/80 text-sm font-semibold">500+</p>
                  <p className="text-white/40 text-xs">Internships</p>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-[#fec20f]/20 backdrop-blur-xl rounded-2xl p-4 border border-[#fec20f]/20 shadow-xl">
                  <p className="text-[#fec20f] text-sm font-semibold">98%</p>
                  <p className="text-[#fec20f]/60 text-xs">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fec20f]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fec20f]">
                  About Us
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1]">
                Bridging the gap between{" "}
                <span className="text-[#fec20f]">education</span> and{" "}
                <span className="text-[#00848c]">industry</span>
              </h2>
              <p className="text-white/40 text-lg leading-relaxed mb-8 max-w-lg">
                We believe every student deserves access to meaningful
                internship opportunities. Our platform connects the dots between
                academic excellence and professional growth, creating a seamless
                ecosystem for talent development.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle size={16} className="text-[#00848c]" />
                  <span className="text-sm text-white/60 font-medium">
                    Verified Companies
                  </span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle size={16} className="text-[#00848c]" />
                  <span className="text-sm text-white/60 font-medium">
                    Real-time Tracking
                  </span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <CheckCircle size={16} className="text-[#00848c]" />
                  <span className="text-sm text-white/60 font-medium">
                    AI-Powered Matching
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section
        id="how"
        className="relative py-32 px-6 bg-[#edebd9] overflow-hidden"
      >
        {/* Decorative wave top */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#1c1f4c] rounded-b-[50%] scale-x-150" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fec20f]/10 border border-[#fec20f]/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fec20f]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
                How It Works
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-black text-[#1c1f4c] mb-6">
              Three simple steps
            </h2>
            <p className="text-[#1c1f4c]/40 text-lg max-w-xl mx-auto">
              Getting started is easy — whether you're a student, company, or
              university
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[#00848c]/20 via-[#fec20f]/40 to-[#00848c]/20" />

            {/* Student Card */}
            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-lg shadow-[#1c1f4c]/3 border border-[#1c1f4c]/5 hover:shadow-2xl hover:shadow-[#00848c]/10 hover:-translate-y-3 transition-all duration-700 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00848c]/10 to-[#037272]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#00848c] group-hover:text-white transition-all duration-500">
                  <Users
                    size={36}
                    className="text-[#00848c] group-hover:text-white transition-colors duration-500"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#00848c] text-white rounded-full flex items-center justify-center text-lg font-black shadow-xl shadow-[#00848c]/30">
                  1
                </div>
                <h3 className="font-serif text-2xl font-black text-[#1c1f4c] mb-4">
                  Students
                </h3>
                <p className="text-[#1c1f4c]/50 leading-relaxed">
                  Create your profile, upload your CV, and let our System match
                  you with the perfect internship opportunities.
                </p>
              </div>
            </div>

            {/* Company Card */}
            <div className="relative group mt-8 md:mt-16">
              <div className="bg-white rounded-3xl p-8 shadow-lg shadow-[#1c1f4c]/3 border border-[#1c1f4c]/5 hover:shadow-2xl hover:shadow-[#fec20f]/10 hover:-translate-y-3 transition-all duration-700 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#fec20f]/10 to-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#fec20f] group-hover:text-[#1c1f4c] transition-all duration-500">
                  <Building2
                    size={36}
                    className="text-[#fec20f] group-hover:text-[#1c1f4c] transition-colors duration-500"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#fec20f] text-[#1c1f4c] rounded-full flex items-center justify-center text-lg font-black shadow-xl shadow-[#fec20f]/30">
                  2
                </div>
                <h3 className="font-serif text-2xl font-black text-[#1c1f4c] mb-4">
                  Companies
                </h3>
                <p className="text-[#1c1f4c]/50 leading-relaxed">
                  Post internship opportunities and connect with pre-vetted,
                  skilled students ready to contribute.
                </p>
              </div>
            </div>

            {/* University Card */}
            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-lg shadow-[#1c1f4c]/3 border border-[#1c1f4c]/5 hover:shadow-2xl hover:shadow-[#00848c]/10 hover:-translate-y-3 transition-all duration-700 relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00848c]/10 to-[#037272]/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#00848c] group-hover:text-white transition-all duration-500">
                  <GraduationCap
                    size={36}
                    className="text-[#00848c] group-hover:text-white transition-colors duration-500"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#00848c] text-white rounded-full flex items-center justify-center text-lg font-black shadow-xl shadow-[#00848c]/30">
                  3
                </div>
                <h3 className="font-serif text-2xl font-black text-[#1c1f4c] mb-4">
                  Universities
                </h3>
                <p className="text-[#1c1f4c]/50 leading-relaxed">
                  Monitor student progress, track placements, and strengthen
                  your institution's industry connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-32 px-6 bg-[#1c1f4c] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#fec20f]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fec20f]">
              Testimonials
            </span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl font-black text-white mb-6">
            Loved by everyone
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white/[0.03] backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:bg-white/[0.06] hover:-translate-y-2 transition-all duration-500"
            >
              <Quote size={32} className="text-[#fec20f]/30 mb-6" />
              <p className="text-white/60 leading-relaxed mb-8 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00848c] to-[#037272] flex items-center justify-center font-bold text-white text-sm">
                  {t.initials}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">{t.author}</p>
                  <p className="text-white/30 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section id="faq" className="py-32 px-6 bg-[#edebd9]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1f4c]/5 border border-[#1c1f4c]/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c1f4c]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1c1f4c]/40">
                FAQ
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-black text-[#1c1f4c]">
              Got questions?
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
                  openIndex === idx
                    ? "bg-white border-[#00848c]/20 shadow-xl shadow-[#00848c]/5"
                    : "bg-white/50 border-[#1c1f4c]/5 hover:border-[#00848c]/10 hover:bg-white/80 hover:shadow-lg"
                }`}
                onClick={() => toggleFAQ(idx)}
              >
                <div className="flex justify-between items-center p-6 cursor-pointer">
                  <h3
                    className={`font-serif font-bold text-lg transition-colors duration-300 ${
                      openIndex === idx ? "text-[#00848c]" : "text-[#1c1f4c]"
                    }`}
                  >
                    {faq.q}
                  </h3>
                  <span
                    className={`flex-shrink-0 ml-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                      openIndex === idx
                        ? "bg-[#00848c] text-white rotate-180 shadow-lg shadow-[#00848c]/20"
                        : "bg-[#1c1f4c]/3 text-[#1c1f4c]/30 group-hover:bg-[#1c1f4c]/5"
                    }`}
                  >
                    <ChevronDown size={20} />
                  </span>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    openIndex === idx ? "max-h-96 pb-6 px-6" : "max-h-0"
                  }`}
                >
                  <p className="text-[#1c1f4c]/50 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CONTACT ==================== */}
      <section
        id="contact"
        className="py-32 px-6 bg-[#1c1f4c] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-16 bg-[#edebd9] rounded-b-[50%] scale-x-150" />

        <div className="max-w-5xl mx-auto relative mt-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fec20f]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fec20f]">
                Get In Touch
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-black text-white mb-6">
              Let's connect
            </h2>
            <p className="text-white/30 text-lg max-w-lg mx-auto">
              Have questions or want to partner with us? We'd love to hear from
              you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="group bg-white/[0.03] backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:bg-white/[0.06] hover:-translate-y-3 transition-all duration-700 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00848c]/20 to-[#037272]/20 flex items-center justify-center mx-auto mb-6 group-hover:from-[#00848c] group-hover:to-[#037272] transition-all duration-500">
                <Phone
                  size={32}
                  className="text-[#00848c] group-hover:text-white transition-colors duration-500"
                />
              </div>
              <h4 className="font-serif text-xl font-bold text-white mb-3">
                Phone
              </h4>
              <p className="text-white/40 font-medium">+251 900 123 456</p>
            </div>

            {/* Email */}
            <div className="group bg-white/[0.03] backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:bg-white/[0.06] hover:-translate-y-3 transition-all duration-700 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#fec20f]/20 to-amber-500/20 flex items-center justify-center mx-auto mb-6 group-hover:from-[#fec20f] group-hover:to-amber-500 transition-all duration-500">
                <Mail
                  size={32}
                  className="text-[#fec20f] group-hover:text-[#1c1f4c] transition-colors duration-500"
                />
              </div>
              <h4 className="font-serif text-xl font-bold text-white mb-3">
                Email
              </h4>
              <p className="text-white/40 font-medium">support@i-market.com</p>
            </div>

            {/* Social */}
            <div className="group bg-white/[0.03] backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:bg-white/[0.06] hover:-translate-y-3 transition-all duration-700 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00848c]/20 to-[#037272]/20 flex items-center justify-center mx-auto mb-6 group-hover:from-[#00848c] group-hover:to-[#037272] transition-all duration-500">
                <Instagram
                  size={32}
                  className="text-[#00848c] group-hover:text-white transition-colors duration-500"
                />
              </div>
              <h4 className="font-serif text-xl font-bold text-white mb-3">
                Social
              </h4>
              <div className="flex justify-center gap-3">
                {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 hover:bg-[#00848c] hover:text-white transition-all duration-300 hover:-translate-y-1"
                  >
                    <Icon size={22} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 px-6 bg-[#1c1f4c] border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00848c] to-[#037272] flex items-center justify-center">
              <span className="text-white font-black text-sm">i</span>
            </div>
            <p className="text-sm text-white/20 font-medium">
              &copy; {new Date().getFullYear()} i-Market Platform
            </p>
          </div>
          <div className="flex gap-8 text-xs text-white/15">
            <span className="hover:text-[#fec20f] cursor-pointer transition-colors duration-300 font-medium">
              Privacy Policy
            </span>
            <span className="hover:text-[#fec20f] cursor-pointer transition-colors duration-300 font-medium">
              Terms of Service
            </span>
            <span className="hover:text-[#fec20f] cursor-pointer transition-colors duration-300 font-medium">
              Contact
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ==================== CheckCircle Component (inline) ====================
const CheckCircle = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8 12l3 3 5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Landing;
