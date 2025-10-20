import { Colors } from '@/constants/theme';
import { AccountType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
  type: AccountType;
  size?: 'small' | 'medium' | 'large';
}

export const TypeBadge = ({ type, size = 'medium' }: BadgeProps) => {
  const isReceipt = type === 'receipt';
  const color = isReceipt ? Colors.receipt : Colors.expense;
  const label = isReceipt ? 'Receita' : 'Despesa';
  const icon = isReceipt ? 'arrow-down-circle' : 'arrow-up-circle';

  const sizeStyles = {
    small: {
      padding: 6,
      fontSize: 12,
      iconSize: 16,
    },
    medium: {
      padding: 8,
      fontSize: 14,
      iconSize: 20,
    },
    large: {
      padding: 10,
      fontSize: 16,
      iconSize: 24,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: `${color}20`, paddingHorizontal: currentSize.padding * 2, paddingVertical: currentSize.padding },
      ]}
    >
      <Ionicons name={icon} size={currentSize.iconSize} color={color} />
      <Text style={[styles.badgeText, { color, marginLeft: currentSize.padding, fontSize: currentSize.fontSize }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontWeight: '600',
  },
});
