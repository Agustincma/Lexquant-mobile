import { resumenMock } from "@/mocks/resumen";
import type { ResumenEjecutivo } from "@/types";

export interface ResumenFiltros {
  periodo: "Todo el período" | "Últimos 12 meses" | "2025";
  jurisdiccion: "Todas" | "CABA" | "Buenos Aires" | "Santa Fe" | "Córdoba";
  instancia: "Todas" | "Primera" | "Apelación";
  sentencia: "Condenatorias" | "Todas" | "Parcial";
}

export const filtrosIniciales: ResumenFiltros = {
  periodo: "Todo el período",
  jurisdiccion: "Todas",
  instancia: "Todas",
  sentencia: "Condenatorias",
};

const jurisdiccionFactores: Record<ResumenFiltros["jurisdiccion"], number> = {
  Todas: 1,
  CABA: 0.91,
  "Buenos Aires": 0.86,
  "Santa Fe": 0.76,
  Córdoba: 0.68,
};

const instanciaFactores: Record<ResumenFiltros["instancia"], number> = {
  Todas: 1,
  Primera: 0.82,
  Apelación: 0.46,
};

const sentenciaFactores: Record<ResumenFiltros["sentencia"], number> = {
  Condenatorias: 0.82,
  Todas: 1,
  Parcial: 0.64,
};

function formatMillions(value: number) {
  return `$ ${(value / 1_000_000).toFixed(2)} MM`;
}

// El fixture no tiene registros por dimensión; esta derivación es temporal hasta conectar el endpoint.
function applyMockFilters(data: ResumenEjecutivo, filters: ResumenFiltros): ResumenEjecutivo {
  const periodStart = filters.periodo === "Últimos 12 meses" ? Math.max(0, data.trend.labels.length - 3) : 0;
  const sampleFactor =
    (filters.periodo === "Últimos 12 meses" ? 0.43 : filters.periodo === "2025" ? 0.86 : 1) *
    jurisdiccionFactores[filters.jurisdiccion] *
    instanciaFactores[filters.instancia] *
    sentenciaFactores[filters.sentencia];
  const priceFactor =
    (filters.jurisdiccion === "Todas" ? 1 : 0.88 + jurisdiccionFactores[filters.jurisdiccion] * 0.18) *
    (filters.instancia === "Apelación" ? 1.12 : 1) *
    (filters.sentencia === "Parcial" ? 1.08 : 1);
  const trend = {
    labels: data.trend.labels.slice(periodStart),
    primary: data.trend.primary.slice(periodStart).map((value) => Number((value * priceFactor).toFixed(2))),
    secondary: data.trend.secondary.slice(periodStart).map((value) => Number((value * priceFactor).toFixed(2))),
    tertiary: data.trend.tertiary.slice(periodStart).map((value) => Number((value * priceFactor).toFixed(2))),
  };
  const composition = data.composition.map((item, index) => ({
    ...item,
    pct: Math.max(4, Math.min(96, Math.round(item.pct + (index % 2 === 0 ? 1 : -1) * (1 - sampleFactor) * 8))),
  }));
  const weightedDistribution = data.distribution.map((bin, index) => bin.value * (1 + (index - 4) * (1 - sampleFactor) * 0.025));
  const distributionTotal = weightedDistribution.reduce((total, value) => total + value, 0);
  const distribution = data.distribution.map((bin, index) => ({
    ...bin,
    value: Number(((weightedDistribution[index] / distributionTotal) * 100).toFixed(1)),
  }));
  const summaryCards = data.summaryCards.map((card, index) => {
    if (index === 0) {
      const count = Math.max(1, Math.round(Number(card.value.replace(/\D/g, "")) * sampleFactor));
      return { ...card, value: count.toLocaleString("es-AR") };
    }
    if (index === 1 || index === 2) {
      const value = Number(card.value.replace(/[^\d.,]/g, "").replace(",", "."));
      return { ...card, value: `$${(value * priceFactor).toFixed(1)} MM` };
    }
    return card;
  });
  const selectedJurisdictions = filters.jurisdiccion === "Todas"
    ? data.jurisdicciones
    : data.jurisdicciones.filter((item) => item.nombre === filters.jurisdiccion);

  return {
    ...data,
    periodo: filters.periodo,
    summaryCards,
    trend,
    composition,
    distribution,
    jurisdicciones: selectedJurisdictions,
    principal: {
      ...data.principal,
      value: formatMillions(4_800_000 * priceFactor),
      serie: data.principal.serie.map((value) => Number((value * priceFactor).toFixed(1))),
    },
    kpis: data.kpis.map((kpi, index) => {
      if (index === 0 || index === 1) {
        const count = Math.max(1, Math.round(Number(kpi.value.replace(/\D/g, "")) * sampleFactor));
        return { ...kpi, value: count.toLocaleString("es-AR") };
      }
      return kpi;
    }),
    rubros: data.rubros.map((item, index) => ({
      ...item,
      porcentaje: Math.max(1, Math.round(item.porcentaje + (index % 2 === 0 ? 1 : -1) * (1 - sampleFactor) * 5)),
    })),
  };
}

// Capa de acceso a datos. Hoy devuelve mocks; después se cambia por fetch a la API:
//   const res = await fetch(`${API_URL}/resumen-ejecutivo`); return res.json();
export async function getResumenEjecutivo(filters: ResumenFiltros = filtrosIniciales): Promise<ResumenEjecutivo> {
  await new Promise((r) => setTimeout(r, 300));
  return applyMockFilters(resumenMock, filters);
}
