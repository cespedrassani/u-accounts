import { Colors } from '@/constants/theme';
import { spring } from '@/utils/animations';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  delay?: number;
}

export const SearchBar = ({ value, onChangeText, placeholder = 'Pesquisar', delay = 0 }: SearchBarProps) => {
  const searchPosition = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    spring(searchPosition, 0, 50, 8, delay).start();
  }, [searchPosition, delay]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: searchPosition }],
        },
      ]}
    >
      <View style={styles.inputWrapper}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.input,
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
});
