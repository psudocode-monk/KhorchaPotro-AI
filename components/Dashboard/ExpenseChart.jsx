'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useTheme } from 'next-themes';

const COLORS = ['#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#64748B'];

export default function ExpenseChart({ expenses }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  // Aggregate data by category
  const categoryData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  // Aggregate data by day (last 7 days logic could be added, here just all dates sorted)
  // For simplicity, showing last 7 transactions or grouped by date
  // Let's group by date (YYYY-MM-DD)
  const dateMap = expenses.reduce((acc, curr) => {
    const date = new Date(curr.date).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + curr.amount;
    return acc;
  }, {});
  
  const dateData = Object.keys(dateMap)
    .sort()
    .slice(-7) // Last 7 active days
    .map(date => ({ date: date.split('-').slice(1).join('/'), amount: dateMap[date] }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 shadow-sm dark:shadow-none dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Category Breakdown</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
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
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 shadow-sm dark:shadow-none dark:border-white/5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Daily Spend Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dateData}>
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
              <Bar dataKey="amount" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
