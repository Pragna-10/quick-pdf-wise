import * as XLSX from 'xlsx';
import { Expense, Budget, CATEGORY_CONFIG } from '@/types/expense';

export function exportToExcel(expenses: Expense[], budgets: Budget[]) {
  const wb = XLSX.utils.book_new();

  // Expenses sheet
  const expenseData = expenses.map(e => ({
    Date: new Date(e.date).toLocaleDateString(),
    Description: e.description,
    Category: CATEGORY_CONFIG[e.category].label,
    Amount: e.amount,
    Tags: e.tags.join(', '),
    Recurring: e.isRecurring ? (e.recurringFrequency || 'Yes') : 'No',
  }));
  const ws1 = XLSX.utils.json_to_sheet(expenseData.length ? expenseData : [{ Date: '', Description: '', Category: '', Amount: 0, Tags: '', Recurring: '' }]);
  ws1['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 18 }, { wch: 12 }, { wch: 20 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Expenses');

  // Budget sheet
  const budgetData = budgets.map(b => ({
    Month: b.month,
    Category: CATEGORY_CONFIG[b.category].label,
    'Budget Limit': b.limit,
    Spent: expenses.filter(e => e.category === b.category && e.date.startsWith(b.month)).reduce((s, e) => s + e.amount, 0),
  }));
  if (budgetData.length) {
    const ws2 = XLSX.utils.json_to_sheet(budgetData);
    ws2['!cols'] = [{ wch: 12 }, { wch: 18 }, { wch: 14 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Budgets');
  }

  // Summary sheet
  const categories = Object.keys(CATEGORY_CONFIG) as (keyof typeof CATEGORY_CONFIG)[];
  const summaryData = categories.map(cat => ({
    Category: CATEGORY_CONFIG[cat].label,
    'Total Spent': expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
    'Number of Transactions': expenses.filter(e => e.category === cat).length,
  })).filter(s => s['Number of Transactions'] > 0);
  if (summaryData.length) {
    const ws3 = XLSX.utils.json_to_sheet(summaryData);
    ws3['!cols'] = [{ wch: 18 }, { wch: 14 }, { wch: 22 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'Summary');
  }

  XLSX.writeFile(wb, `ExpenseBuddy_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
