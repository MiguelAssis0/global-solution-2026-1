import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUp,
  CalendarCheck,
  FileText,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { PublicHeader } from "../layout/PublicHeader/PublicHeader";
import styles from "./LegalLayout.module.css";

export type LegalNavItem = {
  id: string;
  label: string;
};

export type LegalBadge = {
  text: string;
  icon?: "calendar" | "shield" | "file";
};

type LegalLayoutProps = {
  kicker: string;
  title: string;
  description: string;
  badges?: LegalBadge[];
  navItems: LegalNavItem[];
  children: ReactNode;
};

const icons = {
  calendar: CalendarCheck,
  shield: ShieldCheck,
  file: FileText,
};

const legalHeaderNavItems = [
  { label: "Privacidade", href: "/privacidade" },
  { label: "Termos", href: "/termos" },
  { label: "Suporte", href: "/suporte" },
];

export function LegalLayout({
  kicker,
  title,
  description,
  badges = [],
  navItems,
  children,
}: LegalLayoutProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const getScrollTop = () =>
      Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
        document.getElementById("root")?.scrollTop ?? 0,
      );

    const onScroll = () => setShowScrollTop(getScrollTop() > 320);
    const root = document.getElementById("root");

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    root?.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      root?.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    document.getElementById("root")?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <PublicHeader
        variant="solid"
        navItems={legalHeaderNavItems}
        showHomeAction
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>{kicker}</p>
          <h1>{title}</h1>
          <p className={styles.description}>{description}</p>

          {badges.length > 0 && (
            <div className={styles.badges} aria-label="Informações do documento">
              {badges.map((badge) => {
                const Icon = icons[badge.icon ?? "file"];

                return (
                  <span className={styles.badge} key={badge.text}>
                    <Icon aria-hidden="true" />
                    {badge.text}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.mainInner}>
          <aside className={styles.sidebar} aria-label="Seções da página">
            <span>Nesta página</span>
            <nav>
              {navItems.map((item) => (
                <a href={`#${item.id}`} key={item.id}>
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <article className={styles.content}>{children}</article>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Link to="/" className={styles.footerBrand}>
            <Leaf aria-hidden="true" />
            <span>Araterra</span>
          </Link>

          <span>© {new Date().getFullYear()} Araterra. Todos os direitos reservados.</span>

          <nav aria-label="Links legais">
            <Link to="/privacidade">Política de Privacidade</Link>
            <Link to="/termos">Termos de Uso</Link>
            <Link to="/suporte">Suporte</Link>
          </nav>
        </div>
      </footer>

      <button
        className={`${styles.scrollTop} ${
          showScrollTop ? styles.scrollTopVisible : ""
        }`}
        type="button"
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
      >
        <ArrowUp aria-hidden="true" />
      </button>
    </div>
  );
}
