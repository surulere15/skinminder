import React, { useCallback } from "react";
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "../../constants/theme";

interface PremiumScrollViewProps extends ScrollViewProps {
  refreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
}

export function PremiumScrollView({ refreshing, onRefresh, children, ...props }: PremiumScrollViewProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing || false}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            progressBackgroundColor={COLORS.surfaceCard}
          />
        ) : undefined
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
}

interface AnimatedNumberProps {
  value: number;
  style?: any;
  prefix?: string;
  suffix?: string;
}

export function AnimatedNumber({ value, style, prefix, suffix }: AnimatedNumberProps) {
  const animatedValue = useSharedValue(0);

  React.useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 300 }),
  }));

  return (
    <Animated.Text style={[style, animatedStyle]}>
      {prefix}
      {Math.round(animatedValue.value)}
      {suffix}
    </Animated.Text>
  );
}

interface StaggeredListProps {
  items: React.ReactNode[];
  delay?: number;
  stagger?: number;
}

export function StaggeredList({ items, delay = 100, stagger = 60 }: StaggeredListProps) {
  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </>
  );
}
