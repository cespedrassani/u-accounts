import { Animated } from 'react-native';

export const fadeIn = (
  value: Animated.Value,
  duration: number = 300,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    delay,
    useNativeDriver: true,
  });
};

export const fadeOut = (
  value: Animated.Value,
  duration: number = 300,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    delay,
    useNativeDriver: true,
  });
};

export const slideUp = (
  value: Animated.Value,
  toValue: number = 0,
  duration: number = 300,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue,
    duration,
    delay,
    useNativeDriver: true,
  });
};

export const spring = (
  value: Animated.Value,
  toValue: number = 1,
  tension: number = 50,
  friction: number = 7,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.spring(value, {
    toValue,
    tension,
    friction,
    delay,
    useNativeDriver: true,
  });
};

export const animateField = (
  opacity: Animated.Value,
  translateY: Animated.Value,
  delay: number = 0
): void => {
  Animated.parallel([
    fadeIn(opacity, 300, delay),
    slideUp(translateY, 0, 300, delay),
  ]).start();
};

export const animateFormContainer = (
  scale: Animated.Value,
  opacity: Animated.Value,
  delay: number = 100
): void => {
  Animated.parallel([
    spring(scale, 1, 50, 7, delay),
    fadeIn(opacity, 250, delay),
  ]).start();
};
