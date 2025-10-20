import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: React.ReactNode;
}

export const Header = ({ title, onBack, rightAction }: HeaderProps) => {
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [headerOpacity]);

  return (
    <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={28} color={Colors.icon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {rightAction ? (
        rightAction
      ) : (
        <View style={styles.placeholder} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textHeader,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
});
