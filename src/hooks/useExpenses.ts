import { useState, useEffect, useCallback } from 'react';
import { Expense, Budget } from '@/types/expense';

const EXPENSES_KEY = 'expense-buddy-expenses';
const BUDGETS_KEY = 'expense-buddy-budgets';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => loadFromStorage(EXPENSES_KEY, []));
  const [budgets, setBudgets] = useState<Budget[]>(() => loadFromStorage(BUDGETS_KEY, []));

  useEffect(() => { localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets)); }, [budgets]);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    setExpenses(prev => [{ ...expense, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  }, []);

  const addBudget = useCallback((budget: Omit<Budget, 'id'>) => {
    setBudgets(prev => {
      const existing = prev.findIndex(b => b.category === budget.category && b.month === budget.month);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], limit: budget.limit };
        return updated;
      }
      return [...prev, { ...budget, id: crypto.randomUUID() }];
    });
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  }, []);

  return { expenses, budgets, addExpense, deleteExpense, updateExpense, addBudget, deleteBudget };
}
