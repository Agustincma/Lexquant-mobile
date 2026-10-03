import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";

export function BarRow({ label, pct }: { label: string; pct: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.pct}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 8 },
  label: { width: 98, fontSize: 12.5, color: colors.ink, fontWeight: "500" },
  track: { flex: 1, height: 9, borderRadius: 999, backgroundColor: colors.accentSoft, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.accent, borderRadius: 999 },
  pct: { width: 36, textAlign: "right", fontSize: 12.5, fontWeight: "600", color: colors.ink },
});
