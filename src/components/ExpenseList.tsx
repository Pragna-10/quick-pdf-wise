import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Search, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Expense, ExpenseCategory, CATEGORY_CONFIG } from '@/types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filtered = expenses
    .filter(e => filterCategory === 'all' || e.category === filterCategory)
    .filter(e => e.description.toLowerCase().includes(search.toLowerCase()) || e.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === 'date' ? new Date(b.date).getTime() - new Date(a.date).getTime() : b.amount - a.amount);

  return (
    <Card style={{ boxShadow: 'var(--shadow-card)' }}>
      <CardHeader>
        <CardTitle className="text-lg">Recent Expenses</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-40"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>{cfg.icon} {cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
            <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="date">By Date</SelectItem>
              <SelectItem value="amount">By Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">No expenses found</p>
            <p className="text-sm mt-1">Start adding expenses to track your spending</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(expense => {
              const cfg = CATEGORY_CONFIG[expense.category];
              return (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl flex-shrink-0">{cfg.icon}</span>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{expense.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>{cfg.label}</span>
                        {expense.isRecurring && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            <RotateCcw className="w-3 h-3 mr-1" />{expense.recurringFrequency}
                          </Badge>
                        )}
                      </div>
                      {expense.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {expense.tags.map(t => <Badge key={t} variant="secondary" className="text-xs px-1.5 py-0">{t}</Badge>)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg whitespace-nowrap">${expense.amount.toFixed(2)}</span>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive" onClick={() => onDelete(expense.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
