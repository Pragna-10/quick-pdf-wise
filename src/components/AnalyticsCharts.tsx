import { useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense, CATEGORY_CONFIG, ExpenseCategory } from '@/types/expense';

interface AnalyticsChartsProps {
  expenses: Expense[];
}

export function AnalyticsCharts({ expenses }: AnalyticsChartsProps) {
  const categoryData = useMemo(() => {
    const map = new Map<ExpenseCategory, number>();
    expenses.forEach(e => map.set(e.category, (map.get(e.category) || 0) + e.amount));
    return Array.from(map.entries())
      .map(([cat, amount]) => ({ name: CATEGORY_CONFIG[cat].label, value: Math.round(amount * 100) / 100, color: CATEGORY_CONFIG[cat].color, icon: CATEGORY_CONFIG[cat].icon }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const months: { month: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const start = startOfMonth(d);
      const end = endOfMonth(d);
      const total = expenses
        .filter(e => { const ed = new Date(e.date); return ed >= start && ed <= end; })
        .reduce((s, e) => s + e.amount, 0);
      months.push({ month: format(d, 'MMM'), total: Math.round(total * 100) / 100 });
    }
    return months;
  }, [expenses]);

  const dailyData = useMemo(() => {
    const days: { day: string; amount: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = format(d, 'yyyy-MM-dd');
      const amount = expenses.filter(e => e.date.startsWith(dayStr)).reduce((s, e) => s + e.amount, 0);
      days.push({ day: format(d, 'dd'), amount: Math.round(amount * 100) / 100 });
    }
    return days;
  }, [expenses]);

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card style={{ boxShadow: 'var(--shadow-card)' }}>
          <CardHeader><CardTitle className="text-lg">Spending by Category</CardTitle></CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">No data yet</p>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
<Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 w-full">
                  {categoryData.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="truncate">{d.icon} {d.name}</span>
                      <span className="ml-auto font-medium">${d.value.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card style={{ boxShadow: 'var(--shadow-card)' }}>
          <CardHeader><CardTitle className="text-lg">Monthly Spending</CardTitle></CardHeader>
          <CardContent>
            {totalSpent === 0 ? (
              <p className="text-center py-8 text-muted-foreground text-sm">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="total" fill="hsl(160, 84%, 39%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend */}
      <Card style={{ boxShadow: 'var(--shadow-card)' }}>
        <CardHeader><CardTitle className="text-lg">Daily Spending (Last 30 Days)</CardTitle></CardHeader>
        <CardContent>
          {totalSpent === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" interval={4} />
                <YAxis className="text-xs" />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Line type="monotone" dataKey="amount" stroke="hsl(200, 98%, 39%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
