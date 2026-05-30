import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage/AuthPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { MapPage } from "./pages/MapPage/MapPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage/ResetPasswordPage";
import { SupportPage } from "./pages/SupportPage/SupportPage";
import { TermsPage } from "./pages/TermsPage/TermsPage";
import { NotFound } from "./pages/NotFound/NotFound";
import { CookieConsent } from "./components/CookieConsent/CookieConsent";
import { isAuthenticated } from "./services/authService";
import type { JSX } from "react";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;

    document.getElementById("root")?.scrollTo({ top: 0, left: 0 });
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  return null;
};

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
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacidade" element={<PrivacyPolicyPage />} />
        <Route path="/termos" element={<TermsPage />} />
        <Route path="/suporte" element={<SupportPage />} />
        <Route path="/login" element={<RequireGuest><AuthPage /></RequireGuest>} />
        <Route path="/register" element={<RequireGuest><AuthPage /></RequireGuest>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </>
  );
}
