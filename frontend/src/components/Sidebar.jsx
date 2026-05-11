import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Users,
  Settings,
  LogOut,
  GraduationCap,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
const [passwordForm, setPasswordForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const [passwordLoading, setPasswordLoading] =
  useState(false);


  // safer parsing (avoids crash if null)
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const [appliedInternships, setAppliedInternships] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("appliedInternships")) || [];
    setAppliedInternships(saved);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
const handlePasswordChange = (e) => {
  setPasswordForm({
    ...passwordForm,
    [e.target.name]: e.target.value,
  });
};

const changePassword = async () => {
  try {
    setPasswordLoading(true);

    const token =
      user?.token ||
      JSON.parse(localStorage.getItem("user"))?.token;

    const res = await fetch(
      "http://localhost:5000/api/auth/change-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordForm),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Password updated successfully");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  } catch (error) {

    console.error(error);

    alert("Failed to update password");

  } finally {

    setPasswordLoading(false);
  }
};
  const baseClass =
    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium tracking-wide";

  const activeClass =
    "bg-gradient-to-r from-[#00848c] to-[#00848c]/80 text-white shadow-lg shadow-[#00848c]/25";

  // ✅ FIXED: Hover now uses white text with a subtle background instead of teal
  const hoverClass = "hover:bg-white/15 hover:text-white";

  const appliedClass =
    "bg-gradient-to-r from-[#fec20f] to-[#fec20f]/80 text-[#1c1f4c] shadow-lg shadow-[#fec20f]/25";

  const getLinkClass = (isActive, internshipId = null) => {
    if (internshipId && appliedInternships.includes(internshipId)) {
      return `${baseClass} ${appliedClass}`;
    }
    return `${baseClass} ${hoverClass} ${isActive ? activeClass : "text-white/80"}`;
  };

  const deleteAccount = async () => {
    try {
      setLoading(true);

      const role = user?.role;
      const token =
        user?.token || JSON.parse(localStorage.getItem("user"))?.token;

      const res = await fetch(
        `http://localhost:5000/api/${role}/delete-account`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: confirmPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete account");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FIXED SIDEBAR - non-scrollable */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-[#1c1f4c] to-[#1c1f4c]/95 backdrop-blur-sm text-white flex flex-col transition-all duration-300 z-40 shadow-2xl shadow-black/30 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {/* PREMIUM LOGO SECTION - fixed top */}
        <div className="relative group border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00848c]/20 to-[#fec20f]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div
            className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-5 py-6 relative z-10`}
          >
            {!collapsed ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-xl blur-lg opacity-50"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-[#00848c] to-[#00848c]/80 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles
                        className="w-5 h-5 text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-serif font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent tracking-tight">
                      i-Market
                    </span>
                    <span className="text-[9px] text-white/40 font-mono tracking-wider uppercase">
                      {user?.role || "Platform"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00848c] to-[#fec20f] rounded-xl blur-lg opacity-50"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-[#00848c] to-[#00848c]/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION MENU - flex-1 with overflow-y-auto for scrolling only menu items */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 custom-scrollbar">
          <div className="space-y-1.5">
            {/* STUDENT */}
            {user?.role === "student" && (
              <>
                <NavLink
                  to="/student/dashboard"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <LayoutDashboard size={18} />
                  {!collapsed && "Dashboard"}
                </NavLink>

                <NavLink
                  to="/student/profile"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <User size={18} />
                  {!collapsed && "My Profile"}
                </NavLink>

                <NavLink
                  to="/student/cv"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <FileText size={18} />
                  {!collapsed && "Create CV"}
                </NavLink>

                <NavLink
                  to="/student/internships/all"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <Briefcase size={18} />
                  {!collapsed && "Internships"}
                </NavLink>

                <NavLink
                  to="/student/internships"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <FileText size={18} />
                  {!collapsed && "Suggested"}
                </NavLink>

                <NavLink
                  to="/student/applications"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <Users size={18} />
                  {!collapsed && "Applications"}
                </NavLink>
              </>
            )}

            {/* COMPANY */}
            {user?.role === "company" && (
              <>
                <NavLink
                  to="/company/dashboard"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <LayoutDashboard size={18} />
                  {!collapsed && "Dashboard"}
                </NavLink>

                <NavLink
                  to="/company/post"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <Briefcase size={18} />
                  {!collapsed && "Post Internship"}
                </NavLink>

                <NavLink
                  to="/company/add-supervisor"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <User size={18} />
                  {!collapsed && "Supervisor"}
                </NavLink>

                <NavLink
                  to="/company/applications"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <Users size={18} />
                  {!collapsed && "Applications"}
                </NavLink>

                <NavLink
                  to="/company/assign-student"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <Users size={18} />
                  {!collapsed && "Assign student"}
                </NavLink>
              </>
            )}

            {/* UNIVERSITY */}
            {user?.role === "university" && (
              <>
                <NavLink
                  to="/university/dashboard"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <LayoutDashboard size={18} />
                  {!collapsed && "Dashboard"}
                </NavLink>

                <NavLink
                  to="/university/advisors"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <Users size={18} />
                  {!collapsed && "Advisors"}
                </NavLink>

                <NavLink
                  to="/university/students"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <GraduationCap size={18} />
                  {!collapsed && "Students"}
                </NavLink>

                <NavLink
                  to="/university/applications"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <FileText size={18} />
                  {!collapsed && "Applications"}
                </NavLink>
              </>
            )}

            {/* ADMIN */}
            {user?.role === "admin" && (
              <>
                {!collapsed && (
                  <div className="mt-4 mb-2 px-3">
                    <p className="text-[10px] font-mono tracking-wider text-white/30 uppercase">
                      Admin Panel
                    </p>
                  </div>
                )}

                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <LayoutDashboard size={18} />
                  {!collapsed && "Dashboard"}
                </NavLink>

                <NavLink
                  to="/admin/users"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <Users size={18} />
                  {!collapsed && "Users"}
                </NavLink>

                <NavLink
                  to="/admin/internships"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <Briefcase size={18} />
                  {!collapsed && "Internships"}
                </NavLink>

                <NavLink
                  to="/admin/applications"
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  <FileText size={18} />
                  {!collapsed && "Applications"}
                </NavLink>
              </>
            )}

            {/* SETTINGS (non-admin only) */}
            {user?.role && (
  <button
    onClick={() => setShowSettings(true)}
    className={`${baseClass} hover:bg-white/15 hover:text-white text-white/80 w-full mt-2`}
  >
    <Settings size={18} />
    {!collapsed && "Settings"}
  </button>
)}
          </div>
        </div>

        {/* LOGOUT BUTTON - fixed bottom */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="group relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500 hover:to-red-600 py-2.5 rounded-xl transition-all duration-300 overflow-hidden border border-red-500/30 hover:border-red-500/60"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/20 group-hover:via-red-500/10 transition-all duration-500"></div>
            <LogOut
              size={18}
              className="relative z-10 text-red-400 group-hover:text-white transition-colors"
              strokeWidth={1.5}
            />
            {!collapsed && (
              <span className="relative z-10 text-red-400 group-hover:text-white transition-colors font-medium tracking-wide">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* PREMIUM SETTINGS MODAL */}
     {showSettings && (
  <div
    className="fixed inset-0 bg-[#1c1f4c]/80 backdrop-blur-md flex items-center justify-center z-50"
    onClick={() => setShowSettings(false)}
  >
    {/* MODAL CONTAINER */}
    <div
      className="relative w-[92%] max-w-md max-h-[90vh] overflow-y-auto rounded-2xl
      bg-gradient-to-br from-white to-gray-50
      dark:from-[#1c1f4c] dark:to-[#141736]
      shadow-2xl shadow-black/50 border border-white/10"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-red-500/10 to-red-600/5 backdrop-blur-xl border-b border-red-200/20 p-5">
        <button
          onClick={() => setShowSettings(false)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition"
        >
          <X size={20} className="text-gray-500 dark:text-white/60" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <Trash2 size={20} className="text-white" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Account Settings
            </h2>
            <p className="text-xs text-red-500 dark:text-red-400">
              Security & Danger Zone
            </p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5 space-y-8">

        {/* ================= CHANGE PASSWORD ================= */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00848c] to-[#006b72] flex items-center justify-center shadow-md">
              <Settings size={16} className="text-white" />
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                Change Password
              </h3>
              <p className="text-xs text-gray-500 dark:text-white/40">
                Update your account security
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
              focus:ring-2 focus:ring-[#00848c] outline-none text-sm text-gray-900 dark:text-white"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
              focus:ring-2 focus:ring-[#00848c] outline-none text-sm text-gray-900 dark:text-white"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
              focus:ring-2 focus:ring-[#00848c] outline-none text-sm text-gray-900 dark:text-white"
            />

            {/* RULES */}
            <div className="text-[11px] text-gray-600 dark:text-white/50 bg-[#00848c]/10 border border-[#00848c]/20 p-3 rounded-xl leading-relaxed">
              Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
            </div>

            <button
              onClick={changePassword}
              disabled={
                passwordLoading ||
                !passwordForm.currentPassword ||
                !passwordForm.newPassword ||
                !passwordForm.confirmPassword
              }
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00848c] to-[#006b72]
              hover:from-[#fec20f] hover:to-[#e5b00d]
              text-white hover:text-[#1c1f4c]
              font-semibold transition-all disabled:opacity-50"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10"></div>

        {/* ================= DELETE ACCOUNT ================= */}
        <div>
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed">
              ⚠️ <strong>Danger Zone:</strong> This action is irreversible. All your data will be permanently deleted.
            </p>
          </div>

          <input
            type="password"
            placeholder="Enter password to confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10
            focus:ring-2 focus:ring-red-500 outline-none text-sm mb-4 text-gray-900 dark:text-white"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/80"
            >
              Cancel
            </button>

            <button
              onClick={deleteAccount}
              disabled={loading || !confirmPassword}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white
              disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
)}
    </>
  );
};

export default Sidebar;
