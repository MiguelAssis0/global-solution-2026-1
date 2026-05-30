import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { LegalLayout, type LegalNavItem } from "../../components/legal/LegalLayout";
import doc from "../../components/legal/LegalDocument.module.css";

const navItems: LegalNavItem[] = [
  { id: "aceitacao", label: "Aceitação" },
  { id: "conta", label: "Conta e acesso" },
  { id: "plataforma", label: "Uso da plataforma" },
  { id: "fontes", label: "Dados e fontes" },
  { id: "ia", label: "IA e relatórios" },
  { id: "permitido", label: "Uso permitido" },
  { id: "disponibilidade", label: "Disponibilidade" },
  { id: "propriedade", label: "Propriedade" },
  { id: "privacidade", label: "Privacidade" },
  { id: "responsabilidades", label: "Responsabilidades" },
  { id: "alteracoes", label: "Alterações" },
  { id: "contato", label: "Contato" },
];

export function TermsPage() {
  return (
    <LegalLayout
      kicker="Condições de uso"
      title="Termos de Uso"
      description="Regras para acessar o site, o mapa operacional, as análises territoriais e os relatórios assistidos da Araterra."
      badges={[
        { text: "Última atualização: 30/05/2026", icon: "calendar" },
        { text: "Aplicável ao site público, área autenticada e módulos atuais", icon: "file" },
      ]}
      navItems={navItems}
    >
      <div className={doc.notice}>
        <Info aria-hidden="true" />
        <p>
          Estes termos foram redigidos para orientar o uso da Araterra. Versões
          contratuais podem trazer condições comerciais, níveis de serviço,
          responsabilidades e dados das partes de forma mais específica.
        </p>
      </div>

      <section className={doc.section} id="aceitacao">
        <h2>1. Aceitação dos termos</h2>
        <p>
          Ao acessar ou usar a Araterra, o usuário declara que leu, compreendeu
          e concorda com estes Termos de Uso e com a Política de Privacidade.
          Caso não concorde, deve interromper o uso do site e dos recursos
          autenticados.
        </p>
        <p>
          A plataforma é destinada a apoiar análises territoriais rurais com
          recursos de mapa, clima, vegetação, infraestrutura, dados geoespaciais
          e relatórios assistidos por IA.
        </p>
      </section>

      <section className={doc.section} id="conta">
        <h2>2. Conta, credenciais e acesso</h2>
        <p>
          Algumas funcionalidades exigem cadastro, login e manutenção de
          credenciais individuais. O usuário é responsável por informar dados
          corretos, proteger sua senha e comunicar qualquer suspeita de acesso
          indevido.
        </p>
        <p>
          A Araterra poderá suspender ou limitar acesso em caso de uso indevido,
          risco de segurança, violação destes termos, determinação legal ou
          necessidade de proteção da plataforma e de terceiros.
        </p>
      </section>

      <section className={doc.section} id="plataforma">
        <h2>3. Uso do mapa operacional</h2>
        <p>
          O usuário pode selecionar pontos, desenhar polígonos e ativar camadas
          para consolidar dados territoriais. As análises geradas representam
          uma leitura técnica baseada nas informações disponíveis no momento da
          consulta.
        </p>
        <p>
          O usuário deve verificar se possui autorização para inserir,
          compartilhar ou analisar dados de determinada área, propriedade,
          fazenda, cliente ou parceiro. A Araterra não valida titularidade,
          posse, licenciamento, regularidade ambiental ou direito de uso do
          imóvel analisado.
        </p>
      </section>

      <section className={doc.section} id="fontes">
        <h2>4. Dados, camadas e fontes externas</h2>
        <p>
          A plataforma pode integrar dados próprios e fontes externas, como
          mapas, imagens, clima, vias, energia, vegetação e bases públicas ou de
          terceiros. Essas fontes podem variar em atualização, cobertura,
          precisão, disponibilidade e licenciamento.
        </p>
        <p>
          Os resultados devem ser interpretados como apoio à decisão. Antes de
          investimentos, aquisições, manejo, aplicação de insumos ou definição
          de risco, recomenda-se validação por profissionais responsáveis,
          documentos oficiais e inspeções de campo quando cabível.
        </p>
      </section>

      <section className={doc.section} id="ia">
        <h2>5. Relatórios assistidos por inteligência artificial</h2>
        <p>
          Recursos de IA podem sintetizar dados e produzir explicações,
          hipóteses, alertas ou recomendações preliminares. Esses conteúdos não
          constituem laudo definitivo, consultoria jurídica, avaliação ambiental
          oficial, recomendação financeira ou prescrição agronômica.
        </p>
        <p>
          O usuário é responsável por revisar os relatórios antes de
          compartilhá-los, armazená-los ou utilizá-los em decisões relevantes.
          Eventuais inconsistências devem ser comunicadas ao suporte para
          análise e melhoria da plataforma.
        </p>
      </section>

      <section className={doc.section} id="permitido">
        <h2>6. Uso permitido e restrições</h2>
        <p>O usuário concorda em não:</p>
        <ul>
          <li>usar a plataforma para fins ilícitos, abusivos ou fraudulentos;</li>
          <li>tentar acessar contas, dados, servidores ou áreas não autorizadas;</li>
          <li>copiar, revender ou explorar comercialmente a plataforma sem autorização;</li>
          <li>inserir conteúdo que viole direitos de terceiros ou obrigações legais;</li>
          <li>interferir na estabilidade, segurança ou desempenho do serviço;</li>
          <li>remover avisos de propriedade intelectual, autoria ou origem de dados.</li>
        </ul>
      </section>

      <section className={doc.section} id="disponibilidade">
        <h2>7. Disponibilidade e evolução do serviço</h2>
        <p>
          A Araterra pode evoluir, corrigir, remover ou substituir módulos,
          camadas, integrações e recursos visuais para melhorar segurança,
          desempenho e aderência à proposta da ferramenta.
        </p>
        <p>
          Interrupções podem ocorrer por manutenção, indisponibilidade de
          fornecedores, falhas de rede, incidentes de segurança, força maior ou
          limitações técnicas. Quando possível, medidas razoáveis serão adotadas
          para reduzir impacto sobre os usuários.
        </p>
      </section>

      <section className={doc.section} id="propriedade">
        <h2>8. Propriedade intelectual</h2>
        <p>
          Marca, interface, textos, estrutura visual, código, componentes,
          fluxos, organização dos dados e elementos da Araterra pertencem à
          plataforma ou a seus licenciadores. O uso permitido não transfere
          propriedade intelectual ao usuário.
        </p>
        <p>
          Dados inseridos pelo usuário continuam pertencendo ao usuário ou à
          parte que detém seus direitos. A Araterra poderá processá-los apenas
          conforme estes termos, a Política de Privacidade e contratos
          aplicáveis.
        </p>
      </section>

      <section className={doc.section} id="privacidade">
        <h2>9. Privacidade e proteção de dados</h2>
        <p>
          O tratamento de dados pessoais segue a Política de Privacidade da
          Araterra. Ao usar a plataforma, o usuário declara ciência sobre coleta,
          uso, armazenamento, compartilhamento, cookies e direitos dos titulares.
        </p>
        <p>
          Quando o usuário inserir dados de terceiros, deverá garantir que possui
          base legal, autorização ou relação legítima para fazê-lo.
        </p>
      </section>

      <section className={doc.section} id="responsabilidades">
        <h2>10. Limites de responsabilidade</h2>
        <p>
          A Araterra busca apresentar informações úteis e coerentes, mas não
          garante que todos os dados externos estejam completos, atualizados ou
          livres de erro. Decisões de campo, compra, venda, licenciamento,
          manejo, crédito, seguro ou investimento devem considerar outras fontes
          e validação profissional.
        </p>
        <p>
          O usuário é responsável pelas decisões tomadas com base no uso da
          plataforma, pela legalidade dos dados inseridos e pelo cumprimento de
          normas aplicáveis à sua atividade.
        </p>
      </section>

      <section className={doc.section} id="alteracoes">
        <h2>11. Alterações destes termos</h2>
        <p>
          Estes termos podem ser atualizados para refletir mudanças legais,
          novas funcionalidades, ajustes operacionais ou melhorias de segurança.
          A versão vigente será publicada nesta página com a data de atualização.
        </p>
      </section>

      <section className={doc.section} id="contato">
        <h2>12. Contato</h2>
        <p>
          Dúvidas sobre estes termos, acesso à plataforma ou uso dos recursos
          podem ser encaminhadas ao suporte.
        </p>
        <p>
          Canal de contato: <strong>contato@araterra.app</strong>.
        </p>
      </section>

      <div className={doc.actions}>
        <Link to="/suporte" className={doc.primaryAction}>
          Falar com suporte
        </Link>
        <Link to="/privacidade" className={doc.secondaryAction}>
          Ver Política de Privacidade
        </Link>
      </div>
    </LegalLayout>
  );
}
