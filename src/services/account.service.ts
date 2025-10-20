import { Account, CreateAccountDTO, ServiceResult } from '@/types';
import { suggestNextCode } from '@/utils/account-code.utils';
import { validateAccountCreation, validateAccountDeletion } from '@/utils/account-validation.utils';
import { STORAGE_KEYS, storageService } from './storage.service';

class AccountService {
  async getAllAccounts(): Promise<Account[]> {
    const accounts = await storageService.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS);
    return accounts || [];
  }

  async saveAccount(dto: CreateAccountDTO): Promise<ServiceResult<Account>> {
    try {
      const allAccounts = await this.getAllAccounts();

      const validationErrors = validateAccountCreation(dto, allAccounts);

      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors.map((e) => e.message),
          fieldErrors: validationErrors,
        };
      }

      const newAccount: Account = {
        id: this.generateId(),
        code: dto.code,
        name: dto.name,
        type: dto.type,
        acceptsEntries: dto.acceptsEntries,
        parentId: dto.parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedAccounts = [...allAccounts, newAccount];

      await storageService.setItem(STORAGE_KEYS.ACCOUNTS, updatedAccounts);

      return {
        success: true,
        data: newAccount,
      };
    } catch (error) {
      console.error('Error saving account:', error);
      return {
        success: false,
        errors: ['Erro ao salvar conta. Tente novamente.'],
      };
    }
  }

  async deleteAccount(accountId: string): Promise<ServiceResult> {
    try {
      const allAccounts = await this.getAllAccounts();
      const account = allAccounts.find((acc) => acc.id === accountId);

      if (!account) {
        return {
          success: false,
          errors: ['Conta não encontrada'],
        };
      }

      const validationError = validateAccountDeletion(account.code, allAccounts);

      if (validationError) {
        return {
          success: false,
          errors: [validationError.message],
        };
      }

      const updatedAccounts = allAccounts.filter((acc) => acc.id !== accountId);

      await storageService.setItem(STORAGE_KEYS.ACCOUNTS, updatedAccounts);

      return { success: true, data: undefined };
    } catch (error) {
      console.error('Error deleting account:', error);
      return {
        success: false,
        errors: ['Erro ao excluir conta. Tente novamente.'],
      };
    }
  }

  async suggestCode(parentId?: string) {
    const allAccounts = await this.getAllAccounts();
    return suggestNextCode(parentId, allAccounts);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const accountService = new AccountService();
