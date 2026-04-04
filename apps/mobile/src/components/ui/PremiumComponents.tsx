import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { COLORS, RADIUS, SHADOWS, TYPOGRAPHY } from "../../constants/theme";
import { hapticLight } from "../../lib/haptics";

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  delay?: number;
  variant?: "default" | "glass" | "highlight" | "gradient";
  style?: ViewStyle;
}

export function AnimatedCard({ children, onPress, delay = 0, variant = "default", style }: AnimatedCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.97);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
    hapticLight();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: COLORS.surfaceCard,
      borderColor: COLORS.border,
    },
    glass: {
      backgroundColor: COLORS.glass.background,
      borderColor: COLORS.glass.border,
    },
    highlight: {
      backgroundColor: COLORS.primarySubtle,
      borderColor: COLORS.borderFocus,
    },
    gradient: {
      backgroundColor: "rgba(201, 169, 110, 0.08)",
      borderColor: "rgba(201, 169, 110, 0.2)",
    },
  };

  const CardWrapper = onPress ? AnimatedTouchableOpacity : AnimatedView;

  return (
    <CardWrapper
      style={[
        {
          borderRadius: RADIUS.lg,
          borderWidth: 1,
          padding: 20,
          ...SHADOWS.card,
        },
        variantStyles[variant],
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
    >
      {children}
    </CardWrapper>
  );
}

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  animated?: boolean;
  delay?: number;
}

export function ProgressBar({ progress, color = COLORS.primary, height = 4, animated = true, delay = 0 }: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      width.value = withDelay(delay, withTiming(progress, { duration: 1000, easing: Easing.out(Easing.cubic) }));
    } else {
      width.value = progress;
    }
  }, [progress]);

  const animatedWidth = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <Animated.View
        style={[
          {
            height: "100%",
            borderRadius: height / 2,
            backgroundColor: color,
          },
          animatedWidth,
        ]}
      />
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon?: string;
  delay?: number;
}

export function StatCard({ label, value, trend, icon, delay = 0 }: StatCardProps) {
  return (
    <AnimatedCard delay={delay} variant="glass">
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: COLORS.textTertiary, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>
            {label}
          </Text>
          <Text style={{ fontSize: 28, fontWeight: "700", color: COLORS.text, letterSpacing: -0.5 }}>
            {value}
          </Text>
          {trend !== undefined && (
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: trend >= 0 ? COLORS.success : COLORS.error,
                }}
              >
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textQuaternary, marginLeft: 4 }}>vs last week</Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedCard>
  );
}

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
