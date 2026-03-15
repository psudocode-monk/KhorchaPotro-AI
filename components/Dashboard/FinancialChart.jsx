'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from 'next-themes';

const COLORS = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#64748B'];

export default function FinancialChart({ expenses, incomes }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  // Aggregate Income by Source
  const incomeSourceData = incomes.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.source);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.source, value: curr.amount });
    }
    return acc;
  }, []);

  // Aggregate Data by Date for Bar Chart
  const allDates = new Set([
    ...expenses.map(e => new Date(e.date).toISOString().split('T')[0]),
    ...incomes.map(i => new Date(i.date).toISOString().split('T')[0])
  ]);

  const barChartData = Array.from(allDates).sort().slice(-7).map(date => {
    const dayExpenses = expenses
      .filter(e => new Date(e.date).toISOString().split('T')[0] === date)
      .reduce((sum, e) => sum + e.amount, 0);

    const dayIncome = incomes
      .filter(i => new Date(i.date).toISOString().split('T')[0] === date)
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      date: date.split('-').slice(1).join('/'), // MM/DD
      expense: dayExpenses,
      income: dayIncome
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Income vs Expense Bar Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 shadow-sm dark:shadow-none dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Income vs Expense (Last 7 Active Days)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#e5e7eb"} vertical={false} />
              <XAxis dataKey="date" stroke={isDark ? "#666" : "#9ca3af"} tick={{ fill: isDark ? '#666' : '#6b7280' }} />
              <YAxis stroke={isDark ? "#666" : "#9ca3af"} tick={{ fill: isDark ? '#666' : '#6b7280' }} />
              <Tooltip 
                cursor={{ fill: isDark ? '#ffffff10' : '#00000005' }}
                contentStyle={{ 
                  backgroundColor: isDark ? '#000' : '#fff', 
                  borderColor: isDark ? '#333' : '#e5e7eb', 
                  borderRadius: '8px', 
                  color: isDark ? '#fff' : '#111',
                  boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend wrapperStyle={{ color: isDark ? '#fff' : '#111' }}/>
              <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income Source Pie Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 shadow-sm dark:shadow-none dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Income Sources</h3>
        <div className="h-[300px] w-full">
          {incomeSourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incomeSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#000' : '#fff', 
                    borderColor: isDark ? '#333' : '#e5e7eb', 
                    borderRadius: '8px', 
                    color: isDark ? '#fff' : '#111',
                    boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: isDark ? '#fff' : '#111' }}
                />
                <Legend wrapperStyle={{ color: isDark ? '#fff' : '#111' }}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No income data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
