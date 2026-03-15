'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const SOURCES = ['Salary', 'Freelance', 'Business', 'Investments', 'Gift', 'Other'];

export default function IncomeForm({ income, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    amount: '',
    source: 'Salary',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (income) {
      setFormData({
        amount: income.amount,
        source: income.source,
        date: new Date(income.date).toISOString().split('T')[0],
        note: income.note || '',
      });
    }
  }, [income]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = income ? `/api/incomes/${income._id}` : '/api/incomes';
      const method = income ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save income');

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

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
        <select
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          className="px-4 py-2 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white appearance-none"
        >
          {SOURCES.map(s => <option key={s} value={s} className="bg-white dark:bg-black">{s}</option>)}
        </select>
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
        placeholder="Freelance Project X"
      />

      <Button type="submit" loading={loading} className="w-full mt-4">
        {income ? 'Update Income' : 'Add Income'}
      </Button>
    </form>
  );
}
