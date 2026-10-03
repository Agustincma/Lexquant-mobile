import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const screens: { name: string; title: string; icon: IconName }[] = [
  { name: "index", title: "Resumen", icon: "grid-outline" },
  { name: "volumen", title: "Volumen", icon: "bar-chart-outline" },
  { name: "costos", title: "Costos", icon: "cash-outline" },
  { name: "jurisdicciones", title: "Jurisdicc.", icon: "location-outline" },
  { name: "personas", title: "Personas", icon: "people-outline" },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10.5 },
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line },
      }}
    >
      {screens.map((s) => (
        <Tabs.Screen
          key={s.name}
          name={s.name}
          options={{
            title: s.title,
            tabBarIcon: ({ color, size }) => <Ionicons name={s.icon} size={size} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
