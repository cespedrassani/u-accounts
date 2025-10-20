import { getAccountTypeLabel } from '@/constants/account-types';
import { CODE_LIMITS } from '@/constants/values';
import { Account, CreateAccountDTO, ValidationError } from '@/types';
import { codeExists, findMaxChild, hasChildren, isDirectChild, parseCode } from './account-code.utils';

export function validateAccountCreation(
  dto: CreateAccountDTO,
  allAccounts: Account[],
  excludeAccountId?: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!dto.name || dto.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Nome é obrigatório',
    });
  }

  if (!dto.code || dto.code.trim() === '') {
    errors.push({
      field: 'code',
      message: 'Código é obrigatório',
    });
  }

  const accountsToCheck = excludeAccountId
    ? allAccounts.filter((acc) => acc.id !== excludeAccountId)
    : allAccounts;

  if (codeExists(dto.code, accountsToCheck)) {
    errors.push({
      field: 'code',
      message: 'Este código já está em uso',
    });
  }

  if (dto.parentId) {
    const parent = allAccounts.find((acc) => acc.id === dto.parentId);

    if (!parent) {
      errors.push({
        field: 'parentId',
        message: 'Conta pai não encontrada',
      });
    } else {
      if (dto.type !== parent.type) {
        errors.push({
          field: 'type',
          message: `A conta deve ser do tipo "${getAccountTypeLabel(parent.type)}" como sua conta pai`,
        });
      }

      if (parent.acceptsEntries) {
        errors.push({
          field: 'parentId',
          message: 'Não é possível criar uma conta filha de uma conta que aceita lançamentos',
        });
      }

      if (!isDirectChild(dto.code, parent.code)) {
        errors.push({
          field: 'code',
          message: 'Código não disponível',
        });
      }

      const maxChild = findMaxChild(parent.code, allAccounts);
      if (maxChild) {
        const maxChildSegments = parseCode(maxChild.code);
        const lastSegment = maxChildSegments[maxChildSegments.length - 1];

        if (lastSegment === CODE_LIMITS.MAX_SEGMENT_VALUE) {
          const newCodeSegments = parseCode(dto.code);
          const newLastSegment = newCodeSegments[newCodeSegments.length - 1];

          if (newLastSegment > CODE_LIMITS.MAX_SEGMENT_VALUE) {
            errors.push({
              field: 'code',
              message: `A conta pai "${parent.code}" já atingiu o limite máximo de ${CODE_LIMITS.MAX_SEGMENT_VALUE} filhos. Selecione outro pai.`,
            });
          }
        }
      }
    }
  }

  return errors;
}

export function validateAccountDeletion(
  accountCode: string,
  allAccounts: Account[]
): ValidationError | null {
  if (hasChildren(accountCode, allAccounts)) {
    return {
      field: 'accountCode',
      message: 'Não é possível excluir uma conta que possui contas filhas',
    };
  }

  return null;
}
