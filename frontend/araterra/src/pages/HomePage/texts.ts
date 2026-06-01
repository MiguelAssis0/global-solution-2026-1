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
    title: "Assistência com IA",
    description:
      "Entre em contato com nossa IA para receber orientações e soluções personalizadas.",
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
    title: "Planejamento",
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
      "Use indicadores recorrentes para acompanhar mudanças no território ao longo do tempo.",
  },
  {
    title: "Menos achismo",
    description:
      "Combine evidências públicas, dados ambientais e IA para reduzir decisões no escuro.",
  },
];

export const dataPoints = [
  { value: "100%", label: "De cobertura global" },
  { value: "IA", label: "Assistente de soluções" },
  { value: "3", label: "DEVS trabalhando" },
  { value: "GS", label: "Projeto Global Solution" },
  { value: "FIAP", label: "Feito por alunos da FIAP" },
];
