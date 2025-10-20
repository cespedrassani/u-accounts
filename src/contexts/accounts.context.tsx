import { accountService } from '@/services/account.service';
import { Account, CodeSuggestion, CreateAccountDTO, ServiceResult } from '@/types';
import { canHaveMoreChildren } from '@/utils/account-code.utils';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AccountsContextData {
  accounts: Account[];
  loading: boolean;
  refreshAccounts: () => Promise<void>;
  saveAccount: (dto: CreateAccountDTO) => Promise<ServiceResult<Account>>;
  deleteAccount: (accountId: string) => Promise<ServiceResult>;
  getAccountById: (accountId: string) => Account | undefined;
  suggestCode: (parentId?: string) => Promise<CodeSuggestion>;
  canHaveMoreChildren: (account: Account) => boolean;
}

const AccountsContext = createContext<AccountsContextData>({} as AccountsContextData);

export function AccountsProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const loadedAccounts = await accountService.getAllAccounts();
      setAccounts(loadedAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAccounts();
  }, [refreshAccounts]);

  const saveAccount = useCallback(async (dto: CreateAccountDTO) => {
    const result = await accountService.saveAccount(dto);

    if (result.success) {
      await refreshAccounts();
    }

    return result;
  }, [refreshAccounts]);

  const deleteAccount = useCallback(async (accountId: string) => {
    const result = await accountService.deleteAccount(accountId);

    if (result.success) {
      await refreshAccounts();
    }

    return result;
  }, [refreshAccounts]);

  const getAccountById = useCallback((accountId: string) => {
    return accounts.find((acc) => acc.id === accountId);
  }, [accounts]);

  const suggestCode = useCallback(async (parentId?: string) => {
    return await accountService.suggestCode(parentId);
  }, []);

  const checkCanHaveMoreChildren = useCallback((account: Account) => {
    return canHaveMoreChildren(account, accounts);
  }, [accounts]);

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        loading,
        refreshAccounts,
        saveAccount,
        deleteAccount,
        getAccountById,
        suggestCode,
        canHaveMoreChildren: checkCanHaveMoreChildren,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountsContext);

  if (!context) {
    throw new Error('useAccounts must be used within an AccountsProvider');
  }

  return context;
}
