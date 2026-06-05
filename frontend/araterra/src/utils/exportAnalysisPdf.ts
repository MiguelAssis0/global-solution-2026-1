import type {
  AiLocationAnalysis,
  AnalysisResult,
  WeatherData,
} from "../types/analysis.types";
import type { CityInfo } from "../services/nominatimService";
import { formatArea, formatCoords, formatDistance, formatScore } from "./format";

interface ExportAnalysisPdfOptions {
  analysis: AnalysisResult;
  weather?: WeatherData;
  insight: string | null;
  aiAnalysis: AiLocationAnalysis | null;
  cityInfo: CityInfo | null;
}

const MAP_EXPORT_ID = "analysis-map-export";
const PAGE_MARGIN = 16;
const CONTENT_WIDTH = 178;
const PAGE_BOTTOM = 281;

function printable(value: string | number | null | undefined, fallback = "Não disponível") {
  return value == null || value === "" ? fallback : String(value);
}

function cleanMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```[a-z]*\n?/gi, "").replace(/```/g, ""))
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~`>]/g, "")
    .replace(/^\s*[-+]\s+/gm, "• ")
    .trim();
}

function fileCoordinate(analysis: AnalysisResult) {
  const lat = analysis.type === "point" ? analysis.lat : analysis.centroidLat;
  const lng = analysis.type === "point" ? analysis.lng : analysis.centroidLng;
  return `${lat.toFixed(4)}_${lng.toFixed(4)}`.replaceAll("-", "m").replaceAll(".", "_");
}

export async function exportAnalysisPdf({
  analysis,
  weather,
  insight,
  aiAnalysis,
  cityInfo,
}: ExportAnalysisPdfOptions) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  let cursorY = 18;

  const addPage = () => {
    pdf.addPage();
    cursorY = 18;
  };

  const ensureSpace = (height: number) => {
    if (cursorY + height > PAGE_BOTTOM) {
      addPage();
    }
  };

  const addTitle = (title: string) => {
    ensureSpace(14);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(23, 55, 96);
    pdf.text(title, PAGE_MARGIN, cursorY);
    cursorY += 8;
  };

  const addRows = (rows: Array<[string, string | number | null | undefined]>) => {
    pdf.setFontSize(10);
    for (const [label, rawValue] of rows) {
      const value = printable(rawValue);
      const lines = pdf.splitTextToSize(`${label}: ${value}`, CONTENT_WIDTH) as string[];
      ensureSpace(lines.length * 5 + 2);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(55, 65, 81);
      pdf.text(`${label}:`, PAGE_MARGIN, cursorY);
      const labelWidth = pdf.getTextWidth(`${label}: `);
      pdf.setFont("helvetica", "normal");
      const availableFirstLine = CONTENT_WIDTH - labelWidth;
      const valueLines = pdf.splitTextToSize(value, availableFirstLine) as string[];
      if (valueLines.length === 1) {
        pdf.text(valueLines[0], PAGE_MARGIN + labelWidth, cursorY);
        cursorY += 6;
      } else {
        cursorY += 5;
        const wrapped = pdf.splitTextToSize(value, CONTENT_WIDTH) as string[];
        pdf.text(wrapped, PAGE_MARGIN, cursorY);
        cursorY += wrapped.length * 5 + 1;
      }
    }
    cursorY += 3;
  };

  pdf.setFillColor(23, 55, 96);
  pdf.rect(0, 0, 210, 34, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("Araterra", PAGE_MARGIN, 16);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text("Relatório de análise territorial", PAGE_MARGIN, 24);
  cursorY = 44;

  addRows([
    ["Gerado em", new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(new Date())],
    [
      "Local analisado",
      analysis.type === "point"
        ? formatCoords(analysis.lat, analysis.lng)
        : formatCoords(analysis.centroidLat, analysis.centroidLng),
    ],
    ["Tipo de seleção", analysis.type === "point" ? "Ponto" : "Polígono"],
  ]);

  const mapElement = document.getElementById(MAP_EXPORT_ID);
  if (mapElement) {
    try {
      const canvas = await html2canvas(mapElement, {
        backgroundColor: "#eef2f6",
        logging: false,
        scale: Math.min(window.devicePixelRatio || 1, 2),
        useCORS: true,
      });
      const imageHeight = Math.min((canvas.height * CONTENT_WIDTH) / canvas.width, 95);
      ensureSpace(imageHeight + 13);
      addTitle("Mapa da seleção");
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.9), "JPEG", PAGE_MARGIN, cursorY, CONTENT_WIDTH, imageHeight);
      cursorY += imageHeight + 7;
    } catch {
      addTitle("Mapa da seleção");
      addRows([["Captura", "Não foi possível capturar as imagens do mapa neste navegador."]]);
    }
  }

  addTitle("Score territorial");
  addRows([
    ["Score final", formatScore(analysis.score.finalScore)],
    ["Classificação", analysis.score.classificationLabel],
    ["Estradas", analysis.score.roadsScore != null ? `${analysis.score.roadsScore}%` : null],
    ["Vegetação", analysis.score.ndviScore != null ? `${analysis.score.ndviScore}%` : null],
    ["Energia", analysis.score.energyScore != null ? `${analysis.score.energyScore}%` : null],
    ["Bioma", analysis.score.biomeScore != null ? `${analysis.score.biomeScore}%` : null],
    ["Localização", analysis.score.locationScore != null ? `${analysis.score.locationScore}%` : null],
  ]);

  if (weather) {
    addTitle("Clima local");
    addRows([
      ["Temperatura", `${weather.temperature.toFixed(1)} °C`],
      ["Umidade", `${weather.humidity}%`],
      ["Vento", `${weather.windSpeed.toFixed(1)} m/s`],
      ["Precipitação", `${weather.precipitation.toFixed(1)} mm`],
      ["Chuva acumulada em 7 dias", `${weather.weeklyRain.toFixed(1)} mm`],
    ]);
  }

  addTitle("Área e localização");
  const areaType =
    analysis.type === "point" ? analysis.biome : analysis.biomes.join(", ");
  addRows([
    ["Cidade", cityInfo ? `${cityInfo.cityName}, ${cityInfo.state}` : null],
    ["País", cityInfo?.country ?? aiAnalysis?.locationContext?.country],
    ["Região", aiAnalysis?.locationContext?.region],
    ["Tipo da área", areaType],
    ["Bioma", aiAnalysis?.biome?.name],
    ["Categoria do bioma", aiAnalysis?.biome?.category],
    ["Confiança da análise", aiAnalysis?.biome?.confidence],
    ...(analysis.type === "polygon"
      ? ([
          ["Área", formatArea(analysis.areaKm2)],
          ["Largura", formatDistance(analysis.widthKm)],
          ["Altura", formatDistance(analysis.heightKm)],
          ["Vértices", analysis.numVertices],
        ] as Array<[string, string | number]>)
      : []),
  ]);

  addTitle("Infraestrutura");
  addRows([
    [
      "Cidade mais próxima",
      cityInfo
        ? `${cityInfo.cityName}, ${cityInfo.state} • ${cityInfo.country}`
        : analysis.infra.nearestCity && analysis.infra.nearestCity.distKm < 999
        ? `${analysis.infra.nearestCity.name} (${formatDistance(analysis.infra.nearestCity.distKm)})`
        : null,
    ],
    [
      "Subestação",
      aiAnalysis?.nearestSubstation?.name
        ? `${aiAnalysis.nearestSubstation.name}${aiAnalysis.nearestSubstation.distanceKm != null ? ` (${formatDistance(aiAnalysis.nearestSubstation.distanceKm)})` : ""}`
        : null,
    ],
    [
      "Porto",
      aiAnalysis?.nearestPort?.name
        ? `${aiAnalysis.nearestPort.name}${aiAnalysis.nearestPort.distanceKm != null ? ` (${formatDistance(aiAnalysis.nearestPort.distanceKm)})` : ""}`
        : null,
    ],
    [
      "Rodovia principal",
      aiAnalysis?.nearestHighway?.name
        ? `${aiAnalysis.nearestHighway.name}${aiAnalysis.nearestHighway.roadType ? ` • ${aiAnalysis.nearestHighway.roadType}` : ""}${aiAnalysis.nearestHighway.distanceKm != null ? ` (${formatDistance(aiAnalysis.nearestHighway.distanceKm)})` : ""}`
        : analysis.roads.names[0],
    ],
    ["Estradas encontradas", analysis.roads.count],
  ]);

  addTitle("Insight de inteligência artificial");
  const insightText = insight ? cleanMarkdown(insight) : "Insight de IA não gerado para esta análise.";
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(55, 65, 81);
  const insightLines = pdf.splitTextToSize(insightText, CONTENT_WIDTH) as string[];
  for (const line of insightLines) {
    ensureSpace(6);
    pdf.text(line, PAGE_MARGIN, cursorY);
    cursorY += 5;
  }

  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(115, 125, 140);
    pdf.text(`Araterra • Página ${page} de ${pageCount}`, PAGE_MARGIN, 290);
  }

  pdf.save(`araterra-analise-${fileCoordinate(analysis)}.pdf`);
}
