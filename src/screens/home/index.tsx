import { AccountItem } from '@/components/account-item';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { EmptyState } from '@/components/ui/empty-state';
import { SearchBar } from '@/components/ui/search-bar';
import { commonStyles } from '@/constants/common-styles';
import { Colors } from '@/constants/theme';
import { useAccounts } from '@/contexts/accounts.context';
import { Account } from '@/types';
import { spring } from '@/utils/animations';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Home = () => {
  const router = useRouter();
  const { accounts, loading, deleteAccount } = useAccounts();
  const [searchQuery, setSearchQuery] = useState('');
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const headerPosition = useRef(new Animated.Value(-200)).current;
  const listPosition = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const filteredAccounts = useMemo(() => {
    if (!searchQuery.trim()) {
      return accounts;
    }

    const query = searchQuery.toLowerCase();
    return accounts.filter(
      (account) => account.code.toLowerCase().includes(query) || account.name.toLowerCase().includes(query)
    );
  }, [accounts, searchQuery]);

  useEffect(() => {
    Animated.parallel([
      spring(headerPosition, 0, 50, 8, 50),
      Animated.timing(listPosition, {
        toValue: 0,
        duration: 400,
        delay: 0,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setAnimationCompleted(true);
    }, 300);
  }, [headerPosition, listPosition]);

  const renderAccountItem = ({ item, index }: { item: Account; index: number }) => (
    <AccountItem
      account={item}
      index={index}
      animationCompleted={animationCompleted}
      onDelete={handleDeletePress}
      onPress={handleAccountPress}
    />
  );

  const handleAccountPress = (account: Account) => {
    router.push(`/account-detail?id=${account.id}`);
  };

  const handleDeletePress = (account: Account) => {
    setSelectedAccount(account);
    setDeleteModalVisible(true);
  };

  const handleCloseModal = () => {
    setDeleteModalVisible(false);
    setTimeout(() => {
      setSelectedAccount(null);
    }, 200);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAccount) return;

    const result = await deleteAccount(selectedAccount.id);

    if (result.success) {
      handleCloseModal();
    } else {
      alert(result.errors.join('\n'));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerPosition }],
          },
        ]}
      >
        <Text style={styles.headerTitle}>Plano de Contas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/account-form')}>
          <Ionicons name="add" size={28} color={Colors.icon} />
        </TouchableOpacity>
      </Animated.View>

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Pesquisar conta" delay={100} />

      <Animated.View
        style={[
          commonStyles.roundedTopContainer,
          {
            transform: [{ translateY: listPosition }],
          },
        ]}
      >
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Listagem</Text>
          <Text style={styles.listCount}>{filteredAccounts.length} registros</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.background} />
          </View>
        ) : (
          <FlatList
            data={filteredAccounts}
            renderItem={renderAccountItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <EmptyState icon="search-outline" message="Nenhuma conta encontrada" />
              </View>
            }
          />
        )}
      </Animated.View>

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Deseja excluir a conta"
        subtitle={selectedAccount ? `${selectedAccount.code} - ${selectedAccount.name}?` : ''}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textHeader,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  listCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    paddingVertical: 20,
  },
});
