import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";
import {
  ArrowUp,
  CheckCircle2,
  CloudSun,
  Leaf,
  Route,
  Sparkles,
  Zap,
} from "lucide-react";
import { PublicHeader } from "../../components/layout/PublicHeader/PublicHeader";
import styles from "./HomePage.module.css";
import { solutions, riskItems, farmBenefits, dataPoints } from "./texts";
import { useToggleTheme } from "../../hooks/useToggleTheme";

const heroImage = "/images/araterra-hero-field.png";
const heroVideo = "/videos/hero.mp4";

const fieldImage = "/images/araterra-field-strip.png";

const homeNavItems = [
  { label: "Soluções", href: "#solucoes" },
  { label: "Plataforma", href: "#plataforma" },
  { label: "Benefícios", href: "#beneficios" },
  { label: "Dados", href: "#dados" },
];

export function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroScrollRef = useRef<HTMLElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [user, setUser] = useState<authService.UserProfile | null>(null);

  useEffect(() => {
    let mounted = true;

    if (authService.isAuthenticated()) {
      authService
        .fetchProfile()
        .then((profile) => mounted && setUser(profile))
        .catch(() => setUser(null));
    }

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  const { theme, toggleTheme } = useToggleTheme();

  // ─── Header scroll detection (unchanged) ─────────────────────────────────
  useEffect(() => {
    const getScrollTop = () =>
      Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
        document.getElementById("root")?.scrollTop ?? 0,
      );

    const onScroll = () => setIsScrolled(getScrollTop() > 24);
    const root = document.getElementById("root");

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    root?.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      root?.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ─── Scroll-driven video scrubbing ───────────────────────────────────────
  useEffect(() => {
    const hero = heroScrollRef.current;
    const video = heroVideoRef.current;
    if (!hero || !video) return;

    let raf = 0;

    const setScrollHeight = () => {
      const dur =
        Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : 0;
      const dist = Math.max(
        window.innerHeight * 2.5,
        dur > 0 ? dur * 520 : window.innerHeight * 2.5,
      );
      hero.style.setProperty("--hero-scroll-distance", `${Math.round(dist)}px`);
    };

    const syncVideo = () => {
      raf = 0;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const rect = hero.getBoundingClientRect();
      const viewportH = window.innerHeight;

      const scrolledPx = -rect.top;

      const totalDist = Math.max(hero.offsetHeight - viewportH, 1);

      const progress = Math.min(Math.max(scrolledPx / totalDist, 0), 1);

      video.currentTime = progress * video.duration;

      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${(progress * 100).toFixed(2)}%`;
      }
      if (scrollHintRef.current) {
        const gone = progress > 0.03;
        scrollHintRef.current.style.opacity = gone ? "0" : "1";
        scrollHintRef.current.style.pointerEvents = gone ? "none" : "auto";
      }
    };

    const requestSync = () => {
      if (!raf) raf = requestAnimationFrame(syncVideo);
    };

    const onMetadata = () => {
      video.pause(); // ensure no autoplay
      setScrollHeight();
      requestSync();
    };

    const onResize = () => {
      setScrollHeight();
      requestSync();
    };

    video.muted = true;
    video.playsInline = true;

    setScrollHeight();
    if (video.readyState >= 1) onMetadata();

    video.addEventListener("loadedmetadata", onMetadata);

    const root = document.getElementById("root");
    window.addEventListener("scroll", requestSync, { passive: true });
    root?.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onMetadata);
      window.removeEventListener("scroll", requestSync);
      root?.removeEventListener("scroll", requestSync);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scrollToTop = () => {
    document.getElementById("root")?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <PublicHeader
        variant="transparent"
        scrolled={isScrolled}
        navItems={homeNavItems}
        showThemeToggle
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
      />

      <main>
        <section
          className={styles.heroScroll}
          ref={heroScrollRef}
          aria-labelledby="hero-title"
        >
          <div className={styles.heroSticky}>
            <div className={styles.hero}>
              <video
                ref={heroVideoRef}
                className={styles.heroVideo}
                src={heroVideo}
                poster={heroImage}
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
              />

              <div className={styles.heroShade} aria-hidden="true" />

              <div className={styles.heroInner}>
                <div className={styles.heroContent}>
                  <p className={styles.eyebrow}>
                    Inteligência territorial
                  </p>
                  <h1 id="hero-title">Araterra</h1>
                  <p className={styles.heroText}>
                    Uma plataforma geoespacial para avaliar áreas com
                    mapas, clima, vegetação, infraestrutura e assistência por IA.
                  </p>

                  <div className={styles.heroActions}>
                    <Link to="/map" className={styles.primaryButton}>
                      Analisar uma área
                    </Link>
                    <a href="#solucoes" className={styles.secondaryButton}>
                      Ver soluções
                    </a>
                  </div>
                </div>
              </div>

              <div className={styles.videoProgressTrack} aria-hidden="true">
                <div
                  ref={progressFillRef}
                  className={styles.videoProgressFill}
                />
              </div>

              <div
                ref={scrollHintRef}
                className={styles.scrollHint}
                aria-hidden="true"
              >
                <span>Scroll</span>
                <div className={styles.scrollChevron} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.solutionsSection} id="solucoes">
          <div className={styles.sectionInner}>
            <div className={styles.centerHeader}>
              <p className={styles.sectionKicker}>Nossas soluções</p>
              <h2>Diagnóstico em uma visão integrada</h2>
              <p>
                A Araterra organiza dados dispersos em uma leitura simples para
                investigar aptidão produtiva, risco ambiental, acesso e contexto
                operacional de cada área.
              </p>
            </div>

            <div className={styles.solutionsGrid}>
              {solutions.map(({ title, description, icon: Icon }) => (
                <article className={styles.solutionCard} key={title}>
                  <Icon aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.riskBand} id="beneficios">
          <div className={styles.sectionInner}>
            <div className={styles.riskTitle}>
              <h2>Benefícios para quem decide com a Araterra</h2>
            </div>

            <div className={styles.riskGrid}>
              {riskItems.map((item) => (
                <div className={styles.riskItem} key={item}>
                  <CheckCircle2 aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.platformSection} id="plataforma">
          <div className={styles.sectionInner}>
            <div className={styles.platformVisual}>
              <aside
                className={`${styles.heroPanel} ${styles.platformPanel}`}
                aria-label="Resumo da plataforma"
              >
                <div className={styles.panelHeader}>
                  <span>Score territorial</span>
                  <strong>86%</strong>
                </div>
                <div className={styles.panelMap}>
                  <span className={styles.areaOne} />
                  <span className={styles.areaTwo} />
                  <span className={styles.areaThree} />
                </div>
                <div className={styles.panelRows}>
                  <span>
                    <CloudSun aria-hidden="true" /> Chuva prevista estável
                  </span>
                  <span>
                    <Route aria-hidden="true" /> Acesso logístico próximo
                  </span>
                  <span>
                    <Zap aria-hidden="true" /> Energia em raio estratégico
                  </span>
                </div>
              </aside>

              <div className={styles.platformCopy}>
                <p className={styles.sectionKicker}>Facilidade no uso</p>
                <h2>Do mapa ao relatório</h2>
                <p>
                  A plataforma conecta o desenho da área com dados ambientais e
                  infraestrutura do entorno. O resultado é uma leitura rápida
                  para orientar visitas, investimentos, manejo e comunicação
                  técnica.
                </p>
                <p>
                  Produtores, consultores e equipes de projeto podem acessar a
                  mesma base visual, comparar cenários e transformar evidências
                  em próximos passos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.farmSection}>
          <div className={styles.sectionInner}>
            <h2>Leve para seu negócio</h2>

            <div className={styles.farmGrid}>
              {farmBenefits.map((benefit) => (
                <article className={styles.farmItem} key={benefit.title}>
                  <CheckCircle2 aria-hidden="true" />
                  <div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.dataSection} id="dados">
          <div className={styles.sectionInner}>
            <div className={styles.dataLayout}>
              <div className={styles.presenceCopy}>
                <p className={styles.sectionKicker}>Presença nos dados</p>
                <h2>Uma base visual para enxergar o território</h2>
                <p>
                  Em vez de prometer números inflados, a Araterra concentra
                  fontes úteis para análise do território: imagens de satélite,
                  indicadores de vegetação, clima, vias, energia e registros de
                  áreas agrícolas.
                </p>
              </div>

              <div className={styles.worldPanel} aria-hidden="true">
                <div className={styles.worldMap} />
              </div>
            </div>

            <div className={styles.numbers}>
              {dataPoints.map((point) => (
                <div className={styles.numberItem} key={point.label}>
                  <strong>{point.value}</strong>
                  <span className={styles.textPoints}>{point.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.imageStrip} aria-label="Lavoura monitorada">
          <img
            src={fieldImage}
            alt="Linhas de plantio em uma lavoura verde"
            loading="lazy"
          />
        </section>

        <section className={styles.finalCta}>
          <div className={styles.sectionInner}>
            <Sparkles aria-hidden="true" />
            <h2>Comece pela área que mais importa agora.</h2>
            <p>
              Abra o mapa, delimite uma região e veja como a análise territorial
              pode acelerar decisões com mais clareza.
            </p>
            <Link to="/map" className={styles.primaryButton}>
              Abrir o mapa
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Leaf aria-hidden="true" />
            <span>Araterra</span>
          </div>
          <div className={styles.footerContacts}>
            <span>Inteligência territorial para o agro</span>
          </div>
          <div className={styles.footerBottom}>
            <span>
              © {new Date().getFullYear()} Araterra. Todos os direitos
              reservados.
            </span>
            <div>
              <a href="#solucoes">Soluções</a>
              <a href="#plataforma">Plataforma</a>
              <Link to="/privacidade">Privacidade</Link>
              <Link to="/termos">Termos</Link>
              <Link to="/suporte">Suporte</Link>
              <Link to="/login">Área do cliente</Link>
            </div>
          </div>
        </div>
      </footer>

      <button
        className={`${styles.scrollTop} ${
          isScrolled ? styles.scrollTopVisible : ""
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
