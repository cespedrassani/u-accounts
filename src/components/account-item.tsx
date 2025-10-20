import { Colors, getTypeColor } from '@/constants/theme';
import { Account } from '@/types';
import { fadeIn, spring } from '@/utils/animations';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AccountItemProps {
  account: Account;
  index: number;
  animationCompleted: boolean;
  onDelete: (account: Account) => void;
  onPress: (account: Account) => void;
}

export const AccountItem = ({ account, index, animationCompleted, onDelete, onPress }: AccountItemProps) => {
  const textColor = getTypeColor(account.type);
  const itemOpacity = useRef(new Animated.Value(0)).current;
  const itemTranslate = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    if (animationCompleted) {
      const delay = index * 30;
      Animated.parallel([
        fadeIn(itemOpacity, 200, delay),
        spring(itemTranslate, 0, 70, 7, delay),
      ]).start();
    }
  }, [animationCompleted, index, itemOpacity, itemTranslate]);

  return (
    <Animated.View
      style={{
        opacity: itemOpacity,
        transform: [{ translateY: itemTranslate }],
      }}
    >
      <TouchableOpacity style={styles.card} onPress={() => onPress(account)} activeOpacity={0.7}>
        <View style={styles.info}>
          <Text style={[styles.text, { color: textColor }]}>
            {account.code} - {account.name}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete(account);
          }}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.iconSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
});
