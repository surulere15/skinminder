import React from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { hapticLight } from "../../lib/haptics";

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  style?: ViewStyle;
}

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight, threshold = 100, style }: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotation.value = event.translationX * 0.05;
    })
    .onEnd((event) => {
      if (event.translationX > threshold) {
        translateX.value = withTiming(400, { duration: 300, easing: Easing.out(Easing.cubic) });
        opacity.value = withTiming(0, { duration: 300 });
        if (onSwipeRight) runOnJS(onSwipeRight)();
      } else if (event.translationX < -threshold) {
        translateX.value = withTiming(-400, { duration: 300, easing: Easing.out(Easing.cubic) });
        opacity.value = withTiming(0, { duration: 300 });
        if (onSwipeLeft) runOnJS(onSwipeLeft)();
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        rotation.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    })
    .onStart(() => {
      runOnJS(hapticLight)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

interface LongPressScaleProps {
  children: React.ReactNode;
  onLongPress?: () => void;
  scaleTo?: number;
  style?: ViewStyle;
}

export function LongPressScale({ children, onLongPress, scaleTo = 0.95, style }: LongPressScaleProps) {
  const scale = useSharedValue(1);

  const gesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      scale.value = withSpring(scaleTo, { damping: 12, stiffness: 100 });
      if (onLongPress) runOnJS(onLongPress)();
    })
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

interface PullDownProps {
  children: React.ReactNode;
  onPullDown: () => void;
  style?: ViewStyle;
}

export function PullDown({ children, onPullDown, style }: PullDownProps) {
  const translateY = useSharedValue(0);
  const isPulling = useSharedValue(false);

  const gesture = Gesture.Pan()
    .activeOffsetY([0, 100])
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY * 0.5;
        if (event.translationY > 80 && !isPulling.value) {
          isPulling.value = true;
          runOnJS(onPullDown)();
        }
      }
    })
    .onEnd(() => {
      translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
      isPulling.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
