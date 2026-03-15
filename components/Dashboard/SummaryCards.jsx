import { Wallet, TrendingUp, Calendar } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

export default function SummaryCards({ expenses, incomes }) {
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;
  
  const cards = [
    {
      label: 'Total Income',
      value: totalIncome,
      icon: Wallet,
      color: 'from-emerald-500 to-green-500',
    },
    {
      label: 'Total Expenses',
      value: totalExpenses,
      icon: TrendingUp,
      color: 'from-red-500 to-pink-500',
    },
    {
      label: 'Net Savings',
      value: savings,
      icon: Calendar,
      color: savings >= 0 ? 'from-blue-500 to-cyan-500' : 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-[#111] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 hover:border-emerald-500/30 transition-all group">
          <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${card.color} blur-xl rounded-full w-24 h-24 -mr-6 -mt-6`} />
          
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-10 bg-clip-border`}>
              <card.icon className="text-white w-6 h-6" />
            </div>
            <span className="text-xs text-gray-500 uppercase font-medium tracking-wider">
              Year to Date
            </span>
          </div>
          
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              <AnimatedCounter value={card.value} />
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
