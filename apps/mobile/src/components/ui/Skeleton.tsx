import React from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeInDown,
} from "react-native-reanimated";
import { COLORS, RADIUS } from "../../constants/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = RADIUS.sm, style }: SkeletonProps) {
  const opacity = useSharedValue(0.4);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: COLORS.surfaceDisabled,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      className="rounded-[22px] p-6 mb-5"
      style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}
    >
      <Skeleton width={120} height={14} className="mb-4" />
      <Skeleton width="100%" height={48} className="mb-3" />
      <Skeleton width="80%" height={12} />
    </Animated.View>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View className="gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          entering={FadeInDown.delay(i * 80).duration(400)}
          className="rounded-[22px] p-5 flex-row items-center gap-4"
          style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}
        >
          <Skeleton width={44} height={44} borderRadius={RADIUS.md} />
          <View className="flex-1 gap-2">
            <Skeleton width="70%" height={16} />
            <Skeleton width="50%" height={12} />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

export function StatGridSkeleton() {
  return (
    <View className="flex-row gap-3 mb-5">
      {[1, 2].map((i) => (
        <View key={i} className="flex-1 rounded-[22px] p-5" style={{ backgroundColor: COLORS.surfaceCard, borderColor: COLORS.border, borderWidth: 1 }}>
          <Skeleton width={80} height={12} className="mb-3" />
          <Skeleton width={60} height={28} className="mb-2" />
          <Skeleton width={40} height={10} />
        </View>
      ))}
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View className="items-center mb-6">
      <Skeleton width={80} height={80} borderRadius={24} className="mb-4" />
      <Skeleton width={140} height={20} className="mb-2" />
      <Skeleton width={180} height={14} />
    </View>
  );
}

export function FullScreenSkeleton() {
  return (
    <View className="flex-1 bg-bg px-6 pt-16">
      <Skeleton width={140} height={28} className="mb-8" />
      <StatGridSkeleton />
      <CardSkeleton />
      <ListSkeleton count={3} />
    </View>
  );
}
