import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  CloudSun,
  Layers,
  Leaf,
  Mail,
  MapPinned,
  Route,
} from "lucide-react";
import * as authService from "../../services/authService";
import styles from "../AuthPage/AuthPage.module.css";

const successMessage =
  "Se o e-mail estiver cadastrado, enviaremos um link de redefinicao.";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Informe seu e-mail para continuar.");
      setMessage("");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authService.requestPasswordReset({
        email: email.trim(),
      });
      setMessage(response.message || successMessage);
    } catch {
      setError("Nao foi possivel enviar a solicitacao. Tente novamente.");
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

          <p className={styles.kicker}>Inteligencia territorial agricola</p>
          <h1>Retome o acesso sem interromper suas analises.</h1>
          <p>
            Recupere sua senha para continuar acompanhando mapas, clima,
            infraestrutura e relatorios tecnicos em um unico ambiente.
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
            <p>Recuperacao de acesso</p>
            <h2>Esqueci minha senha</h2>
            <span>
              Informe o e-mail da sua conta para receber o link de redefinicao.
            </span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span>E-mail</span>
              <div className={styles.inputWrap}>
                <Mail aria-hidden="true" size={18} />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder="voce@empresa.com"
                />
              </div>
            </label>

            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}

            <button className={styles.submitButton} type="submit" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar link de redefinicao"}
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
