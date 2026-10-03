// Ajustá estos tipos al modelo real de tu API (FastAPI) cuando conectes el backend.
export type Trend = "up" | "down";

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: Trend;
  /** true si una suba es negativa para el negocio (se muestra en color de alerta) */
  upIsBad?: boolean;
}

export interface MetricaPrincipal {
  label: string;
  value: string;
  delta: string;
  serie: number[];
}

export interface RubroShare {
  rubro: string;
  porcentaje: number;
}

export interface JurisdiccionTop {
  nombre: string;
  costoPorPunto: string;
  fallos: number;
}

export interface SummaryCard {
  label: string;
  value: string;
  meta: string;
  tone?: "neutral" | "accent" | "warning";
}

export interface TrendSeries {
  labels: string[];
  primary: number[];
  secondary: number[];
  tertiary: number[];
}

export interface CompositionItem {
  label: string;
  pct: number;
}

export interface DistributionBin {
  label: string;
  value: number;
}

export interface InsightItem {
  text: string;
  strong?: string;
}

export interface ResumenEjecutivo {
  periodo: string;
  principal: MetricaPrincipal;
  kpis: Kpi[];
  rubros: RubroShare[];
  jurisdicciones: JurisdiccionTop[];
  datosIncompletosPct: number;
  summaryCards: SummaryCard[];
  trend: TrendSeries;
  composition: CompositionItem[];
  distribution: DistributionBin[];
  insights: InsightItem[];
}
