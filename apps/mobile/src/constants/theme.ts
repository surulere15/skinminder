export const COLORS = {
  background: "#000000",
  backgroundSecondary: "#0a0a0a",
  surface: "#111111",
  surfaceElevated: "#1a1a1a",
  surfaceCard: "rgba(255, 255, 255, 0.04)",
  surfaceCardHover: "rgba(255, 255, 255, 0.06)",
  border: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.12)",
  borderFocus: "rgba(161, 139, 111, 0.5)",

  primary: "#c9a96e",
  primaryLight: "#dfc08a",
  primaryDark: "#a08050",
  primaryGlow: "rgba(201, 169, 110, 0.15)",
  primarySubtle: "rgba(201, 169, 110, 0.08)",

  text: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textTertiary: "rgba(255, 255, 255, 0.5)",
  textQuaternary: "rgba(255, 255, 255, 0.3)",
  textInverse: "#000000",

  success: "#34d399",
  successSubtle: "rgba(52, 211, 153, 0.1)",
  warning: "#fbbf24",
  warningSubtle: "rgba(251, 191, 36, 0.1)",
  error: "#f87171",
  errorSubtle: "rgba(248, 113, 113, 0.1)",
  info: "#60a5fa",
  infoSubtle: "rgba(96, 165, 250, 0.1)",

  scores: {
    hydration: "#60a5fa",
    texture: "#34d399",
    pigment: "#fbbf24",
    pores: "#c084fc",
    sensitivity: "#f87171",
    firmness: "#2dd4bf",
    overall: "#c9a96e",
  },

  gradients: {
    primary: ["#c9a96e", "#a08050"],
    warm: ["#f59e0b", "#c9a96e"],
    cool: ["#60a5fa", "#2dd4bf"],
    success: ["#34d399", "#60a5fa"],
    sunset: ["#f472b6", "#fbbf24"],
  },

  glass: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "rgba(255, 255, 255, 0.06)",
    highlight: "rgba(255, 255, 255, 0.02)",
  },
};

export const TYPOGRAPHY = {
  display: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "600" as const,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "400" as const,
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "400" as const,
  },
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "400" as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: "#c9a96e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
};
