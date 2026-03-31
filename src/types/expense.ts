export type ExpenseCategory = 
  | 'food' | 'transport' | 'bills' | 'entertainment' 
  | 'shopping' | 'health' | 'education' | 'travel' | 'other';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  tags: string[];
  date: string; // ISO string
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  limit: number;
  month: string; // YYYY-MM
}

export const CATEGORY_CONFIG: Record<ExpenseCategory, { label: string; icon: string; color: string }> = {
  food: { label: 'Food & Dining', icon: '🍕', color: 'hsl(25, 95%, 53%)' },
  transport: { label: 'Transport', icon: '🚗', color: 'hsl(200, 98%, 39%)' },
  bills: { label: 'Bills & Utilities', icon: '💡', color: 'hsl(262, 83%, 58%)' },
  entertainment: { label: 'Entertainment', icon: '🎬', color: 'hsl(340, 82%, 52%)' },
  shopping: { label: 'Shopping', icon: '🛍️', color: 'hsl(43, 96%, 56%)' },
  health: { label: 'Health', icon: '💊', color: 'hsl(160, 84%, 39%)' },
  education: { label: 'Education', icon: '📚', color: 'hsl(215, 76%, 56%)' },
  travel: { label: 'Travel', icon: '✈️', color: 'hsl(174, 72%, 46%)' },
  other: { label: 'Other', icon: '📦', color: 'hsl(220, 10%, 46%)' },
};
