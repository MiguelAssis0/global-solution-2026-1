import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { MapPage } from "./pages/MapPage/MapPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage/ResetPasswordPage";
import { NotFound } from "./pages/NotFound/NotFound";
import { isAuthenticated } from "./services/authService";
import type { JSX } from "react";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RequireGuest = ({ children }: { children: JSX.Element }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<RequireGuest><AuthPage /></RequireGuest>} />
      <Route path="/register" element={<RequireGuest><AuthPage /></RequireGuest>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
