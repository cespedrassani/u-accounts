import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface MetadataSectionProps {
  createdAt: string;
  updatedAt: string;
}

export const MetadataSection = ({ createdAt, updatedAt }: MetadataSectionProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.text}>Criado em: {formatDate(createdAt)}</Text>
      </View>
      <View style={styles.item}>
        <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.text}>Atualizado em: {formatDate(updatedAt)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
});
