import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { LegalLayout, type LegalNavItem } from "../../components/legal/LegalLayout";
import doc from "../../components/legal/LegalDocument.module.css";

const navItems: LegalNavItem[] = [
  { id: "escopo", label: "Escopo" },
  { id: "papeis", label: "Papéis LGPD" },
  { id: "dados", label: "Dados tratados" },
  { id: "finalidades", label: "Finalidades" },
  { id: "bases", label: "Bases legais" },
  { id: "compartilhamento", label: "Compartilhamento" },
  { id: "ia", label: "IA e relatórios" },
  { id: "cookies", label: "Cookies" },
  { id: "retencao", label: "Retenção" },
  { id: "direitos", label: "Direitos" },
  { id: "seguranca", label: "Segurança" },
  { id: "contato", label: "Contato" },
];

export function PrivacyPolicyPage() {
  return (
    <LegalLayout
      kicker="Privacidade e proteção de dados"
      title="Política de Privacidade"
      description="Como a Araterra trata dados pessoais no site, na autenticação, no mapa operacional e nos recursos de análise territorial."
      badges={[
        { text: "Última atualização: 30/05/2026", icon: "calendar" },
        { text: "Baseada na LGPD, Marco Civil da Internet e orientações da ANPD", icon: "shield" },
      ]}
      navItems={navItems}
    >
      <div className={doc.notice}>
        <Info aria-hidden="true" />
        <p>
          Esta política foi escrita para o contexto da plataforma Araterra. Em
          contratações reais, dados do controlador, operador, encarregado e
          fornecedores devem ser completados conforme o contrato e a operação.
        </p>
      </div>

      <section className={doc.section} id="escopo">
        <h2>1. Escopo desta política</h2>
        <p>
          Esta Política de Privacidade explica como a Araterra coleta, usa,
          armazena, compartilha e protege dados pessoais relacionados ao site
          público, formulários de contato, autenticação, perfil do usuário,
          mapa operacional, análises territoriais e relatórios assistidos por
          inteligência artificial.
        </p>
        <p>
          A plataforma combina informações fornecidas pelo usuário com dados
          geoespaciais, climáticos, de vegetação e infraestrutura para apoiar a
          avaliação de áreas rurais. Dados sobre imóveis, fazendas, polígonos e
          coordenadas podem revelar contexto operacional sensível e, por isso,
          são tratados com cuidado proporcional à finalidade.
        </p>
      </section>

      <section className={doc.section} id="papeis">
        <h2>2. Papéis LGPD</h2>
        <p>
          Dependendo do uso, a Araterra poderá atuar como controladora dos dados
          pessoais coletados em seus canais próprios ou como operadora quando
          tratar informações em nome de clientes, consultorias, produtores,
          empresas do agro ou instituições parceiras.
        </p>
        <p>
          Quando houver contratação específica, o contrato indicará quem decide
          sobre as finalidades do tratamento, quem opera a tecnologia, quais
          fornecedores participam do serviço e qual canal deve receber pedidos
          dos titulares.
        </p>
      </section>

      <section className={doc.section} id="dados">
        <h2>3. Dados pessoais e operacionais tratados</h2>
        <p>A Araterra pode tratar as seguintes categorias de dados:</p>
        <ul>
          <li>
            <strong>Identificação e contato:</strong> nome, e-mail, organização,
            telefone e mensagens enviadas em formulários de suporte.
          </li>
          <li>
            <strong>Autenticação:</strong> credenciais, registros de sessão,
            preferências de acesso e informações de recuperação de senha.
          </li>
          <li>
            <strong>Uso da plataforma:</strong> páginas acessadas, interações no
            mapa, datas, horários, endereço IP, navegador e registros técnicos.
          </li>
          <li>
            <strong>Dados geoespaciais:</strong> pontos, polígonos, centroides,
            áreas desenhadas, camadas ativadas e parâmetros usados em análises.
          </li>
          <li>
            <strong>Dados derivados:</strong> scores, alertas, resumos,
            indicadores de vegetação, clima, infraestrutura, contexto logístico
            e relatórios gerados pela plataforma.
          </li>
        </ul>
      </section>

      <section className={doc.section} id="finalidades">
        <h2>4. Finalidades de tratamento</h2>
        <p>Os dados podem ser usados para:</p>
        <ul>
          <li>criar, autenticar e proteger contas de usuários;</li>
          <li>permitir a seleção de pontos ou polígonos no mapa;</li>
          <li>executar análises de clima, vegetação, infraestrutura e risco;</li>
          <li>gerar resumos e relatórios técnicos assistidos por IA;</li>
          <li>responder dúvidas, incidentes e solicitações de suporte;</li>
          <li>melhorar estabilidade, segurança e usabilidade da aplicação;</li>
          <li>cumprir obrigações legais, regulatórias e contratuais.</li>
        </ul>
      </section>

      <section className={doc.section} id="bases">
        <h2>5. Bases legais</h2>
        <p>
          O tratamento poderá ocorrer com fundamento em execução de contrato,
          cumprimento de obrigação legal ou regulatória, exercício regular de
          direitos, legítimo interesse, proteção do crédito, proteção da vida ou
          consentimento, conforme a finalidade concreta e a relação com o
          titular.
        </p>
        <p>
          Quando o consentimento for necessário, ele será solicitado de forma
          clara e poderá ser revogado pelos canais indicados nesta política,
          respeitadas obrigações legais e registros indispensáveis.
        </p>
      </section>

      <section className={doc.section} id="compartilhamento">
        <h2>6. Compartilhamento com terceiros</h2>
        <p>
          Dados podem ser compartilhados com provedores de hospedagem,
          autenticação, banco de dados, mapas, clima, inteligência artificial,
          segurança, atendimento e infraestrutura técnica, sempre na medida
          necessária para operar a plataforma.
        </p>
        <p>
          Também poderá haver compartilhamento com clientes responsáveis pela
          contratação, autoridades públicas, órgãos reguladores ou terceiros
          quando houver obrigação legal, ordem válida ou necessidade de proteção
          de direitos.
        </p>
      </section>

      <section className={doc.section} id="ia">
        <h2>7. Inteligência artificial e relatórios</h2>
        <p>
          A Araterra pode usar recursos de IA para transformar dados de mapa,
          clima, vegetação e infraestrutura em textos explicativos, alertas e
          recomendações preliminares. Esses resultados devem apoiar a análise
          técnica, não substituir julgamento profissional, visita a campo ou
          decisão agronômica, ambiental, jurídica ou financeira.
        </p>
        <p>
          Quando necessário, informações enviadas para modelos de IA serão
          limitadas ao mínimo útil para gerar a resposta, com preferência por
          dados técnicos e geográficos em vez de dados pessoais identificáveis.
        </p>
      </section>

      <section className={doc.section} id="cookies">
        <h2>8. Cookies e tecnologias similares</h2>
        <p>
          O site pode usar cookies necessários para funcionamento, segurança,
          manutenção de sessão, preferências de interface e registro do
          consentimento. Cookies analíticos, de preferência ou publicidade,
          quando adicionados, deverão ser informados de forma clara e poderão
          depender de consentimento específico.
        </p>
        <p>
          O usuário pode gerenciar cookies pelo navegador e pelo aviso exibido
          na primeira visita. O bloqueio de cookies essenciais pode prejudicar
          login, autenticação e recursos do mapa.
        </p>
      </section>

      <section className={doc.section} id="retencao">
        <h2>9. Retenção e descarte</h2>
        <p>
          Os dados serão mantidos pelo tempo necessário para cumprir as
          finalidades informadas, atender obrigações legais, preservar registros
          de segurança, resolver disputas, prestar suporte e demonstrar
          conformidade. Após esse período, serão eliminados, anonimizados ou
          mantidos apenas quando houver base legal aplicável.
        </p>
      </section>

      <section className={doc.section} id="direitos">
        <h2>10. Direitos dos titulares</h2>
        <p>
          Nos termos da LGPD, titulares podem solicitar confirmação de
          tratamento, acesso, correção, anonimização, bloqueio, eliminação,
          portabilidade, informação sobre compartilhamentos, revisão de decisões
          automatizadas e revogação de consentimento, quando aplicável.
        </p>
        <p>
          Solicitações serão avaliadas conforme identidade do solicitante,
          contexto contratual e limites legais. Se a Araterra atuar como
          operadora, o pedido poderá ser encaminhado ao controlador responsável.
        </p>
      </section>

      <section className={doc.section} id="seguranca">
        <h2>11. Segurança da informação</h2>
        <p>
          A Araterra adota medidas técnicas e administrativas para reduzir riscos
          de acesso não autorizado, perda, alteração, destruição, comunicação
          indevida ou tratamento inadequado. Essas medidas incluem autenticação,
          controle de acesso, segregação lógica, registros técnicos e revisão de
          boas práticas de desenvolvimento.
        </p>
        <p>
          Nenhum sistema é imune a incidentes. Caso ocorra incidente com risco
          ou dano relevante aos titulares, serão avaliadas as providências
          cabíveis, incluindo comunicação aos envolvidos e à ANPD quando exigido
          pela legislação.
        </p>
      </section>

      <section className={doc.section} id="contato">
        <h2>12. Contato e atualização desta política</h2>
        <p>
          Esta política poderá ser atualizada para refletir novas ferramentas,
          mudanças legais, ajustes de segurança ou alterações contratuais.
          Dúvidas e pedidos relacionados à privacidade podem ser enviados pelo
          canal de suporte da plataforma.
        </p>
        <p>
          Canal de contato: <strong>contato@araterra.app</strong>.
        </p>
      </section>

      <div className={doc.actions}>
        <Link to="/suporte" className={doc.primaryAction}>
          Falar com suporte
        </Link>
        <Link to="/termos" className={doc.secondaryAction}>
          Ver Termos de Uso
        </Link>
      </div>
    </LegalLayout>
  );
}
