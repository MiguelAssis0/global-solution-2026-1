import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUp,
  CheckCircle2,
  CloudSun,
  FileText,
  Globe2,
  Layers,
  Leaf,
  Route,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import styles from "./HomePage.module.css";

const heroImage =
  "/images/araterra-hero-field.png";

const fieldImage =
  "/images/araterra-field-strip.png";

const solutions = [
  {
    title: "Mapas multicamadas",
    description:
      "Visualize satélite, áreas agrícolas, vias, energia e indicadores de vegetação em um só ambiente.",
    icon: Layers,
  },
  {
    title: "Leitura climática",
    description:
      "Cruze temperatura, umidade e chuva com o contexto de cada área desenhada no mapa.",
    icon: CloudSun,
  },
  {
    title: "Análise de aptidão",
    description:
      "Transforme dados espaciais em notas, alertas e recomendações para decisões de campo.",
    icon: Target,
  },
  {
    title: "Relatórios com IA",
    description:
      "Gere sínteses técnicas em linguagem clara para produtores, consultores e equipes de operação.",
    icon: FileText,
  },
];

const riskItems = [
  "Identificação de áreas com maior risco climático e operacional.",
  "Avaliação de vegetação por NDVI e leitura rápida de anomalias.",
  "Consulta de infraestrutura próxima, como estradas e pontos de energia.",
  "Resumo técnico de solo, clima e entorno para cada talhão analisado.",
  "Priorização de visitas e investimentos com base em dados geoespaciais.",
  "Histórico de análises para comparar áreas e acompanhar evolução.",
];

const farmBenefits = [
  {
    title: "Planejamento de safra",
    description:
      "Organize áreas prioritárias com base em clima, acesso, vegetação e infraestrutura.",
  },
  {
    title: "Suporte ao consultor",
    description:
      "Ganhe velocidade na preparação de laudos, visitas técnicas e diagnósticos iniciais.",
  },
  {
    title: "Operação mais previsível",
    description:
      "Antecipe gargalos de acesso, energia, água e risco climático antes de executar o plano.",
  },
  {
    title: "Decisão compartilhável",
    description:
      "Transforme a análise espacial em uma narrativa objetiva para equipes e parceiros.",
  },
  {
    title: "Monitoramento contínuo",
    description:
      "Use indicadores recorrentes para acompanhar mudanças no território ao longo da safra.",
  },
  {
    title: "Menos achismo",
    description:
      "Combine evidências públicas, dados ambientais e IA para reduzir decisões no escuro.",
  },
];

const dataPoints = [
  { value: "1", label: "Semana para desenvolver" },
  { value: "3", label: "Desenvolvedores " },
  { value: "0", label: "Usuários cadastrados" },
  { value: "0", label: "Locais atendidos" },
  { value: "1", label: "API de clima integrado" },
];

export function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <header
        className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
      >
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand} aria-label="Araterra">
            <Leaf aria-hidden="true" />
            <span>Araterra</span>
          </Link>

          <nav className={styles.nav} aria-label="Navegação principal">
            <a href="#solucoes">Soluções</a>
            <a href="#plataforma">Plataforma</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#dados">Dados</a>
          </nav>

          <div className={styles.headerActions}>
            <Link to="/map" className={styles.headerMapLink}>
              Abrir mapa
            </Link>
            <Link to="/login" className={styles.headerCta}>
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <img
            className={styles.heroImage}
            src={heroImage}
            alt="Campo agrícola amplo iluminado pelo sol"
          />
          <div className={styles.heroShade} />

          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>Inteligência territorial agrícola</p>
              <h1 id="hero-title">Araterra</h1>
              <p className={styles.heroText}>
                Uma plataforma geoespacial para avaliar áreas rurais com mapas,
                clima, vegetação, infraestrutura e relatórios assistidos por IA.
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

            <aside
              className={styles.heroPanel}
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
          </div>
        </section>

        <section className={styles.solutionsSection} id="solucoes">
          <div className={styles.sectionInner}>
            <div className={styles.centerHeader}>
              <p className={styles.sectionKicker}>Nossas soluções</p>
              <h2>Diagnóstico rural em uma visão integrada.</h2>
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
              <p className={styles.sectionKicker}>Gestão de riscos</p>
              <h2>Benefícios para quem decide no campo.</h2>
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
              <div className={styles.deviceMock}>
                <div className={styles.deviceTop} />
                <div className={styles.deviceMap}>
                  <span className={styles.pinOne} />
                  <span className={styles.pinTwo} />
                  <span className={styles.pinThree} />
                  <span className={styles.pinFour} />
                </div>
              </div>

              <div className={styles.platformCopy}>
                <p className={styles.sectionKicker}>Manejo e monitoramento</p>
                <h2>Do mapa ao relatório, sem perder o contexto da fazenda.</h2>
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
            <h2>Leve para sua fazenda</h2>

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
                <h2>Uma base visual para enxergar o território.</h2>
                <p>
                  Em vez de prometer números inflados, a Araterra concentra
                  fontes úteis para análise rural: imagens de satélite,
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
                  <span>{point.label}</span>
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
              pode acelerar decisões agrícolas com mais clareza.
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
