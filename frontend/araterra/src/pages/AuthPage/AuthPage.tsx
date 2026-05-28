import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CloudSun,
  Layers,
  Leaf,
  LockKeyhole,
  Mail,
  MapPinned,
  Route,
  User,
} from "lucide-react";
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
  const initialMode =
    location.pathname.includes("register") || state?.mode === "register"
      ? "register"
      : "login";

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRegister = mode === "register";
  const title = isRegister ? "Crie sua conta" : "Acesse sua área";
  const submitLabel = isRegister ? "Criar conta" : "Entrar";

  const helperText = useMemo(
    () =>
      isRegister
        ? "Comece a avaliar áreas rurais com mapa, clima, vegetação e infraestrutura em um só ambiente."
        : "Entre para continuar suas análises territoriais e seus relatórios assistidos por IA.",
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
      return "Preencha todos os campos obrigatórios.";
    }

    if (isRegister && !form.name.trim()) {
      return "Informe seu nome para criar a conta.";
    }

    if (isRegister && form.password !== form.confirmPassword) {
      return "As senhas não conferem.";
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
      setError(
        isRegister
          ? "Não foi possível criar sua conta."
          : "E-mail ou senha inválidos.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.brandPanel} aria-label="Resumo da Araterra">
        <div className={styles.brandShade} />
        <div className={styles.brandContent}>
          <Link to="/" className={styles.brandName}>
            <Leaf aria-hidden="true" />
            <span>Araterra</span>
          </Link>

          <p className={styles.kicker}>Inteligência territorial agrícola</p>
          <h1>Decisões de campo com leitura clara do território.</h1>
          <p>
            Avalie áreas rurais com camadas geoespaciais, dados climáticos,
            infraestrutura próxima e sínteses técnicas em linguagem objetiva.
          </p>

          <div className={styles.featureList} aria-label="Recursos da plataforma">
            <span>
              <Layers aria-hidden="true" />
              Mapas multicamadas
            </span>
            <span>
              <CloudSun aria-hidden="true" />
              Clima integrado
            </span>
            <span>
              <Route aria-hidden="true" />
              Acesso e logística
            </span>
          </div>

          <div className={styles.mapPreview} aria-hidden="true">
            <div className={styles.routeLine} />
            <div className={styles.zoneOne} />
            <div className={styles.zoneTwo} />
            <div className={styles.pin}>
              <MapPinned size={18} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.card}>
          <div className={styles.mobileBrand}>
            <Link to="/" className={styles.mobileLogo}>
              <Leaf aria-hidden="true" />
              <span>Araterra</span>
            </Link>
          </div>

          <div className={styles.toggle} aria-label="Modo de autenticação">
            <button
              type="button"
              className={mode === "login" ? styles.activeToggle : ""}
              onClick={() => switchMode("login")}
            >
              Entrar
            </button>
            <button
              type="button"
              className={mode === "register" ? styles.activeToggle : ""}
              onClick={() => switchMode("register")}
            >
              Criar conta
            </button>
          </div>

          <div className={styles.heading}>
            <p>{isRegister ? "Novo acesso" : "Área do cliente"}</p>
            <h2>{title}</h2>
            <span>{helperText}</span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {isRegister && (
              <label className={styles.field}>
                <span>Nome</span>
                <div className={styles.inputWrap}>
                  <User aria-hidden="true" size={18} />
                  <input
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Seu nome"
                  />
                </div>
              </label>
            )}

            <label className={styles.field}>
              <span>E-mail</span>
              <div className={styles.inputWrap}>
                <Mail aria-hidden="true" size={18} />
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="voce@empresa.com"
                />
              </div>
            </label>

            <label className={styles.field}>
              <span>Senha</span>
              <div className={styles.inputWrap}>
                <LockKeyhole aria-hidden="true" size={18} />
                <input
                  type="password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Digite sua senha"
                />
              </div>
            </label>

            {isRegister && (
              <label className={styles.field}>
                <span>Confirmar senha</span>
                <div className={styles.inputWrap}>
                  <LockKeyhole aria-hidden="true" size={18} />
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField("confirmPassword", event.target.value)
                    }
                    placeholder="Repita sua senha"
                  />
                </div>
              </label>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.submitButton} type="submit" disabled={isLoading}>
              {isLoading ? "Aguarde..." : submitLabel}
            </button>
          </form>

          <Link to="/" className={styles.backLink}>
            Voltar para a página inicial
          </Link>
        </div>
      </section>
    </main>
  );
}
