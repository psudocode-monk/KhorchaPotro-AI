'use client';

import DashboardBackground from '@/components/ui/DashboardBackground';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import SummaryCards from '@/components/Dashboard/SummaryCards';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

// Skeleton used as fallback while lazy chunks download
const ChartSkeleton = () => (
  <div className="bg-white/60 dark:bg-[#111]/60 rounded-3xl p-6 mb-6 animate-pulse h-64 border border-gray-200 dark:border-white/5" />
);
const ListSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-14 bg-gray-100 dark:bg-white/5 rounded-xl" />
    ))}
  </div>
);

// Lazy-loaded heavy components
const ExpenseChart  = dynamic(() => import('@/components/Dashboard/ExpenseChart'),  { ssr: false, loading: () => <ChartSkeleton /> });
const FinancialChart = dynamic(() => import('@/components/Dashboard/FinancialChart'), { ssr: false, loading: () => <ChartSkeleton /> });
const AIAnalysis    = dynamic(() => import('@/components/Dashboard/AIAnalysis'),     { ssr: false, loading: () => <ChartSkeleton /> });
const ExpenseList   = dynamic(() => import('@/components/Expense/ExpenseList'),      { ssr: false, loading: () => <ListSkeleton /> });
const IncomeList    = dynamic(() => import('@/components/Income/IncomeList'),        { ssr: false, loading: () => <ListSkeleton /> });
const ExpenseForm   = dynamic(() => import('@/components/Expense/ExpenseForm'),      { ssr: false });
const IncomeForm    = dynamic(() => import('@/components/Income/IncomeForm'),        { ssr: false });

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('expenses');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expRes, incRes] = await Promise.all([
        fetch('/api/expenses'),
        fetch('/api/incomes')
      ]);

      if (expRes.ok) setExpenses(await expRes.json());
      if (incRes.ok) setIncomes(await incRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, type) => {
    try {
      const endpoint = type === 'expense' ? `/api/expenses/${id}` : `/api/incomes/${id}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Only block on auth loading — not on data loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <DashboardBackground />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 relative z-10"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DashboardBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, {session?.user?.name}</p>
          </div>

          <div className="flex bg-gray-200/50 dark:bg-white/5 rounded-lg p-1 border border-gray-300 dark:border-white/10 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'expenses' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab('incomes')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'incomes' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'}`}
            >
              Incomes
            </button>
          </div>

          <Button onClick={() => setIsModalOpen(true)} className="md:w-auto w-full">
            <Plus className="w-5 h-5 mr-2" />
            Add {activeTab === 'expenses' ? 'Expense' : 'Income'}
          </Button>
        </div>

        {/* Summary cards load immediately — no skeleton needed */}
        <SummaryCards expenses={expenses} incomes={incomes} />

        {/* Heavy sections lazy-load after data arrives */}
        <AIAnalysis expenses={expenses} incomes={incomes} />
        <FinancialChart expenses={expenses} incomes={incomes} />
        {activeTab === 'expenses' && <ExpenseChart expenses={expenses} />}

        <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent {activeTab === 'expenses' ? 'Transactions' : 'Income Sources'}
          </h2>

          {loading ? (
            <ListSkeleton />
          ) : activeTab === 'expenses' ? (
            <ExpenseList 
              expenses={expenses} 
              onEdit={handleEdit} 
              onDelete={(id) => handleDelete(id, 'expense')} 
            />
          ) : (
            <IncomeList
              incomes={incomes}
              onEdit={handleEdit}
              onDelete={(id) => handleDelete(id, 'income')}
            />
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingItem ? `Edit ${activeTab === 'expenses' ? 'Expense' : 'Income'}` : `Add New ${activeTab === 'expenses' ? 'Expense' : 'Income'}`}
        >
          {activeTab === 'expenses' ? (
            <ExpenseForm
              expense={editingItem}
              onSuccess={fetchData}
              onClose={handleCloseModal}
            />
          ) : (
            <IncomeForm
              income={editingItem}
              onSuccess={fetchData}
              onClose={handleCloseModal}
            />
          )}
        </Modal>

      </div>
    </div>
  );
}
