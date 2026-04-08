import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import { useAuth } from './context/AuthContext';

// AdminRoute Guard (Updated for Step 4)
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  console.log("AdminRoute check, role:", role);
  
  if (!token || token === "undefined" || !role) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== "ADMIN" && role !== "ROLE_ADMIN") {
    console.warn("Unauthorized access attempt to admin route");
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Lazy loading components
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import("./pages/SignupPage").then(m => ({ default: m.SignupPage })));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword").then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import("./pages/ResetPassword").then(m => ({ default: m.ResetPassword })));
const ProgramsPage = lazy(() => import("./pages/ProgramsPage").then(m => ({ default: m.ProgramsPage })));
const ProgramDetail = lazy(() => import("./pages/ProgramDetail").then(m => ({ default: m.ProgramDetail })));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage").then(m => ({ default: m.ResourcesPage })));
const UserDashboard = lazy(() => import("./pages/UserDashboard").then(m => ({ default: m.UserDashboard })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLayout = lazy(() => import("./pages/AdminLayout"));
const ManageResources = lazy(() => import("./pages/AdminResourcesPage"));
const ManagePrograms = lazy(() => import("./pages/AdminProgramsPage"));
const ManageUsers = lazy(() => import("./pages/AdminUsersPage"));
const AdminActivityPage = lazy(() => import("./pages/AdminActivity"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route element={<UserLayout />}>
              <Route path="/" element={<HomePage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/:id" element={<ProgramDetail />} />
            <Route path="/resources" element={<ResourcesPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />

            </Route>

            {/* Admin Routes with AdminRoute Guard (Nested for Step 1) */}
            <Route path="/admin" element={
              <AdminRoute><AdminLayout /></AdminRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="resources" element={<ManageResources />} />
              <Route path="programs" element={<ManagePrograms />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="activity" element={<AdminActivityPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App;
