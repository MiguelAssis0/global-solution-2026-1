import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logo}>Araterra</div>
        <nav className={styles.nav}>
          <Link to="/login" className={styles.linkButton}>Entrar</Link>
          <Link to="/register" className={styles.ctaButton}>Começar grátis</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>🌱 Inteligência Territorial do Brasil</div>

          <h1 className={styles.title}>
            Análise geoespacial inteligente que <span className={styles.highlight}>acelera</span> suas decisões rurais
          </h1>

          <p className={styles.subtitle}>
            Visualize mapas interativos, analise solo, clima, infraestrutura e vegetação com IA. 
            Gere relatórios profissionais em Markdown em poucos cliques e tome decisões mais assertivas no campo.
          </p>

          <div className={styles.ctas}>
            <Link to="/map" className={styles.primaryButton}>
              Abrir o Mapa Agora
            </Link>
            <Link to="/map" className={styles.secondaryButton}>
              Ver demonstração ao vivo
            </Link>
          </div>

          <div className={styles.trustBar}>
            Usado por produtores, consultores agronômicos e empresas de tecnologia rural em 14 estados
          </div>
        </div>

        <div className={styles.heroGraphic}>
          <div className={styles.mapMock} />
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <h3>18.450</h3>
          <p>Hectares mapeados</p>
        </div>
        <div className={styles.statItem}>
          <h3>96.4%</h3>
          <p>Precisão média das análises</p>
        </div>
        <div className={styles.statItem}>
          <h3>470+</h3>
          <p>Propriedades analisadas</p>
        </div>
        <div className={styles.statItem}>
          <h3>38s</h3>
          <p>Tempo médio por relatório</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Funcionalidades principais</h2>
        <div className={styles.featuresGrid}>
          <article className={styles.featureCard}>
            <div className={styles.icon}>🗺️</div>
            <h3>Mapeamento Avançado</h3>
            <p>Suporte a shapefiles, GeoJSON, KML e desenho manual de polígonos e pontos. Camadas personalizáveis.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.icon}>🌾</div>
            <h3>Análise Multilayer</h3>
            <p>NDVI, solo, declividade, precipitação histórica, temperatura, uso do solo e infraestrutura elétrica/rodoviária.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.icon}>🤖</div>
            <h3>Inteligência Artificial</h3>
            <p>Relatórios automáticos em Markdown com recomendações técnicas, riscos e oportunidades por área.</p>
          </article>
          <article className={styles.featureCard}>
            <div className={styles.icon}>📊</div>
            <h3>Exportação Profissional</h3>
            <p>Baixe relatórios em PDF, Word ou Markdown prontos para apresentar a clientes, bancos e cooperativas.</p>
          </article>
        </div>
      </section>

      {/* BENEFITS */}
      <section className={styles.benefits}>
        <h2 className={styles.sectionTitle}>Por que produtores e agrônomos escolhem a Araterra</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefit}>
            <h4>Reduza tempo de análise</h4>
            <p>De dias para minutos. O que antes levava horas de pesquisa agora é feito em um clique.</p>
          </div>
          <div className={styles.benefit}>
            <h4>Mais precisão nas recomendações</h4>
            <p>Combinação de dados oficiais + IA reduz erros em diagnósticos de solo e clima.</p>
          </div>
          <div className={styles.benefit}>
            <h4>Relatórios que impressionam</h4>
            <p>Documentos profissionais que facilitam aprovação de crédito rural e propostas comerciais.</p>
          </div>
          <div className={styles.benefit}>
            <h4>Decisões baseadas em dados reais</h4>
            <p>Evite palpites. Tenha informações atualizadas sobre sua propriedade ou cliente.</p>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>Como funciona em 3 passos simples</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>01</div>
            <h4>Defina a área de interesse</h4>
            <p>Busque por coordenadas, fazenda ou desenhe diretamente no mapa.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>02</div>
            <h4>Ative as camadas de dados</h4>
            <p>Escolha entre dezenas de camadas geoespaciais oficiais e satélite.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>03</div>
            <h4>Receba a análise completa</h4>
            <p>A IA processa tudo e gera relatório detalhado com insights acionáveis.</p>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className={styles.useCases}>
        <h2 className={styles.sectionTitle}>Usos mais comuns</h2>
        <div className={styles.useCasesGrid}>
          <div className={styles.useCaseCard}>
            <h4>🧑‍🌾 Produtores Rurais</h4>
            <p>Avaliação de potencial produtivo, planejamento de safras e identificação de áreas de risco.</p>
          </div>
          <div className={styles.useCaseCard}>
            <h4>📋 Consultores Agronômicos</h4>
            <p>Laudos técnicos mais rápidos e completos para clientes.</p>
          </div>
          <div className={styles.useCaseCard}>
            <h4>🏦 Financiamento Rural</h4>
            <p>Análise de viabilidade para projetos de crédito e investimento.</p>
          </div>
          <div className={styles.useCaseCard}>
            <h4>🌳 Projetos Ambientais</h4>
            <p>Monitoramento de recuperação de áreas degradadas e regularização ambiental.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>O que nossos usuários dizem</h2>
        <div className={styles.testimonialGrid}>
          <div className={styles.testimonial}>
            <p>"Consegui entregar 3 laudos em um dia que normalmente levariam uma semana. O cliente ficou impressionado com o nível de detalhamento."</p>
            <strong>— Eng. Agr. Carolina Freitas, Goiás</strong>
          </div>
          <div className={styles.testimonial}>
            <p>"A integração com dados de satélite e a IA realmente fazem diferença. Recomendo para qualquer profissional do agro."</p>
            <strong>— João Mendes, Produtor em Mato Grosso</strong>
          </div>
          <div className={styles.testimonial}>
            <p>"Melhor ferramenta que testei em 2025. Os relatórios em Markdown são extremamente úteis."</p>
            <strong>— Consultoria AgroVisão</strong>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.finalCta}>
        <h2>Comece agora e transforme sua análise territorial</h2>
        <p className={styles.finalSubtitle}>
          Teste grátis por 14 dias. Sem compromisso. Sem necessidade de cartão.
        </p>
        <Link to="/register" className={styles.primaryButtonBig}>
          Criar conta gratuita
        </Link>
      </section>

      <footer className={styles.footer}>
        <div>© {new Date().getFullYear()} Araterra — MVP de inteligência territorial</div>
        <div className={styles.footerLinks}>
          <a href="#">Documentação</a>
          <a href="#">Blog</a>
          <a href="#">Suporte</a>
          <a href="#">Contato</a>
        </div>
      </footer>
    </div>
  );
}