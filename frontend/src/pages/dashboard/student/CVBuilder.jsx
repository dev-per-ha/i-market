import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import jsPDF from "jspdf";
import {
  FileText,
  Phone,
  Plus,
  X,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Download,
  Edit2,
  Save,
  Eye,
  Award,
  Loader2,
} from "lucide-react";

const CVBuilder = () => {
  const [cv, setCV] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [form, setForm] = useState({
    phone: "",
    skills: [],
    education: [{ school: "", degree: "", year: "" }],
    experience: [{ title: "", company: "", duration: "" }],
    projects: [{ title: "", description: "" }],
  });

  const [skillInput, setSkillInput] = useState("");

  // =========================
  // 📥 FETCH CV
  // =========================
  useEffect(() => {
    const fetchCV = async () => {
      try {
        setLoading(true);

        // Fetch user profile to get name and email
        const profileRes = await API.get("/student/profile");
        if (profileRes.data) {
          setUserName(profileRes.data.name || "");
          setUserEmail(profileRes.data.email || "");
        }

        const res = await API.get("/student/cv");

        if (res.data && res.data._id) {
          const data = res.data;
          setCV(data);

          setForm({
            phone: data.phone || "",
            skills: data.skills || [],
            education:
              data.education?.length > 0
                ? data.education
                : [{ school: "", degree: "", year: "" }],
            experience:
              data.experience?.length > 0
                ? data.experience
                : [{ title: "", company: "", duration: "" }],
            projects:
              data.projects?.length > 0
                ? data.projects
                : [{ title: "", description: "" }],
          });

          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Failed to fetch CV:", err);
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);

  // =========================
  // 📝 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, field, section, value) => {
    const updated = [...form[section]];
    updated[index][field] = value;
    setForm({ ...form, [section]: updated });
  };

  const addItem = (section, template) => {
    setForm({
      ...form,
      [section]: [...form[section], template],
    });
  };

  const removeItem = (section, index) => {
    const updated = form[section].filter((_, i) => i !== index);
    setForm({ ...form, [section]: updated });
  };

  // =========================
  // ⭐ SKILLS
  // =========================
  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (form.skills.includes(skillInput.trim())) return;

    setForm({
      ...form,
      skills: [...form.skills, skillInput.trim()],
    });

    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm({
      ...form,
      skills: form.skills.filter((s) => s !== skill),
    });
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // =========================
  // 💾 SAVE CV
  // =========================
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await API.post("/cv", form);
      setCV(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save CV:", err);
      alert(err.response?.data?.message || "Failed to save CV");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // 📄 PROFESSIONAL PDF - Real CV Layout
  // =========================
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    const safeText = (text) =>
      text && text.trim() ? String(text) : "Not specified";
    const checkPage = () => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    };

    // ================= HEADER SECTION =================
    // Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(28, 31, 76); // Navy color
    const name = userName || "Your Name";
    doc.text(name, margin, y);
    y += 12;

    // Title/Subtitle line
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text("Professional CV / Resume", margin, y);
    y += 15;

    // Decorative line
    doc.setDrawColor(0, 132, 140);
    doc.setLineWidth(1.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 12;

    // ================= CONTACT INFORMATION =================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 132, 140);
    doc.text("CONTACT INFORMATION", margin, y);
    y += 8;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + 60, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    // Email
    if (userEmail) {
      doc.text(`✉  ${userEmail}`, margin, y);
      y += 7;
    }
    // Phone
    if (form.phone) {
      doc.text(`📞  ${form.phone}`, margin, y);
      y += 7;
    }

    if (!userEmail && !form.phone) {
      doc.text("No contact information provided", margin, y);
      y += 7;
    }
    y += 8;

    // ================= SKILLS SECTION =================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 132, 140);
    doc.text("TECHNICAL SKILLS", margin, y);
    y += 8;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, margin + 60, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    const skillsText =
      form.skills && form.skills.length > 0
        ? form.skills.join(" • ")
        : "No skills added yet";

    const splitSkills = doc.splitTextToSize(skillsText, contentWidth);
    doc.text(splitSkills, margin, y);
    y += splitSkills.length * 6 + 8;

    // ================= EDUCATION SECTION =================
    if (
      form.education &&
      form.education.length > 0 &&
      form.education[0].school
    ) {
      checkPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 132, 140);
      doc.text("EDUCATION", margin, y);
      y += 8;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, margin + 60, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);

      form.education.forEach((edu) => {
        if (edu.school || edu.degree) {
          checkPage();
          doc.setFont("helvetica", "bold");
          doc.setTextColor(28, 31, 76);
          doc.text(safeText(edu.degree), margin, y);
          y += 6;

          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          doc.text(safeText(edu.school), margin + 5, y);
          y += 5;

          doc.setFontSize(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`Year: ${safeText(edu.year)}`, margin + 5, y);
          y += 10;
          doc.setFontSize(11);
        }
      });
      y += 5;
    }

    // ================= EXPERIENCE SECTION =================
    if (
      form.experience &&
      form.experience.length > 0 &&
      form.experience[0].title
    ) {
      checkPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 132, 140);
      doc.text("PROFESSIONAL EXPERIENCE", margin, y);
      y += 8;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, margin + 70, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);

      form.experience.forEach((exp) => {
        if (exp.title || exp.company) {
          checkPage();
          doc.setFont("helvetica", "bold");
          doc.setTextColor(28, 31, 76);
          doc.text(safeText(exp.title), margin, y);
          y += 6;

          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          doc.text(safeText(exp.company), margin + 5, y);
          y += 5;

          doc.setFontSize(10);
          doc.setTextColor(120, 120, 120);
          doc.text(`Duration: ${safeText(exp.duration)}`, margin + 5, y);
          y += 10;
          doc.setFontSize(11);
        }
      });
      y += 5;
    }

    // ================= PROJECTS SECTION =================
    if (form.projects && form.projects.length > 0 && form.projects[0].title) {
      checkPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 132, 140);
      doc.text("KEY PROJECTS", margin, y);
      y += 8;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, margin + 60, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);

      form.projects.forEach((proj) => {
        if (proj.title) {
          checkPage();
          doc.setFont("helvetica", "bold");
          doc.setTextColor(28, 31, 76);
          doc.text(safeText(proj.title), margin, y);
          y += 6;

          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          const description = safeText(proj.description);
          const splitDesc = doc.splitTextToSize(description, contentWidth - 10);
          doc.text(splitDesc, margin + 5, y);
          y += splitDesc.length * 5 + 8;
        }
      });
    }

    // ================= FOOTER =================
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated by i-Market CV Builder • Page ${i} of ${pageCount}`,
        pageWidth / 2,
        285,
        { align: "center" },
      );
    }

    doc.save(`${userName.replace(/\s/g, "_") || "CV"}.pdf`);
  };

  const hasCVData =
    cv && (cv.phone || cv.skills?.length > 0 || cv.education?.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#00848c]/20 border-t-[#00848c] rounded-full animate-spin"></div>
          <p className="mt-4 text-white/70 text-sm">Loading your CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1f4c] to-[#1c1f4c]/95 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00848c] to-[#00848c]/80 shadow-lg shadow-[#00848c]/25">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              CV Builder
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Create and manage your professional resume
            </p>
          </div>
        </div>

        {/* PREVIEW MODE */}
        {!isEditing && hasCVData && (
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00848c]/20 to-transparent px-6 py-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye size={18} className="text-white/80" />
                    <h2 className="font-serif font-semibold text-lg text-white">
                      CV Preview
                    </h2>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-white/80 hover:bg-amber-500 hover:text-white transition-all duration-300 text-sm font-medium"
                    >
                      <Edit2 size={14} />
                      Edit CV
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 text-sm font-medium shadow-md"
                    >
                      <Download size={14} />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <h3 className="font-serif font-bold text-2xl text-white">
                    {userName || "Your Name"}
                  </h3>
                  {userEmail && (
                    <p className="text-white/50 text-sm">{userEmail}</p>
                  )}
                </div>

                {/* Contact */}
                {form.phone && (
                  <div className="flex items-center gap-2 text-white/70">
                    <Phone size={16} className="text-white/60" />
                    <span>{form.phone}</span>
                  </div>
                )}

                {/* Skills */}
                {form.skills?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Award size={16} className="text-white/60" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {form.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {form.education?.length > 0 && form.education[0].school && (
                  <div>
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <GraduationCap size={16} className="text-white/60" />
                      Education
                    </h3>
                    <div className="space-y-2">
                      {form.education.map((edu, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/5">
                          <p className="font-medium text-white">
                            {edu.degree || "Degree"}
                          </p>
                          <p className="text-sm text-white/40">
                            {edu.school} • {edu.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                {form.experience?.length > 0 && form.experience[0].title && (
                  <div>
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <Briefcase size={16} className="text-white/60" />
                      Experience
                    </h3>
                    <div className="space-y-2">
                      {form.experience.map((exp, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/5">
                          <p className="font-medium text-white">{exp.title}</p>
                          <p className="text-sm text-white/40">
                            {exp.company} • {exp.duration}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {form.projects?.length > 0 && form.projects[0].title && (
                  <div>
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                      <FolderKanban size={16} className="text-white/60" />
                      Projects
                    </h3>
                    <div className="space-y-2">
                      {form.projects.map((proj, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/5">
                          <p className="font-medium text-white">{proj.title}</p>
                          <p className="text-sm text-white/40">
                            {proj.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!isEditing && !hasCVData && (
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-white/5">
                  <FileText size={48} className="text-white/20" />
                </div>
                <p className="text-white/50 font-medium">No CV created yet</p>
                <p className="text-sm text-white/30">
                  Create your professional CV using the form below
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 px-6 py-2 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300"
                >
                  Create CV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODE FORM */}
        {isEditing && (
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00848c]/20 to-transparent px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Edit2 size={18} className="text-white/80" />
                  <h2 className="font-serif font-semibold text-lg text-white">
                    {hasCVData ? "Edit Your CV" : "Create Your CV"}
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                      placeholder="+251 900 123 456"
                    />
                  </div>
                </div>

                {/* SKILLS */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Technical Skills
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={handleSkillKeyPress}
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                      placeholder="e.g., React, Python, SQL"
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-400 transition"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* EDUCATION SECTION */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <GraduationCap size={16} className="text-white/60" />
                      Education
                    </label>
                    <button
                      onClick={() =>
                        addItem("education", {
                          school: "",
                          degree: "",
                          year: "",
                        })
                      }
                      className="text-xs text-white/60 hover:text-[#fec20f] transition flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Education
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.education.map((edu, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="grid sm:grid-cols-3 gap-3 mb-2">
                          <input
                            value={edu.degree}
                            onChange={(e) =>
                              handleArrayChange(
                                i,
                                "degree",
                                "education",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                            placeholder="Degree"
                          />
                          <input
                            value={edu.school}
                            onChange={(e) =>
                              handleArrayChange(
                                i,
                                "school",
                                "education",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                            placeholder="School/University"
                          />
                          <input
                            value={edu.year}
                            onChange={(e) =>
                              handleArrayChange(
                                i,
                                "year",
                                "education",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                            placeholder="Year"
                          />
                        </div>
                        {form.education.length > 1 && (
                          <button
                            onClick={() => removeItem("education", i)}
                            className="text-xs text-red-400 hover:text-red-300 transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXPERIENCE SECTION */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Briefcase size={16} className="text-white/60" />
                      Work Experience
                    </label>
                    <button
                      onClick={() =>
                        addItem("experience", {
                          title: "",
                          company: "",
                          duration: "",
                        })
                      }
                      className="text-xs text-white/60 hover:text-[#fec20f] transition flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Experience
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.experience.map((exp, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="grid sm:grid-cols-3 gap-3 mb-2">
                          <input
                            value={exp.title}
                            onChange={(e) =>
                              handleArrayChange(
                                i,
                                "title",
                                "experience",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                            placeholder="Job Title"
                          />
                          <input
                            value={exp.company}
                            onChange={(e) =>
                              handleArrayChange(
                                i,
                                "company",
                                "experience",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                            placeholder="Company"
                          />
                          <input
                            value={exp.duration}
                            onChange={(e) =>
                              handleArrayChange(
                                i,
                                "duration",
                                "experience",
                                e.target.value,
                              )
                            }
                            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                            placeholder="Duration"
                          />
                        </div>
                        {form.experience.length > 1 && (
                          <button
                            onClick={() => removeItem("experience", i)}
                            className="text-xs text-red-400 hover:text-red-300 transition"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PROJECTS SECTION */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <FolderKanban size={16} className="text-white/60" />
                      Projects
                    </label>
                    <button
                      onClick={() =>
                        addItem("projects", { title: "", description: "" })
                      }
                      className="text-xs text-white/60 hover:text-[#fec20f] transition flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Project
                    </button>
                  </div>
                  <div className="space-y-3">
                    {form.projects.map((proj, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <input
                          value={proj.title}
                          onChange={(e) =>
                            handleArrayChange(
                              i,
                              "title",
                              "projects",
                              e.target.value,
                            )
                          }
                          className="w-full mb-2 px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30"
                          placeholder="Project Title"
                        />
                        <textarea
                          value={proj.description}
                          onChange={(e) =>
                            handleArrayChange(
                              i,
                              "description",
                              "projects",
                              e.target.value,
                            )
                          }
                          rows={2}
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00848c] text-white placeholder:text-white/30 resize-none"
                          placeholder="Project Description"
                        />
                        {form.projects.length > 1 && (
                          <button
                            onClick={() => removeItem("projects", i)}
                            className="text-xs text-red-400 hover:text-red-300 transition mt-2"
                          >
                            Remove Project
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* SAVE BUTTON */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72] text-white hover:from-[#fec20f] hover:to-[#e5b00d] hover:text-[#1c1f4c] transition-all duration-300 disabled:opacity-50 font-semibold shadow-lg shadow-[#00848c]/25"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {saving ? "Saving..." : "Save CV"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVBuilder;
