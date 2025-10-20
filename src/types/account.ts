export type AccountType = 'receipt' | 'expense';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  acceptsEntries: boolean;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDTO {
  code: string;
  name: string;
  type: AccountType;
  acceptsEntries: boolean;
  parentId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface CodeSuggestion {
  suggestedCode: string;
  suggestedParentId?: string;
  parentChanged: boolean;
  reason?: string;
}

/**
 * Generic service result type for consistent API responses
 */
export type ServiceResult<T = void> =
  | { success: true; data: T }
  | { success: false; errors: string[]; fieldErrors?: ValidationError[] };
