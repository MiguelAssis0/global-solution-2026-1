import {
  CloudSun,
  FileText,
  Layers,
  Target,
} from "lucide-react";

export const solutions = [
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

export const riskItems = [
  "Identificação de áreas com maior risco climático e operacional.",
  "Avaliação de vegetação por NDVI e leitura rápida de anomalias.",
  "Consulta de infraestrutura próxima, como estradas e pontos de energia.",
  "Resumo técnico de solo, clima e entorno para cada talhão analisado.",
  "Priorização de visitas e investimentos com base em dados geoespaciais.",
  "Histórico de análises para comparar áreas e acompanhar evolução.",
];

export const farmBenefits = [
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

export const dataPoints = [
  { value: "1", label: "Semana para desenvolver" },
  { value: "3", label: "Desenvolvedores " },
  { value: "0", label: "Usuários cadastrados" },
  { value: "0", label: "Locais atendidos" },
  { value: "1", label: "API de clima integrado" },
];
