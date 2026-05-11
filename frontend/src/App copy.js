// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* =========================
   Pages - Public
========================= */
import Landing from "./pages/auth/Welcome";
import Login from "./pages/auth/Login";

/* =========================
   Register Pages
========================= */
import StudentRegister from "./pages/register/StudentRegister";
import CompanyRegister from "./pages/register/CompanyRegister";
import UniversityRegister from "./pages/register/UniversityRegister";

/* =========================
   Student Pages
========================= */
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import Profile from "./pages/dashboard/student/Profile";
import CVBuilder from "./pages/dashboard/student/CVBuilder";
import SuggestedInternships from "./pages/dashboard/student/SuggestedInternships";
import MyApplications from "./pages/dashboard/student/MyApplications";
import StudentInternships from "./pages/dashboard/student/StudentInternships";
import ApplyUniversity from "./pages/dashboard/student/ProfileApply"
/* =========================
   Company Pages
========================= */
import CompanyDashboard from "./pages/dashboard/company/CompanyDashboard";
import PostInternship from "./pages/dashboard/company/PostInternship";
import ComApplications from "./pages/dashboard/company/ComApplications";
import AddSupervisor from "./pages/dashboard/company/AddSupervisor";
import AssignStudent from "./pages/dashboard/company/AssignStudent";

/* =========================
   University Pages
========================= */
import UniversityDashboard from "./pages/dashboard/university/UniversityAdminDashboard";
import UniversityStudentDashboard from "./pages/dashboard/university/UniversityStudentDashboard";
import Applications from "./pages/dashboard/university/Applications";
import AdvisorManagement from "./pages/dashboard/university/AdvisorManagement";

/* =========================
   Supervisor Pages
========================= */
import SupervisorDashboard from "./pages/dashboard/Supervisor/SupervisorDashboard";

/* =========================
   Advisor Pages
========================= */
import AdvisorDashboard from "./pages/dashboard/advisor/AdvisorDashboard";

/* =========================
   Chat Pages
========================= */
import GroupChatDashboard from "./pages/dashboard/Chat/GroupChatDashboard";
import ChatPage from "./pages/dashboard/Chat/ChatPage";

/* =========================
   Admin Pages
========================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";

/* =========================
   Common Pages
========================= */
import Notifications from "./pages/dashboard/common/Notifications";

/* =========================
   Utilities
========================= */
import ProtectedRoute from "./utils/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { SocketProvider } from "./context/SocketContext";
import { StudentProvider } from "./context/StudentContext"; 
function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          {/* ========================= Public ========================= */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* ========================= Register ========================= */}
          <Route path="/register/student" element={<StudentRegister />} />
          <Route path="/register/company" element={<CompanyRegister />} />
          <Route path="/register/university" element={<UniversityRegister />} />

          {/* ========================= Student ========================= */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="student">
              <DashboardLayout><StudentDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute role="student">
              <DashboardLayout><Profile /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/cv" element={
            <ProtectedRoute role="student">
              <DashboardLayout><CVBuilder /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/internships" element={
            <ProtectedRoute role="student">
              <DashboardLayout><SuggestedInternships /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/internships/all" element={
            <ProtectedRoute role="student">
              <DashboardLayout><StudentInternships /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/applications" element={
            <ProtectedRoute role="student">
              <DashboardLayout><MyApplications /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/apply-university" element={<ApplyUniversity />} />
          {/* Student Chat */}
          <Route path="/student/chat" element={
            <ProtectedRoute role="student">
              <DashboardLayout><GroupChatDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/student/internship/:internshipId/chat" element={
            <ProtectedRoute role="student">
              <DashboardLayout><ChatPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ========================= Company ========================= */}
          <Route path="/company/dashboard" element={
            <ProtectedRoute role="company">
              <DashboardLayout><CompanyDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/post" element={
            <ProtectedRoute role="company">
              <DashboardLayout><PostInternship /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/applications" element={
            <ProtectedRoute role="company">
              <DashboardLayout><ComApplications /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/add-supervisor" element={
            <ProtectedRoute role="company">
              <DashboardLayout><AddSupervisor /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/assign-student" element={
            <ProtectedRoute role="company">
              <DashboardLayout><AssignStudent /></DashboardLayout>
            </ProtectedRoute>
          } />
          {/* Company Chat */}
          <Route path="/company/chat" element={
            <ProtectedRoute role="company">
              <DashboardLayout><GroupChatDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/company/internship/:internshipId/chat" element={
            <ProtectedRoute role="company">
              <DashboardLayout><ChatPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ========================= University ========================= */}
          <Route path="/university/dashboard" element={
            <ProtectedRoute role="university">
              <DashboardLayout><UniversityDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/university/advisors" element={
            <ProtectedRoute role="university">
              <DashboardLayout><AdvisorManagement /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/university/students" element={
            <ProtectedRoute role="university">
              <DashboardLayout><UniversityStudentDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/university/applications" element={
            <ProtectedRoute role="university">
              <DashboardLayout><Applications /></DashboardLayout>
            </ProtectedRoute>
          } />
          {/* University Chat */}
          <Route path="/university/chat" element={
            <ProtectedRoute role="university">
              <DashboardLayout><GroupChatDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/university/internship/:internshipId/chat" element={
            <ProtectedRoute role="university">
              <DashboardLayout><ChatPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ========================= Supervisor ========================= */}
          <Route path="/supervisor/dashboard" element={
            <ProtectedRoute role="supervisor">
              <DashboardLayout><SupervisorDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          {/* Supervisor Chat */}
          <Route path="/supervisor/chat" element={
            <ProtectedRoute role="supervisor">
              <DashboardLayout><GroupChatDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/supervisor/internship/:internshipId/chat" element={
            <ProtectedRoute role="supervisor">
              <DashboardLayout><ChatPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ========================= Advisor ========================= */}
          <Route path="/advisor/dashboard" element={
            <ProtectedRoute role="advisor">
              <DashboardLayout><AdvisorDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          {/* Advisor Chat */}
          <Route path="/advisor/chat" element={
            <ProtectedRoute role="advisor">
              <DashboardLayout><GroupChatDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/advisor/internship/:internshipId/chat" element={
            <ProtectedRoute role="advisor">
              <DashboardLayout><ChatPage /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ========================= Admin ========================= */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin">
              <DashboardLayout><AdminDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute role="admin">
              <DashboardLayout><Users /></DashboardLayout>
            </ProtectedRoute>
          } />

          {/* ========================= Common ========================= */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <DashboardLayout><Notifications /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/chat/:id" element={
            <ProtectedRoute>
              <DashboardLayout><ChatPage /></DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;