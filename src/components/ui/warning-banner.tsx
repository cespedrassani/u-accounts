import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface WarningBannerProps {
  message: string;
  visible: boolean;
  animatedOpacity: Animated.Value;
  animatedTranslateY: Animated.Value;
}

export const WarningBanner = ({
  message,
  visible,
  animatedOpacity,
  animatedTranslateY,
}: WarningBannerProps) => {
  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          opacity: animatedOpacity,
          transform: [{ translateY: animatedTranslateY }],
        },
      ]}
    >
      <Ionicons name="warning" size={20} color={Colors.warning} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E5',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#B45309',
    marginLeft: 12,
    lineHeight: 20,
  },
});
