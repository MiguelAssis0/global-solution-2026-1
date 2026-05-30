import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Info,
  Mail,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { LegalLayout, type LegalNavItem } from "../../components/legal/LegalLayout";
import doc from "../../components/legal/LegalDocument.module.css";
import styles from "./SupportPage.module.css";

const navItems: LegalNavItem[] = [
  { id: "atendimento", label: "Atendimento" },
  { id: "canais", label: "Canais" },
  { id: "prioridade", label: "Prioridade" },
  { id: "formulario", label: "Formulário" },
  { id: "lgpd", label: "LGPD" },
  { id: "links", label: "Links úteis" },
];

export function SupportPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const category = String(formData.get("category") ?? "");
    const subject = String(formData.get("subject") ?? "");
    const message = String(formData.get("message") ?? "");

    const body = [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      `Categoria: ${category}`,
      "",
      message,
    ].join("\n");

    const mailto = `mailto:contato@araterra.app?subject=${encodeURIComponent(
      `[Suporte Araterra] ${subject || category}`,
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
    window.location.href = mailto;
  };

  return (
    <LegalLayout
      kicker="Atendimento e suporte"
      title="Fale com o suporte"
      description="Canal para dúvidas sobre acesso, mapa operacional, análises territoriais, relatórios assistidos, privacidade e uso da plataforma."
      badges={[
        { text: "Contato oficial: contato@araterra.app", icon: "file" },
        { text: "Solicitações LGPD são tratadas por este canal", icon: "shield" },
      ]}
      navItems={navItems}
    >
      <div className={doc.notice}>
        <Info aria-hidden="true" />
        <p>
          Para agilizar o atendimento, descreva o objetivo da análise, a etapa
          em que ocorreu o problema e, quando possível, informe navegador,
          horário aproximado e tipo de área usada no mapa.
        </p>
      </div>

      <section className={doc.section} id="atendimento">
        <h2>1. Como podemos ajudar</h2>
        <p>
          O suporte da Araterra recebe dúvidas sobre cadastro, login, camadas do
          mapa, seleção de pontos ou polígonos, leitura de indicadores, erros em
          análises, relatórios assistidos por IA e pedidos relacionados à
          proteção de dados pessoais.
        </p>
      </section>

      <section className={doc.section} id="canais">
        <h2>2. Canais de atendimento</h2>
        <div className={styles.introGrid}>
          <article className={styles.contactCard}>
            <Mail aria-hidden="true" />
            <h3>E-mail</h3>
            <p>
              Envie sua solicitação para{" "}
              <a href="mailto:contato@araterra.app">contato@araterra.app</a>.
            </p>
          </article>
          <article className={styles.contactCard}>
            <MessageSquareText aria-hidden="true" />
            <h3>Mensagem detalhada</h3>
            <p>
              Use o formulário abaixo para abrir seu aplicativo de e-mail com as
              informações já organizadas.
            </p>
          </article>
          <article className={styles.contactCard}>
            <ShieldCheck aria-hidden="true" />
            <h3>Privacidade</h3>
            <p>
              Pedidos LGPD também podem ser enviados por este canal e serão
              analisados conforme a Política de Privacidade.
            </p>
          </article>
        </div>
      </section>

      <section className={doc.section} id="prioridade">
        <h2>3. Priorização de solicitações</h2>
        <p>
          Solicitações envolvendo acesso indevido, falha de autenticação,
          suspeita de incidente de segurança, erro que impeça o uso do mapa ou
          pedido de titular de dados pessoais recebem prioridade de análise.
        </p>
        <p>
          Dúvidas operacionais, sugestões de melhoria e pedidos sobre
          interpretação de dados serão avaliados conforme contexto e
          disponibilidade da equipe.
        </p>
      </section>

      <section className={doc.section} id="formulario">
        <h2>4. Enviar uma solicitação</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Nome</span>
              <input name="name" autoComplete="name" required placeholder="Seu nome" />
            </label>

            <label className={styles.field}>
              <span>E-mail</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="voce@empresa.com"
              />
            </label>
          </div>

          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Categoria</span>
              <select name="category" defaultValue="Dúvida sobre a plataforma">
                <option>Dúvida sobre a plataforma</option>
                <option>Acesso ou conta</option>
                <option>Mapa e camadas</option>
                <option>Relatório assistido por IA</option>
                <option>Privacidade e LGPD</option>
                <option>Erro ou instabilidade</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Assunto</span>
              <input
                name="subject"
                required
                placeholder="Resumo da solicitação"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Mensagem</span>
            <textarea
              name="message"
              required
              placeholder="Conte o que aconteceu e inclua detalhes úteis para a análise."
            />
          </label>

          <div className={styles.submitRow}>
            <button className={styles.submitButton} type="submit">
              Enviar por e-mail
            </button>
            <span className={styles.formHint}>
              O envio abre seu aplicativo de e-mail para revisão antes do
              disparo.
            </span>
          </div>

          {submitted && (
            <p className={styles.success}>
              Rascunho de e-mail criado. Revise a mensagem no seu aplicativo de
              e-mail e envie para concluir.
            </p>
          )}
        </form>
      </section>

      <section className={doc.section} id="lgpd">
        <h2>5. Solicitações de privacidade</h2>
        <p>
          Pedidos de acesso, correção, exclusão, informações sobre
          compartilhamento, revogação de consentimento ou outros direitos
          previstos na LGPD devem informar o titular, o e-mail relacionado à
          conta e a solicitação desejada.
        </p>
        <p>
          Quando necessário, a Araterra poderá solicitar informações adicionais
          para confirmar identidade e proteger os dados do titular.
        </p>
      </section>

      <section className={doc.section} id="links">
        <h2>6. Links úteis</h2>
        <p>
          Consulte também as páginas institucionais que explicam as regras de
          uso e a forma como dados pessoais são tratados.
        </p>
        <div className={styles.linksList}>
          <Link to="/privacidade">
            Política de Privacidade
          </Link>
          <Link to="/termos">
            Termos de Uso
          </Link>
          <Link to="/map">
            Abrir mapa operacional
          </Link>
        </div>
      </section>

      <div className={doc.actions}>
        <Link to="/privacidade" className={doc.primaryAction}>
          Ver Política de Privacidade
        </Link>
        <Link to="/termos" className={doc.secondaryAction}>
          Ver Termos de Uso
        </Link>
      </div>
    </LegalLayout>
  );
}
