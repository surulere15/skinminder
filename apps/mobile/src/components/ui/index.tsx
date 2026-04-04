import { View, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from "react-native";
import { COLORS, RADIUS, SHADOWS } from "../../constants/theme";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ label, onPress, variant = "primary", loading, disabled }: ButtonProps) {
  const variants: Record<string, ViewStyle> = {
    primary: { backgroundColor: COLORS.primary },
    secondary: { backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 },
    ghost: { backgroundColor: "transparent" },
  };

  const textColors: Record<string, string> = {
    primary: COLORS.textInverse,
    secondary: COLORS.textSecondary,
    ghost: COLORS.primary,
  };

  return (
    <TouchableOpacity
      style={{ ...variants[variant], borderRadius: RADIUS.lg, height: 56, alignItems: "center", justifyContent: "center", opacity: disabled ? 0.5 : 1 }}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text style={{ color: textColors[variant], fontWeight: "600", fontSize: 17 }}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
}

export function Card({ children, onPress }: CardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={{
        backgroundColor: COLORS.surfaceCard,
        borderRadius: RADIUS.xl,
        padding: 20,
        borderColor: COLORS.border,
        borderWidth: 1,
      }}
      onPress={onPress}
    >
      {children}
    </Wrapper>
  );
}

interface ScoreDisplayProps {
  label: string;
  score: number;
  color: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreDisplay({ label, score, color, size = "md" }: ScoreDisplayProps) {
  const sizes: Record<string, { container: number; text: number }> = {
    sm: { container: 40, text: 14 },
    md: { container: 56, text: 20 },
    lg: { container: 96, text: 36 },
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: sizes[size].container,
          height: sizes[size].container,
          borderRadius: sizes[size].container / 2,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${color}12`,
        }}
      >
        <Text style={{ fontSize: sizes[size].text, fontWeight: "700", color }}>{score}</Text>
      </View>
      <Text style={{ fontSize: 11, color: COLORS.textQuaternary, marginTop: 8 }}>{label}</Text>
    </View>
  );
}
