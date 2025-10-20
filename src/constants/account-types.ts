import { AccountType } from '@/types';

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  receipt: 'Receita',
  expense: 'Despesa',
};

export const ACCOUNT_TYPE_OPTIONS = [
  { label: 'Receita', value: 'receipt' as AccountType },
  { label: 'Despesa', value: 'expense' as AccountType },
];

export const getAccountTypeLabel = (type: AccountType): string => {
  return ACCOUNT_TYPE_LABELS[type];
};
