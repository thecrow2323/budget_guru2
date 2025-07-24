import { ProfileTransaction, ProfileBudget, UserGroup, Profile } from '@/types/profile';
import { API_CONFIG } from './constants';

// Enhanced error handling
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, 'TIMEOUT');
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0,
      'NETWORK_ERROR'
    );
  }
}

// Profile API functions
export const profileApi = {
  async getGroups(): Promise<UserGroup[]> {
    try {
      return await apiRequest<UserGroup[]>('/api/profiles');
    } catch (error) {
      console.error('Failed to fetch user groups:', error);
      throw new Error('Failed to fetch user groups. Please check your connection and try again.');
    }
  },

  async createGroup(group: Omit<UserGroup, '_id' | 'createdAt'>): Promise<UserGroup> {
    try {
      return await apiRequest<UserGroup>('/api/profiles', {
        method: 'POST',
        body: JSON.stringify(group),
      });
    } catch (error) {
      console.error('Failed to create user group:', error);
      throw new Error('Failed to create user group. Please try again.');
    }
  },
};

// Profile Transaction API functions
export const profileTransactionApi = {
  async getAll(profileId?: string, groupId?: string, viewMode: 'individual' | 'group' = 'individual'): Promise<ProfileTransaction[]> {
    try {
      const params = new URLSearchParams();
      if (profileId) params.append('profileId', profileId);
      if (groupId) params.append('groupId', groupId);
      params.append('viewMode', viewMode);

      return await apiRequest<ProfileTransaction[]>(`/api/profile-transactions?${params.toString()}`);
    } catch (error) {
      console.error('Failed to fetch profile transactions:', error);
      throw new Error('Failed to fetch transactions. Please check your connection and try again.');
    }
  },

  async create(transaction: Omit<ProfileTransaction, '_id' | 'createdAt'>): Promise<ProfileTransaction> {
    try {
      if (!transaction.amount || transaction.amount <= 0) {
        throw new Error('Invalid transaction amount');
      }
      if (!transaction.description?.trim()) {
        throw new Error('Transaction description is required');
      }
      if (!transaction.category?.trim()) {
        throw new Error('Transaction category is required');
      }
      if (!transaction.profileId) {
        throw new Error('Profile ID is required');
      }
      if (!transaction.groupId) {
        throw new Error('Group ID is required');
      }

      return await apiRequest<ProfileTransaction>('/api/profile-transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
      });
    } catch (error) {
      console.error('Failed to create profile transaction:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to create transaction. Please try again.'
      );
    }
  },

  async update(id: string, transaction: Omit<ProfileTransaction, '_id' | 'createdAt'>): Promise<ProfileTransaction> {
    try {
      if (!id) {
        throw new Error('Transaction ID is required');
      }
      if (!transaction.amount || transaction.amount <= 0) {
        throw new Error('Invalid transaction amount');
      }
      if (!transaction.description?.trim()) {
        throw new Error('Transaction description is required');
      }
      if (!transaction.category?.trim()) {
        throw new Error('Transaction category is required');
      }
      if (!transaction.profileId) {
        throw new Error('Profile ID is required');
      }
      if (!transaction.groupId) {
        throw new Error('Group ID is required');
      }

      return await apiRequest<ProfileTransaction>(`/api/profile-transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(transaction),
      });
    } catch (error) {
      console.error('Failed to update profile transaction:', error);
      throw new Error('Failed to update transaction. Please try again.');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Transaction ID is required');
      }

      await apiRequest<void>(`/api/profile-transactions/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete profile transaction:', error);
      throw new Error('Failed to delete transaction. Please try again.');
    }
  },
};

// Profile Budget API functions
export const profileBudgetApi = {
  async getAll(profileId?: string, groupId?: string, viewMode: 'individual' | 'group' = 'individual'): Promise<ProfileBudget[]> {
    try {
      const params = new URLSearchParams();
      if (profileId) params.append('profileId', profileId);
      if (groupId) params.append('groupId', groupId);
      params.append('viewMode', viewMode);

      return await apiRequest<ProfileBudget[]>(`/api/profile-budgets?${params.toString()}`);
    } catch (error) {
      console.error('Failed to fetch profile budgets:', error);
      throw new Error('Failed to fetch budgets. Please check your connection and try again.');
    }
  },

  async saveAll(profileId: string, groupId: string, budgets: Omit<ProfileBudget, '_id' | 'profileId' | 'groupId' | 'spent' | 'remaining' | 'percentage' | 'createdAt'>[]): Promise<ProfileBudget[]> {
    try {
      if (!Array.isArray(budgets)) {
        throw new Error('Invalid budget data format');
      }

      for (const budget of budgets) {
        if (!budget.category?.trim()) {
          throw new Error('Budget category is required');
        }
        if (!budget.amount || budget.amount <= 0) {
          throw new Error('Budget amount must be greater than 0');
        }
      }

      return await apiRequest<ProfileBudget[]>('/api/profile-budgets', {
        method: 'POST',
        body: JSON.stringify({ profileId, groupId, budgets }),
      });
    } catch (error) {
      console.error('Failed to save profile budgets:', error);
      throw new Error('Failed to save budgets. Please try again.');
    }
  },
};