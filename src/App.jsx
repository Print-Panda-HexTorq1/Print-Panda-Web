import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomerUpload from "./pages/CustomerUpload";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";

const ADMIN_TOKEN_KEY = "panda_admin_token";
const LEGACY_ADMIN_TOKEN_KEY = "iprint_admin_token";
export const LOCAL_AUTH_KEY = "panda_local_auth";

function AdminRoute({ children }) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(LEGACY_ADMIN_TOKEN_KEY);
  const localAuth = localStorage.getItem(LOCAL_AUTH_KEY);
  return (token || localAuth) ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* Customer upload page per-user */}
      <Route path="/u/:userUid" element={<CustomerUpload />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Legal pages */}
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/refund" element={<Refund />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Fallback → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


