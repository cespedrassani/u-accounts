import { Colors, getTypeColor } from '@/constants/theme';
import { Account } from '@/types';
import { fadeIn, slideUp } from '@/utils/animations';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface ChildAccountCardProps {
  account: Account;
  delay?: number;
}

export const ChildAccountCard = ({ account, delay = 0 }: ChildAccountCardProps) => {
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      fadeIn(cardOpacity, 300, delay),
      slideUp(cardTranslate, 0, 300, delay),
    ]).start();
  }, [delay, cardOpacity, cardTranslate]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: cardOpacity,
          transform: [{ translateY: cardTranslate }],
        },
      ]}
    >
      <View style={styles.header}>
        <Ionicons
          name="file-tray-stacked-outline"
          size={16}
          color={getTypeColor(account.type)}
        />
        <Text style={styles.code}>{account.code}</Text>
      </View>
      <Text style={styles.name}>{account.name}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  code: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
    marginLeft: 8,
  },
  name: {
    fontSize: 16,
    color: Colors.text,
  },
});
