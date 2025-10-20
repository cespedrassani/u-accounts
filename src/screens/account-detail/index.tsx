import { ChildAccountCard } from '@/components/child-account-card';
import { TypeBadge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Header } from '@/components/ui/header';
import { InfoCard } from '@/components/ui/info-card';
import { MetadataSection } from '@/components/ui/metadata-section';
import { getAccountTypeLabel } from '@/constants/account-types';
import { commonStyles } from '@/constants/common-styles';
import { Colors, getTypeColor } from '@/constants/theme';
import { useAccounts } from '@/contexts/accounts.context';
import { Account } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const AccountDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { accounts, getAccountById, canHaveMoreChildren } = useAccounts();
  const [account, setAccount] = useState<Account | null>(null);

  const contentPosition = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      const acc = getAccountById(params.id);
      setAccount(acc || null);
    }
  }, [params.id, getAccountById]);

  useEffect(() => {
    Animated.spring(contentPosition, {
      toValue: 0,
      tension: 50,
      friction: 8,
      delay: 50,
      useNativeDriver: true,
    }).start();
  }, [contentPosition]);

  const parentAccount = useMemo(() => {
    if (!account?.parentId) return null;
    return accounts.find((acc) => acc.id === account.parentId);
  }, [account, accounts]);

  const childrenAccounts = useMemo(() => {
    if (!account) return [];
    return accounts.filter((acc) => acc.parentId === account.id);
  }, [account, accounts]);

  if (!account) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Header title="Detalhes da Conta" onBack={() => router.back()} />
        <View style={styles.errorContainer}>
          <EmptyState icon="alert-circle-outline" message="Conta não encontrada" iconSize={64} />
          <TouchableOpacity style={styles.backButtonError} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const typeLabel = getAccountTypeLabel(account.type);
  const typeColor = getTypeColor(account.type);
  const acceptsEntriesLabel = account.acceptsEntries ? 'Sim' : 'Não';

  const AddChildButton = canHaveMoreChildren(account) ? (
    <TouchableOpacity
      style={styles.addChildButton}
      onPress={() => router.push(`/account-form?parentId=${account.id}`)}
    >
      <Ionicons name="add" size={28} color={Colors.icon} />
    </TouchableOpacity>
  ) : undefined;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Header title="Detalhes da Conta" onBack={() => router.back()} rightAction={AddChildButton} />

      <Animated.View
        style={[
          commonStyles.roundedTopContainer,
          {
            transform: [{ translateY: contentPosition }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.accountHeader}>
            <TypeBadge type={account.type} size="medium" />
            <Text style={styles.accountName}>{account.name}</Text>
          </View>

          <View style={styles.section}>
            <InfoCard
              icon={!parentAccount?.code ? "file-tray-outline" : "file-tray-stacked-outline"}
              label="Código"
              value={account.code}
              color={Colors.background}
              delay={200}
            />

            <InfoCard
              icon={account.type === 'receipt' ? 'trending-up' : 'trending-down'}
              label="Tipo"
              value={typeLabel}
              color={typeColor}
              delay={250}
            />

            <InfoCard
              icon={account.acceptsEntries ? 'checkmark-circle' : 'close-circle'}
              label="Aceita Lançamentos"
              value={acceptsEntriesLabel}
              color={account.acceptsEntries ? Colors.success : Colors.textSecondary}
              delay={300}
            />

            {parentAccount && (
              <InfoCard
                icon="file-tray-outline"
                label="Conta Pai"
                value={`${parentAccount.code} - ${parentAccount.name}`}
                color={Colors.background}
                delay={350}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Contas Filhas {childrenAccounts.length > 0 && `(${childrenAccounts.length})`}
            </Text>
            {childrenAccounts.length > 0 ? (
              childrenAccounts.map((child, index) => (
                <ChildAccountCard key={child.id} account={child} delay={400 + index * 50} />
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <EmptyState icon="close-circle-outline" message="Esta conta não possui contas filhas" />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <MetadataSection createdAt={account.createdAt} updatedAt={account.updatedAt} />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  addChildButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  accountHeader: {
    marginBottom: 15,
  },
  accountName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyStateContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  backButtonError: {
    backgroundColor: Colors.background,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textHeader,
  },
});
