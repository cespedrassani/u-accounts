import { CODE_LIMITS } from '@/constants/values';
import { Account, CodeSuggestion } from '@/types';

export function parseCode(code: string): number[] {
  return code.split('.').map((segment) => parseInt(segment, 10));
}

export function joinCodeSegments(segments: number[]): string {
  return segments.join('.');
}

export function isDirectChild(childCode: string, parentCode: string): boolean {
  const childSegments = parseCode(childCode);
  const parentSegments = parseCode(parentCode);

  if (childSegments.length !== parentSegments.length + 1) {
    return false;
  }

  for (let i = 0; i < parentSegments.length; i++) {
    if (childSegments[i] !== parentSegments[i]) {
      return false;
    }
  }

  return true;
}

export function getParentCode(code: string): string | null {
  const segments = parseCode(code);
  if (segments.length <= 1) {
    return null;
  }
  return joinCodeSegments(segments.slice(0, -1));
}

export function getDirectChildren(parentCode: string, allAccounts: Account[]): Account[] {
  return allAccounts.filter((account) => isDirectChild(account.code, parentCode));
}

export function findMaxChild(parentCode: string, allAccounts: Account[]): Account | null {
  const children = getDirectChildren(parentCode, allAccounts);

  if (children.length === 0) {
    return null;
  }

  return children.reduce((max, current) => {
    const maxSegments = parseCode(max.code);
    const currentSegments = parseCode(current.code);
    const maxLastSegment = maxSegments[maxSegments.length - 1];
    const currentLastSegment = currentSegments[currentSegments.length - 1];

    return currentLastSegment > maxLastSegment ? current : max;
  });
}

export function suggestNextCode(
  parentId: string | undefined,
  allAccounts: Account[]
): CodeSuggestion {
  if (!parentId) {
    const rootAccounts = allAccounts.filter((acc) => !acc.parentId);
    if (rootAccounts.length === 0) {
      return {
        suggestedCode: '1',
        parentChanged: false,
      };
    }

    const maxRoot = rootAccounts.reduce((max, current) => {
      const maxCode = parseInt(max.code, 10);
      const currentCode = parseInt(current.code, 10);
      return currentCode > maxCode ? current : max;
    });

    const nextCode = parseInt(maxRoot.code, 10) + 1;

    if (nextCode > CODE_LIMITS.MAX_ROOT_ACCOUNTS) {
      return {
        suggestedCode: '',
        parentChanged: false,
        reason: `Limite de contas raiz atingido (máximo ${CODE_LIMITS.MAX_ROOT_ACCOUNTS})`,
      };
    }

    return {
      suggestedCode: String(nextCode),
      parentChanged: false,
    };
  }

  const parent = allAccounts.find((acc) => acc.id === parentId);
  if (!parent) {
    return {
      suggestedCode: '',
      parentChanged: false,
      reason: 'Conta pai não encontrada',
    };
  }

  return suggestCodeRecursive(parent.code, allAccounts);
}

function suggestCodeRecursive(parentCode: string, allAccounts: Account[]): CodeSuggestion {
  const maxChild = findMaxChild(parentCode, allAccounts);

  if (maxChild) {
    const childSegments = parseCode(maxChild.code);
    const lastSegment = childSegments[childSegments.length - 1];

    if (lastSegment === CODE_LIMITS.MAX_SEGMENT_VALUE) {
      const grandParentCode = getParentCode(parentCode);

      if (!grandParentCode) {
        const rootAccounts = allAccounts.filter((acc) => !acc.parentId);
        const maxRoot = rootAccounts.reduce((max, current) => {
          const maxCode = parseInt(max.code, 10);
          const currentCode = parseInt(current.code, 10);
          return currentCode > maxCode ? current : max;
        });

        const nextRootCode = parseInt(maxRoot.code, 10) + 1;

        if (nextRootCode > CODE_LIMITS.MAX_ROOT_ACCOUNTS) {
          return {
            suggestedCode: '',
            parentChanged: false,
            reason: `Limite de contas raiz atingido (máximo ${CODE_LIMITS.MAX_ROOT_ACCOUNTS})`,
          };
        }

        return {
          suggestedCode: String(nextRootCode),
          suggestedParentId: undefined,
          parentChanged: true,
          reason: `A conta pai atingiu o limite de ${CODE_LIMITS.MAX_SEGMENT_VALUE} filhos. Sugerindo o próximo código disponível.`,
        };
      }

      const grandParentAccount = allAccounts.find((acc) => acc.code === grandParentCode);

      if (!grandParentAccount) {
        return {
          suggestedCode: '',
          parentChanged: false,
          reason: 'Erro ao encontrar conta pai superior',
        };
      }

      const recursiveSuggestion = suggestCodeRecursive(grandParentCode, allAccounts);

      return {
        ...recursiveSuggestion,
        suggestedParentId: grandParentAccount.id,
        parentChanged: true,
        reason: `A conta pai atingiu o limite de ${CODE_LIMITS.MAX_SEGMENT_VALUE} filhos. Sugerindo o próximo código disponível.`,
      };
    }

    const newSegments = [...childSegments];
    newSegments[newSegments.length - 1] = lastSegment + 1;
    return {
      suggestedCode: joinCodeSegments(newSegments),
      parentChanged: false,
    };
  }

  return {
    suggestedCode: `${parentCode}.1`,
    parentChanged: false,
  };
}

export function validateCode(code: string): { valid: boolean; error?: string } {
  if (!code || code.trim() === '') {
    return { valid: false, error: 'Código não pode ser vazio' };
  }

  const segments = parseCode(code);

  if (segments.some((seg) => isNaN(seg) || seg <= 0)) {
    return { valid: false, error: 'Código deve conter apenas números positivos' };
  }

  if (segments.some((seg) => seg > CODE_LIMITS.MAX_SEGMENT_VALUE)) {
    return { valid: false, error: `Cada segmento do código deve ser no máximo ${CODE_LIMITS.MAX_SEGMENT_VALUE}` };
  }

  return { valid: true };
}

export function codeExists(code: string, allAccounts: Account[]): boolean {
  return allAccounts.some((account) => account.code === code);
}

export function hasChildren(accountCode: string, allAccounts: Account[]): boolean {
  return allAccounts.some((account) => isDirectChild(account.code, accountCode));
}

export function canHaveMoreChildren(account: Account, allAccounts: Account[]): boolean {
  if (account.acceptsEntries) {
    return false;
  }

  const maxChild = findMaxChild(account.code, allAccounts);

  if (maxChild) {
    const childSegments = parseCode(maxChild.code);
    const lastSegment = childSegments[childSegments.length - 1];

    if (lastSegment === CODE_LIMITS.MAX_SEGMENT_VALUE) {
      return false;
    }
  }

  return true;
}
