import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
}

export function Button({ label, onPress, variant = "primary", loading, disabled, icon }: ButtonProps) {
  const variants = {
    primary: "bg-primary-500",
    secondary: "bg-surface-card border border-surface-border",
    ghost: "bg-transparent",
  };

  const textVariants = {
    primary: "text-surface",
    secondary: "text-gray-300",
    ghost: "text-primary-500",
  };

  return (
    <TouchableOpacity
      className={`${variants[variant]} rounded-xl py-4 items-center ${disabled ? "opacity-50" : ""}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#0A0A0A" : "#a18b6f"} />
      ) : (
        <Text className={`${textVariants[variant]} font-semibold text-lg`}>{label}</Text>
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
      className="bg-surface-card rounded-2xl p-5 border border-surface-border"
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
  const sizes = {
    sm: { container: "w-10 h-10", text: "text-sm" },
    md: { container: "w-14 h-14", text: "text-xl" },
    lg: { container: "w-24 h-24", text: "text-3xl" },
  };

  return (
    <View className="items-center">
      <View
        className={`${sizes[size].container} rounded-full items-center justify-center`}
        style={{ backgroundColor: `${color}20` }}
      >
        <Text className={`${sizes[size].text} font-bold`} style={{ color }}>
          {score}
        </Text>
      </View>
      <Text className="text-gray-500 text-xs mt-1">{label}</Text>
    </View>
  );
}
