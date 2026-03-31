import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ExpenseCategory, CATEGORY_CONFIG, Expense, Budget } from '@/types/expense';

interface BudgetTrackerProps {
  budgets: Budget[];
  expenses: Expense[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onDeleteBudget: (id: string) => void;
}

export function BudgetTracker({ budgets, expenses, onAddBudget, onDeleteBudget }: BudgetTrackerProps) {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(currentMonth);

  const handleAdd = () => {
    if (!limit) return;
    onAddBudget({ category, limit: parseFloat(limit), month });
    setLimit('');
  };

  const monthBudgets = budgets.filter(b => b.month === month);

  return (
    <Card style={{ boxShadow: 'var(--shadow-card)' }}>
      <CardHeader>
        <CardTitle className="text-lg">Budget Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input type="month" value={month} onChange={e => setMonth(e.target.value)} className="w-full sm:w-auto" />
          <Select value={category} onValueChange={v => setCategory(v as ExpenseCategory)}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>{cfg.icon} {cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="number" step="0.01" min="0" placeholder="Budget limit" value={limit} onChange={e => setLimit(e.target.value)} className="w-full sm:w-32" />
          <Button onClick={handleAdd} disabled={!limit}><Plus className="w-4 h-4 mr-1" /> Set</Button>
        </div>

        {monthBudgets.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground text-sm">No budgets set for {format(new Date(month + '-01'), 'MMMM yyyy')}</p>
        ) : (
          <div className="space-y-3">
            {monthBudgets.map(budget => {
              const cfg = CATEGORY_CONFIG[budget.category];
              const spent = expenses.filter(e => e.category === budget.category && e.date.startsWith(budget.month)).reduce((s, e) => s + e.amount, 0);
              const pct = Math.min((spent / budget.limit) * 100, 100);
              const over = spent > budget.limit;
              return (
                <div key={budget.id} className="p-3 rounded-xl bg-secondary/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cfg.icon}</span>
                      <span className="font-medium text-sm">{cfg.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${over ? 'text-destructive' : ''}`}>₹{spent.toFixed(0)} / ₹{budget.limit.toFixed(0)}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => onDeleteBudget(budget.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={pct} className={`h-2 ${over ? '[&>div]:bg-destructive' : '[&>div]:bg-primary'}`} />
                  {over && <p className="text-xs text-destructive font-medium">⚠️ Over budget by ₹{(spent - budget.limit).toFixed(2)}</p>}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
