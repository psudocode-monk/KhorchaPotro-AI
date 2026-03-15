'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const CATEGORIES = ['Food', 'Travel', 'Rent', 'Shopping', 'Health', 'Entertainment', 'Education', 'Other'];
const PAYMENT_MODES = ['Cash', 'UPI', 'Card', 'Net Banking', 'Other'];

export default function ExpenseForm({ expense, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    paymentMode: 'UPI',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        paymentMode: expense.paymentMode,
        date: new Date(expense.date).toISOString().split('T')[0],
        note: expense.note || '',
      });
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = expense ? `/api/expenses/${expense._id}` : '/api/expenses';
      const method = expense ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save expense');

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Amount (₹)"
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        required
        min="1"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="px-4 py-2 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white appearance-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-white dark:bg-black">{c}</option>)}
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Mode</label>
          <select
            value={formData.paymentMode}
            onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
            className="px-4 py-2 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white appearance-none"
          >
            {PAYMENT_MODES.map(m => <option key={m} value={m} className="bg-white dark:bg-black">{m}</option>)}
          </select>
        </div>
      </div>

      <Input
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />

      <Input
        label="Note (Optional)"
        type="text"
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        placeholder="Dinner at Taj"
      />

      <Button type="submit" loading={loading} className="w-full mt-4">
        {expense ? 'Update Expense' : 'Add Expense'}
      </Button>
    </form>
  );
}
