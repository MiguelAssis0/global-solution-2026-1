import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CloudSun,
  Layers,
  Leaf,
  LockKeyhole,
  MapPinned,
  Route,
} from "lucide-react";
import * as authService from "../../services/authService";
import styles from "../AuthPage/AuthPage.module.css";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(token ? "" : "Link de redefinicao invalido.");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError("Link de redefinicao invalido.");
      setMessage("");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Preencha a nova senha e a confirmacao.");
      setMessage("");
      return;
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter ao menos 6 caracteres.");
      setMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas nao conferem.");
      setMessage("");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authService.resetPassword({
        token,
        newPassword,
      });
      setMessage(response.message || "Senha redefinida com sucesso.");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Token invalido ou expirado. Solicite um novo link.");
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

          <p className={styles.kicker}>Seguranca de acesso</p>
          <h1>Defina uma nova senha para sua conta.</h1>
          <p>
            Use uma senha segura para manter suas analises territoriais,
            historico e preferencias protegidos.
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
              Acesso e logistica
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

          <div className={styles.heading}>
            <p>Nova senha</p>
            <h2>Resetar senha</h2>
            <span>Crie uma nova senha para voltar a acessar sua conta.</span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>Nova senha</span>
              <div className={styles.inputWrap}>
                <LockKeyhole aria-hidden="true" size={18} />
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder="Digite sua nova senha"
                  disabled={!token}
                />
              </div>
            </label>

            <label className={styles.field}>
              <span>Confirmar nova senha</span>
              <div className={styles.inputWrap}>
                <LockKeyhole aria-hidden="true" size={18} />
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder="Repita sua nova senha"
                  disabled={!token}
                />
              </div>
            </label>

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <button
              className={styles.submitButton}
              type="submit"
              disabled={isLoading || !token}
            >
              {isLoading ? "Salvando..." : "Confirmar nova senha"}
            </button>
          </form>

          <Link to="/login" className={styles.backLink}>
            Voltar para o login
          </Link>
        </div>
      </section>
    </main>
  );
}
