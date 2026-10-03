import { StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";
import { colors, fonts } from "@/theme";
import type { Kpi } from "@/types";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const bad = kpi.trend === "up" ? !!kpi.upIsBad : false;
  const arrow = kpi.trend === "up" ? "▲" : "▼";
  const tone = bad ? colors.warn : colors.accent;

  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{kpi.label}</Text>
      <Text style={styles.value}>{kpi.value}</Text>
      <View style={[styles.deltaWrap, { backgroundColor: bad ? "#FCE7D4" : "#DDEFEF" }]}>
        <Text style={[styles.deltaArrow, { color: tone }]}>{arrow}</Text>
        <Text style={[styles.delta, { color: tone }]}>{kpi.delta}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minHeight: 120 },
  label: { fontSize: 12, color: colors.muted, lineHeight: 16 },
  value: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: "600",
    color: colors.ink,
    marginTop: 8,
    lineHeight: 30,
  },
  deltaWrap: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
  },
  deltaArrow: { fontSize: 11, fontWeight: "700", marginRight: 4 },
  delta: { fontSize: 12, fontWeight: "600" },
});
