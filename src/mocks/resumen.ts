import type { ResumenEjecutivo } from "@/types";

// DATOS DE EJEMPLO. Reemplazalos por los mocks reales del proyecto web.
export const resumenMock: ResumenEjecutivo = {
  periodo: "Todo el período",
  principal: {
    label: "Costo por punto de incapacidad",
    value: "$ 4,8 M",
    delta: "6,2 % vs. año anterior",
    serie: [48, 44, 46, 36, 38, 26, 28, 16, 12].map((v) => 60 - v),
  },
  kpis: [
    { id: "fallos", label: "Fallos analizados", value: "1.284", delta: "112 nuevos", trend: "up" },
    { id: "personas", label: "Personas afectadas", value: "1.731", delta: "9 %", trend: "up" },
    { id: "fallecido", label: "Costo por fallecido", value: "$ 62 M", delta: "4,1 %", trend: "up", upIsBad: true },
    { id: "demora", label: "Demora judicial", value: "4,6 años", delta: "0,3 años", trend: "down" },
  ],
  rubros: [
    { rubro: "Incapacidad", porcentaje: 58 },
    { rubro: "Daño moral", porcentaje: 24 },
    { rubro: "Gastos médicos", porcentaje: 11 },
    { rubro: "Otros", porcentaje: 7 },
  ],
  jurisdicciones: [
    { nombre: "CABA", costoPorPunto: "$ 5,4 M", fallos: 312 },
    { nombre: "Buenos Aires", costoPorPunto: "$ 4,9 M", fallos: 287 },
    { nombre: "Santa Fe", costoPorPunto: "$ 4,1 M", fallos: 164 },
  ],
  datosIncompletosPct: 18,
  summaryCards: [
    { label: "Sentencias analizadas", value: "2.065", meta: "desde 2025", tone: "accent" },
    { label: "Capital indemnizatorio medio", value: "$50,1 MM", meta: "promedio", tone: "neutral" },
    { label: "Costo por punto de incapacidad", value: "$1.57 MM", meta: "promedio", tone: "neutral" },
    { label: "Demora mediana", value: "5.82 años", meta: "hecho → sentencia", tone: "warning" },
    { label: "Doctrina barrientos", value: "85.57%", meta: "de las sentencias", tone: "accent" },
  ],
  trend: {
    labels: ["jun 2025", "jul 2025", "ago 2025", "sept 2025", "oct 2025", "nov 2025", "dic 2025"],
    primary: [1.5, 1.7, 1.6, 1.8, 1.9, 1.8, 1.7],
    secondary: [1.4, 1.5, 1.3, 1.5, 1.6, 1.5, 1.4],
    tertiary: [1.2, 1.3, 1.2, 1.4, 1.5, 1.45, 1.35],
  },
  composition: [
    { label: "Incapacidad", pct: 63 },
    { label: "Daño moral", pct: 48 },
    { label: "Valor vida", pct: 36 },
    { label: "Daño emergente personal", pct: 29 },
    { label: "Daño emergente material", pct: 22 },
    { label: "Lucro cesante", pct: 19 },
    { label: "Pérdida de chance", pct: 14 },
  ],
  distribution: [
    { label: "0-10%", value: 4 },
    { label: ">10-20%", value: 11 },
    { label: ">20-30%", value: 21 },
    { label: ">30-40%", value: 28 },
    { label: ">40-50%", value: 18 },
    { label: ">50-60%", value: 10 },
    { label: ">60-70%", value: 6 },
    { label: ">70-80%", value: 3 },
    { label: ">80-90%", value: 2 },
    { label: ">90-100%", value: 1 },
  ],
  insights: [
    { text: "$1.57 MM", strong: "es el costo promedio por punto." },
    { text: "La incapacidad media es de", strong: "20%." },
    { text: "13.32%", strong: "de los fallos no tiene doctrina clasificada." },
  ],
};
