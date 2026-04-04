import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Circle, Rect, LinearGradient } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "../../constants/theme";

interface GradientOrbProps {
  color: string;
  size: number;
  x: number;
  y: number;
  opacity?: number;
  animated?: boolean;
}

export function GradientOrb({ color, size, x, y, opacity = 0.15, animated = true }: GradientOrbProps) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (animated) {
      scale.value = withRepeat(
        withTiming(1.2, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id={`orb-${color.replace("#", "")}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={opacity} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#orb-${color.replace("#", "")})`} />
      </Svg>
    </Animated.View>
  );
}

interface AmbientBackgroundProps {
  children: React.ReactNode;
}

export function AmbientBackground({ children }: AmbientBackgroundProps) {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <GradientOrb color={COLORS.primary} size={300} x={-50} y={-100} opacity={0.08} />
        <GradientOrb color={COLORS.scores.hydration} size={250} x={350} y={200} opacity={0.05} />
        <GradientOrb color={COLORS.scores.pigment} size={200} x={-30} y={600} opacity={0.06} />
      </View>
      {children}
    </View>
  );
}

interface GradientLineProps {
  color?: string;
  height?: number;
  animated?: boolean;
}

export function GradientLine({ color = COLORS.primary, height = 1, animated = false }: GradientLineProps) {
  const opacity = useSharedValue(animated ? 0.3 : 1);

  React.useEffect(() => {
    if (animated) {
      opacity.value = withRepeat(
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ height, backgroundColor: color, borderRadius: height / 2 }, animatedStyle]} />
  );
}

interface ShimmerProps {
  width: number;
  height: number;
  borderRadius?: number;
}

export function Shimmer({ width, height, borderRadius = 0 }: ShimmerProps) {
  const translateX = useSharedValue(-width);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width * 2, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ width, height, borderRadius, overflow: "hidden", backgroundColor: COLORS.surfaceCard }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            width: width / 2,
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.08)",
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

interface GlowButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  color?: string;
}

export function GlowButton({ children, onPress, color = COLORS.primary }: GlowButtonProps) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 100 });
    glowOpacity.value = withTiming(0.5, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 200 });
    glowOpacity.value = withTiming(0.3, { duration: 200 });
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[containerStyle, { shadowColor: color, shadowOffset: { width: 0, height: 0 }, shadowRadius: 20, elevation: 5 }, glowStyle]}>
      <TouchableOpacity
        className="rounded-[16px] items-center justify-center"
        style={{ backgroundColor: color, height: 56, paddingHorizontal: 24 }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
