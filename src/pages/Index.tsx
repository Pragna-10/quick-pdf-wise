import { useState } from 'react';
import { format } from 'date-fns';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Download, PlusCircle, BarChart3, Target, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { BudgetTracker } from '@/components/BudgetTracker';
import { AnalyticsCharts } from '@/components/AnalyticsCharts';
import { exportToExcel } from '@/lib/exportExcel';

const Index = () => {
  const { expenses, budgets, addExpense, deleteExpense, addBudget, deleteBudget } = useExpenses();
  const [activeTab, setActiveTab] = useState('expenses');

  const currentMonth = format(new Date(), 'yyyy-MM');
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const totalThisMonth = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);
  const avgPerDay = thisMonthExpenses.length > 0 ? totalThisMonth / new Date().getDate() : 0;
  const recurringCount = expenses.filter(e => e.isRecurring).length;

  const stats = [
    { label: 'This Month', value: `₹${totalThisMonth.toFixed(2)}`, icon: DollarSign, color: 'text-primary' },
    { label: 'Total Spent', value: `₹${totalAll.toFixed(2)}`, icon: TrendingUp, color: 'text-chart-4' },
    { label: 'Avg/Day', value: `₹${avgPerDay.toFixed(2)}`, icon: TrendingDown, color: 'text-accent' },
    { label: 'Recurring', value: `${recurringCount}`, icon: RotateCcw, color: 'text-chart-3' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Expense Buddy</h1>
              <p className="text-xs text-muted-foreground">Track every penny</p>
            </div>
          </div>
          <Button onClick={() => exportToExcel(expenses, budgets)} variant="outline" size="sm" disabled={expenses.length === 0}>
            <Download className="w-4 h-4 mr-2" /> Export Excel
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(stat => (
            <Card key={stat.label} style={{ boxShadow: 'var(--shadow-card)' }}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg mx-auto">
            <TabsTrigger value="expenses" className="gap-1.5"><PlusCircle className="w-4 h-4" /><span className="hidden sm:inline">Expenses</span></TabsTrigger>
            <TabsTrigger value="list" className="gap-1.5"><DollarSign className="w-4 h-4" /><span className="hidden sm:inline">History</span></TabsTrigger>
            <TabsTrigger value="budget" className="gap-1.5"><Target className="w-4 h-4" /><span className="hidden sm:inline">Budget</span></TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5"><BarChart3 className="w-4 h-4" /><span className="hidden sm:inline">Analytics</span></TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseForm onSubmit={addExpense} />
              <ExpenseList expenses={expenses.slice(0, 10)} onDelete={deleteExpense} />
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </TabsContent>

          <TabsContent value="budget" className="mt-6">
            <BudgetTracker budgets={budgets} expenses={expenses} onAddBudget={addBudget} onDeleteBudget={deleteBudget} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsCharts expenses={expenses} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
