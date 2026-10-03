import { Platform } from "react-native";

export const colors = {
  bg: "#F3F5F7",
  card: "#FFFFFF",
  ink: "#12212F",
  muted: "#5E6D7B",
  line: "#DDE3E9",
  accent: "#0F6E73",
  accentSoft: "#D9ECEC",
  warn: "#B4540A",
  warnSoft: "#F8E6D4",
  onInkSoft: "#9FE0DC",
};

export const fonts = {
  serif: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia" }) as string,
};

export const radius = { card: 16, hero: 20, pill: 999 };
