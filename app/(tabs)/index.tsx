import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { Card } from "@/components/Card";
import { KpiCard } from "@/components/KpiCard";
import { BarRow } from "@/components/BarRow";
import { Sparkline } from "@/components/Sparkline";
import { filtrosIniciales, getResumenEjecutivo, type ResumenFiltros } from "@/services/resumenService";
import { colors, fonts, radius } from "@/theme";
import type { ResumenEjecutivo } from "@/types";

const FILTER_OPTIONS: { key: keyof ResumenFiltros; label: string; options: string[] }[] = [
  { key: "periodo", label: "Período", options: ["Todo el período", "Últimos 12 meses", "2025"] },
  { key: "jurisdiccion", label: "Jurisdicción", options: ["Todas", "CABA", "Buenos Aires", "Santa Fe", "Córdoba"] },
  { key: "instancia", label: "Instancia", options: ["Todas", "Primera", "Apelación"] },
  { key: "sentencia", label: "Sentencia", options: ["Condenatorias", "Todas", "Parcial"] },
];

const CHART_COLORS = {
  primary: colors.accent,
  secondary: "#6DB3B7",
  tertiary: "#D3E3E8",
};

export default function ResumenScreen() {
  const [data, setData] = useState<ResumenEjecutivo | null>(null);
  const [filters, setFilters] = useState(filtrosIniciales);
  const [openFilter, setOpenFilter] = useState<keyof ResumenFiltros | null>(null);
  const { width } = useWindowDimensions();
  const heroInner = width - 32 - 36;
  const chartWidth = Math.max(width - 64, 280);

  useEffect(() => {
    let current = true;
    getResumenEjecutivo(filters).then((result) => {
      if (current) setData(result);
    });
    return () => {
      current = false;
    };
  }, [filters]);

  if (!data) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Resumen ejecutivo</Text>
          <Text style={styles.sub}>Mercado judicial de RC por lesiones y muertes</Text>
        </View>

        <View style={styles.filterBar}>
          {FILTER_OPTIONS.map((filter) => (
            <Pressable
              key={filter.key}
              accessibilityRole="button"
              accessibilityLabel={`${filter.label}: ${filters[filter.key]}`}
              onPress={() => setOpenFilter(filter.key)}
              style={styles.filterButton}
            >
              <Text style={styles.filterLabel}>{filter.label}</Text>
              <View style={styles.filterValueRow}>
                <Text numberOfLines={1} style={styles.filterValue}>{filters[filter.key]}</Text>
                <Text style={styles.filterChevron}>⌄</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Modal visible={openFilter !== null} transparent animationType="fade" onRequestClose={() => setOpenFilter(null)}>
          <Pressable style={styles.filterBackdrop} onPress={() => setOpenFilter(null)}>
            <View style={styles.filterSheet}>
              <Text style={styles.filterHeading}>{FILTER_OPTIONS.find((item) => item.key === openFilter)?.label}</Text>
              {FILTER_OPTIONS.find((item) => item.key === openFilter)?.options.map((option) => {
                const selected = openFilter !== null && filters[openFilter] === option;
                return (
                  <Pressable
                    key={option}
                    style={[styles.filterOption, selected && styles.filterOptionSelected]}
                    onPress={() => {
                      if (openFilter) setFilters((current) => ({ ...current, [openFilter]: option }));
                      setOpenFilter(null);
                    }}
                  >
                    <Text style={[styles.filterOptionText, selected && styles.filterOptionTextSelected]}>{option}</Text>
                    {selected && <Text style={styles.filterCheck}>✓</Text>}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Modal>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.summaryCarousel}
          snapToInterval={260}
          decelerationRate="fast"
        >
          {data.summaryCards.map((item) => (
            <Card key={item.label} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={[styles.summaryValue, item.tone === "warning" && styles.warningValue]}>{item.value}</Text>
              <Text style={styles.summaryMeta}>{item.meta}</Text>
            </Card>
          ))}
        </ScrollView>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>{data.principal.label}</Text>
          <Text style={styles.heroValue}>{data.principal.value}</Text>
          <Text style={styles.heroDelta}>▲ {data.principal.delta}</Text>
          <View style={styles.sparkWrap}>
            <Sparkline data={data.principal.serie} width={heroInner} color={colors.onInkSoft} />
          </View>
        </View>

        <View style={styles.fullWidthStack}>
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Evolución mensual del costo por punto</Text>
            <TrendChart width={chartWidth} data={data.trend} />
          </Card>

          <Card style={[styles.chartCard, styles.chartCardSpacing]}>
            <Text style={styles.chartTitle}>Composición del capital indemnizatorio</Text>
            <View style={styles.compList}>
              {data.composition.map((item) => (
                <View key={item.label} style={styles.compRow}>
                  <Text style={styles.compLabel}>{item.label}</Text>
                  <View style={styles.compTrack}>
                    <View style={[styles.compFill, { width: `${item.pct}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </Card>

          <Card style={[styles.chartCard, styles.chartCardSpacing]}>
            <Text style={styles.chartTitle}>Distribución de fallos por criterio de intereses</Text>
            <HistogramChart values={data.distribution} accent={colors.accent} />
          </Card>

          <Card style={[styles.chartCard, styles.chartCardSpacing]}>
            <Text style={styles.chartTitle}>Distribución de incapacidad</Text>
            <HistogramChart values={data.distribution} accent="#F79A67" />
          </Card>
        </View>

        <Card style={styles.insightCard}>
          <Text style={styles.insightTitle}>Lecturas principales</Text>
          {data.insights.map((item, idx) => (
            <Text key={`${item.text}-${idx}`} style={styles.insightText}>
              <Text style={styles.insightStrong}>{item.strong || item.text}</Text>
              {!item.strong ? "" : ` ${item.text.replace(item.strong, "")}`}
            </Text>
          ))}
        </Card>

        <View style={styles.grid}>
          {[0, 2].map((i) => (
            <View key={i} style={styles.gridRow}>
              <KpiCard kpi={data.kpis[i]} />
              <KpiCard kpi={data.kpis[i + 1]} />
            </View>
          ))}
        </View>

        <Card style={styles.section}>
          <Text style={styles.h2}>Rubros indemnizados</Text>
          <Text style={styles.p}>Participación sobre el monto total</Text>
          {data.rubros.map((r) => (
            <BarRow key={r.rubro} label={r.rubro} pct={r.porcentaje} />
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.h2}>Jurisdicciones con más fallos</Text>
          <Text style={styles.p}>Las tres con mayor volumen</Text>
          {data.jurisdicciones.length === 0 && <Text style={styles.emptyState}>Sin datos para esta selección</Text>}
          {data.jurisdicciones.map((j, i) => (
            <View key={j.nombre} style={[styles.row, i > 0 && styles.rowBorder]}>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowTitle}>{j.nombre}</Text>
                <Text style={styles.rowSub}>Costo por punto {j.costoPorPunto}</Text>
              </View>
              <Text style={styles.rowValue}>{j.fallos}</Text>
            </View>
          ))}
        </Card>

        <View style={styles.alert}>
          <Text style={styles.h2}>Atención</Text>
          <Text style={styles.alertText}>
            El {data.datosIncompletosPct}% de las personas aún no tiene datos de severidad cargados.
            Completar la carga mejora la precisión.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TrendChart({ width, data }: { width: number; data: ResumenEjecutivo["trend"] }) {
  const padding = 24;
  const min = Math.min(...data.primary, ...data.secondary, ...data.tertiary);
  const max = Math.max(...data.primary, ...data.secondary, ...data.tertiary);
  const innerWidth = width - padding * 2;
  const innerHeight = 140;
  const [tooltip, setTooltip] = useState<{ label: string; value: string; x: number; y: number } | null>(null);

  const toPath = (values: number[]) => {
    const step = innerWidth / (values.length - 1);
    return values
      .map((value, index) => {
        const x = padding + index * step;
        const y = padding + innerHeight - ((value - min) / (max - min || 1)) * innerHeight;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  };

  return (
    <View style={styles.trendChartWrap}>
      <Svg width={width} height={180} viewBox={`0 0 ${width} 180`}>
        {[0, 1, 2, 3].map((line) => {
          const y = 20 + line * 40;
          return <Line key={line} x1={18} y1={y} x2={width - 12} y2={y} stroke="#E6EBF0" strokeWidth={1} />;
        })}
        <Path d={toPath(data.primary)} fill="none" stroke={CHART_COLORS.primary} strokeWidth={2.5} />
        <Path d={toPath(data.secondary)} fill="none" stroke={CHART_COLORS.secondary} strokeWidth={2.5} strokeDasharray="5 5" />
        <Path d={toPath(data.tertiary)} fill="none" stroke={CHART_COLORS.tertiary} strokeWidth={2.5} />
        {data.primary.map((val, idx) => {
          const x = padding + (idx * innerWidth) / (data.primary.length - 1);
          const y = padding + innerHeight - ((val - min) / (max - min || 1)) * innerHeight;
          return (
            <Pressable key={`${val}-${idx}`} onPress={() => setTooltip({ label: data.labels[idx], value: `${val.toFixed(1)}M`, x: x, y: y })}>
              <Circle cx={x} cy={y} r={4} fill={CHART_COLORS.primary} />
            </Pressable>
          );
        })}
      </Svg>
      {tooltip && (
        <View style={[styles.tooltipBubble, { left: Math.max(10, tooltip.x - 18), top: Math.max(10, tooltip.y - 42) }]}>
          <Text style={styles.tooltipLabel}>{tooltip.label}</Text>
          <Text style={styles.tooltipValue}>{tooltip.value}</Text>
        </View>
      )}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: CHART_COLORS.primary }]} /><Text style={styles.legendText}>P10</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: CHART_COLORS.secondary }]} /><Text style={styles.legendText}>P90</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: CHART_COLORS.tertiary }]} /><Text style={styles.legendText}>Promedio</Text></View>
      </View>
      <View style={styles.axisRow}>
        {data.labels.map((label) => (
          <Text key={label} style={styles.axisLabel}>{label}</Text>
        ))}
      </View>
    </View>
  );
}

function HistogramChart({ values, accent }: { values: { label: string; value: number }[]; accent: string }) {
  const [active, setActive] = useState<{ label: string; value: number } | null>(null);

  return (
    <View style={styles.histogram}>
      {values.map((bin) => {
        const height = Math.min(Math.max(bin.value * 5, 12), 100);
        return (
          <View key={bin.label} style={styles.histColumn}>
            <Pressable onPress={() => setActive(bin)} style={styles.histPressable}>
              <View style={[styles.histBar, { height: `${height}%`, backgroundColor: accent }]} />
            </Pressable>
            <Text style={styles.histLabel}>{bin.label}</Text>
            {active?.label === bin.label && (
              <View style={styles.tooltipBubbleSmall}>
                <Text style={styles.tooltipLabel}>{bin.label}</Text>
                <Text style={styles.tooltipValue}>{bin.value}%</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  header: { marginBottom: 12 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.8,
  },
  sub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  filterBar: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  filterButton: {
    width: "48.5%",
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    backgroundColor: colors.card,
  },
  filterLabel: { fontSize: 10, color: colors.muted, marginBottom: 3 },
  filterValueRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 6 },
  filterValue: { flex: 1, fontSize: 12, color: colors.ink, fontWeight: "600" },
  filterChevron: { fontSize: 17, lineHeight: 18, color: colors.accent },
  filterBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(12, 26, 31, 0.35)" },
  filterSheet: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 30,
    backgroundColor: colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  filterHeading: { fontFamily: fonts.serif, fontSize: 20, color: colors.ink, marginBottom: 10 },
  filterOption: { minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: colors.line },
  filterOptionSelected: { backgroundColor: colors.accentSoft },
  filterOptionText: { fontSize: 14, color: colors.ink },
  filterOptionTextSelected: { fontWeight: "700" },
  filterCheck: { fontSize: 16, fontWeight: "700", color: colors.accent, paddingHorizontal: 12 },
  summaryCarousel: {
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
  },
  summaryCard: {
    width: 240,
    minHeight: 118,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    marginRight: 8,
  },
  summaryLabel: { fontSize: 11, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.7 },
  summaryValue: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.ink,
    marginTop: 10,
    lineHeight: 30,
  },
  warningValue: { color: colors.warn },
  summaryMeta: { fontSize: 12, color: colors.muted, marginTop: 6 },
  hero: {
    marginTop: 12,
    backgroundColor: colors.ink,
    borderRadius: radius.hero,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  heroLabel: { fontSize: 12.5, color: "#fff", opacity: 0.72 },
  heroValue: {
    fontFamily: fonts.serif,
    fontSize: 44,
    lineHeight: 50,
    fontWeight: "600",
    color: "#fff",
    marginTop: 8,
  },
  heroDelta: { fontSize: 12.5, color: colors.onInkSoft, marginTop: 4 },
  sparkWrap: { marginTop: 12 },
  fullWidthStack: { marginTop: 12, gap: 12 },
  chartCard: { padding: 14, minHeight: 260 },
  chartCardSpacing: { marginTop: 0 },
  chartTitle: { fontSize: 15, fontWeight: "600", color: colors.ink, marginBottom: 8 },
  trendChartWrap: { marginTop: 8 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 8, height: 8, borderRadius: 999, marginRight: 5 },
  legendText: { fontSize: 11, color: colors.muted },
  axisRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  axisLabel: { fontSize: 9, color: colors.muted, textTransform: "lowercase" },
  compList: { marginTop: 8, gap: 10 },
  compRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  compLabel: { width: 102, fontSize: 11.5, color: colors.muted },
  compTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: colors.accentSoft, overflow: "hidden" },
  compFill: { height: "100%", backgroundColor: colors.accent, borderRadius: 999 },
  histogram: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 170,
    marginTop: 12,
    gap: 4,
    overflow: "visible",
    paddingBottom: 18,
  },
  histColumn: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    justifyContent: "flex-end",
    minHeight: 150,
  },
  histPressable: { width: "100%", alignItems: "center", justifyContent: "flex-end", height: 120 },
  histBar: { width: "80%", backgroundColor: colors.accent, borderRadius: 6, minHeight: 12, maxHeight: "100%" },
  histBarAlt: { width: "80%", backgroundColor: "#F79A67", borderRadius: 6, minHeight: 12, maxHeight: "100%" },
  histLabel: { fontSize: 8.5, color: colors.muted, marginTop: 8, textAlign: "center" },
  tooltipBubble: {
    position: "absolute",
    backgroundColor: colors.ink,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 64,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 10,
  },
  tooltipBubbleSmall: {
    position: "absolute",
    top: 6,
    left: "50%",
    transform: [{ translateX: -34 }],
    backgroundColor: colors.ink,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 68,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 15,
  },
  tooltipLabel: { color: "#fff", fontSize: 9, opacity: 0.8 },
  tooltipValue: { color: "#fff", fontSize: 11, fontWeight: "700", marginTop: 2 },
  insightCard: { marginTop: 12, backgroundColor: "#F0F7F5", borderColor: colors.line, borderWidth: 1, borderRadius: radius.card, padding: 16 },
  insightTitle: { fontSize: 14, fontWeight: "700", color: colors.ink, marginBottom: 8 },
  insightText: { fontSize: 13, color: colors.ink, marginTop: 2, lineHeight: 18 },
  insightStrong: { fontWeight: "700", color: colors.accent },
  grid: { gap: 10, marginTop: 12 },
  gridRow: { flexDirection: "row", gap: 10 },
  section: { marginTop: 12 },
  h2: { fontSize: 15, fontWeight: "700", color: colors.ink },
  p: { fontSize: 12.5, color: colors.muted, marginTop: 2, marginBottom: 8 },
  emptyState: { fontSize: 12.5, color: colors.muted, paddingVertical: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 11 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  rowTextWrap: { flex: 1, paddingRight: 8 },
  rowTitle: { fontSize: 13.5, color: colors.ink, fontWeight: "600" },
  rowSub: { fontSize: 12, color: colors.muted, marginTop: 1 },
  rowValue: { fontSize: 14, fontWeight: "700", color: colors.ink },
  alert: {
    marginTop: 12,
    backgroundColor: colors.warnSoft,
    borderColor: "#F1D9B8",
    borderWidth: 1,
    borderRadius: radius.card,
    padding: 14,
  },
  alertText: { fontSize: 12.5, color: "#6B3A10", marginTop: 6, lineHeight: 18 },
});
