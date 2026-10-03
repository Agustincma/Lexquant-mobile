import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/theme";

export function ComingSoon({ title }: { title: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>Esta pantalla todavía no está implementada.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontFamily: fonts.serif, fontSize: 24, fontWeight: "600", color: colors.ink },
  text: { marginTop: 6, fontSize: 14, color: colors.muted, textAlign: "center" },
});
