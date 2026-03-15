'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Calendar, CreditCard, Tag, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  const [filter, setFilter] = useState('');
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  
  // Pagination states
  const [displayedCount, setDisplayedCount] = useState(10);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loaderRef = useRef(null);

  const filteredExpenses = expenses.filter(e => 
    e.note?.toLowerCase().includes(filter.toLowerCase()) ||
    e.category.toLowerCase().includes(filter.toLowerCase())
  );

  const displayedExpenses = filteredExpenses.slice(0, displayedCount);
  const hasMore = displayedCount < filteredExpenses.length;

  const loadMore = useCallback(() => {
    if (isFetchingMore || !hasMore) return;
    
    setIsFetchingMore(true);
    // Simulate a small delay for natural feel
    setTimeout(() => {
      setDisplayedCount(prev => prev + 10);
      setIsFetchingMore(false);
    }, 600);
  }, [isFetchingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loadMore, hasMore]);

  // Reset pagination when filter changes
  useEffect(() => {
    setDisplayedCount(10);
  }, [filter]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search expenses..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-4 py-3 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 mb-6"
      />

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {displayedExpenses.map((expense) => (
            <motion.div
              key={expense._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              layout
              className="p-4 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl hover:border-emerald-500/30 dark:hover:border-white/10 transition-all flex justify-between items-center group shadow-sm dark:shadow-none"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white text-lg">₹{expense.amount}</span>
                  <span className={`text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20`}>
                    {expense.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CreditCard size={12} />
                    <span>{expense.paymentMode}</span>
                  </div>
                  {expense.note && (
                    <div className="flex items-center space-x-1">
                      <Tag size={12} />
                      <span className="truncate max-w-[150px]">{expense.note}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setExpenseToDelete(expense._id)}
                  className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg hover:bg-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loader/Intersection target */}
        {hasMore && (
          <div 
            ref={loaderRef} 
            className="py-6 flex justify-center items-center"
          >
            {isFetchingMore ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10"
              >
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm font-medium">Loading more expenses...</span>
              </motion.div>
            ) : (
              <div className="h-4" /> // Placeholder for intersection
            )}
          </div>
        )}
        
        {filteredExpenses.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No expenses found.
          </div>
        )}
      </div>

      <ConfirmDeleteModal 
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={() => onDelete(expenseToDelete)}
        itemName="Expense"
      />
    </div>
  );
}

