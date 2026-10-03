import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors, radius } from "@/theme";

interface Props {
  options: string[];
  selected: string;
  onSelect: (o: string) => void;
}

export function FilterChips({ options, selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wrap}>
      {options.map((o) => {
        const on = o === selected;
        return (
          <Pressable key={o} onPress={() => onSelect(o)} style={[styles.chip, on && styles.on]}>
            <Text style={[styles.text, on && styles.textOn]}>{o}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, paddingBottom: 12 },
  chip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  on: { backgroundColor: colors.ink, borderColor: colors.ink },
  text: { fontSize: 12.5, fontWeight: "500", color: colors.ink },
  textOn: { color: "#fff" },
});
