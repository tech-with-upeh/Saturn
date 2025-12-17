import { useColorScheme } from "react-native";

export const COLORS = {
  light: {
    primary: "#ac71ff",
    background: "#ffffff",
    text: "#000000",
    card: "#F5F5F5",
    border: "#e0e0e0",
    tint: "#a58bd1",
    txtsec: "#4b5563",
    cardTint: "#e5e7eb",
  },
  dark: {
    primary: "#9C27B0",
    background: "#000000",
    text: "#ffffff",
    card: "#1a1a1a",
    border: "#333333",
    tint: "#caa8ff",
    txtsec: "#e5e7eb",
    cardTint: "#e5e7eb",
  },
};

export type ThemeType = keyof typeof COLORS;
export type ThemeColors = typeof COLORS.light;

export const useThemeColors = (): ThemeColors => {
  const scheme = useColorScheme();
  return COLORS[scheme ?? "light"];
};

export const useIsDarkMode = (): boolean => {
  const scheme = useColorScheme();
  return scheme === "dark";
};
