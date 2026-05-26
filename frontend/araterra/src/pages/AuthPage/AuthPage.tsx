import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Map, User } from "lucide-react";
import * as authService from "../../services/authService";
import styles from "./AuthPage.module.css";

type AuthMode = "login" | "register";

type LocationState = {
  mode?: AuthMode;
};

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const initialMode = location.pathname.includes("register") || state?.mode === "register" ? "register" : "login";

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRegister = mode === "register";
  const title = isRegister ? "Create your account" : "Welcome back";
  const submitLabel = isRegister ? "Create Account" : "Sign In";

  const helperText = useMemo(
    () =>
      isRegister
        ? "Start mapping land, infrastructure, and risk signals with Araterra."
        : "Sign in to continue to your geospatial dashboard.",
    [isRegister],
  );

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError("");
  };

  const validateForm = () => {
    if (!form.email.trim() || !form.password.trim()) {
      return "Please fill in all required fields";
    }

    if (isRegister && !form.name.trim()) {
      return "Please fill in all required fields";
    }

    if (isRegister && form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }

    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (isRegister) {
        await authService.register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      } else {
        await authService.login({
          email: form.email.trim(),
          password: form.password,
        });
      }

      if (authService.isAuthenticated()) {
        navigate("/map", { replace: true });
        return;
      }

      setMode("login");
      setForm((current) => ({ ...current, password: "", confirmPassword: "" }));
    } catch {
      setError(isRegister ? "Unable to create account" : "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.brandPanel} aria-label="Araterra overview">
        <div className={styles.brandContent}>
          <Link to="/" className={styles.brandName}>
            Araterra
          </Link>
          <h1>Geospatial intelligence for land and infrastructure analysis.</h1>
          <p>Inspect terrain, climate, access, and infrastructure signals in one operational map workspace.</p>
          <div className={styles.mapPreview} aria-hidden="true">
            <div className={styles.routeLine} />
            <div className={styles.zoneOne} />
            <div className={styles.zoneTwo} />
            <div className={styles.pin}>
              <Map size={18} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.card}>
          <div className={styles.mobileBrand}>
            <Link to="/" className={styles.mobileLogo}>
              Araterra
            </Link>
          </div>

          <div className={styles.toggle} aria-label="Authentication mode">
            <button type="button" className={mode === "login" ? styles.activeToggle : ""} onClick={() => switchMode("login")}>
              Login
            </button>
            <button type="button" className={mode === "register" ? styles.activeToggle : ""} onClick={() => switchMode("register")}>
              Register
            </button>
          </div>

          <div className={styles.heading}>
            <h2>{title}</h2>
            <p>{helperText}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {isRegister && (
              <label className={styles.field}>
                <span>Name</span>
                <div className={styles.inputWrap}>
                  <User size={18} />
                  <input
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Alex Morgan"
                  />
                </div>
              </label>
            )}

            <label className={styles.field}>
              <span>Email</span>
              <div className={styles.inputWrap}>
                <Mail size={18} />
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="you@company.com"
                />
              </div>
            </label>

            <label className={styles.field}>
              <span>Password</span>
              <div className={styles.inputWrap}>
                <LockKeyhole size={18} />
                <input
                  type="password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Enter your password"
                />
              </div>
            </label>

            {isRegister && (
              <label className={styles.field}>
                <span>Confirm password</span>
                <div className={styles.inputWrap}>
                  <LockKeyhole size={18} />
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) => updateField("confirmPassword", event.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>
              </label>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.submitButton} type="submit" disabled={isLoading}>
              {isLoading ? "Please wait..." : submitLabel}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
