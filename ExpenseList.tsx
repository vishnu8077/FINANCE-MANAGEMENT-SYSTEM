import React, { useState } from 'react';
import { Edit, Trash2, Calendar, Tag, DollarSign, Filter } from 'lucide-react';
import { useExpense } from '../contexts/ExpenseContext';
import { ExpenseForm } from './ExpenseForm';

interface ExpenseListProps {
  limit?: number;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ limit }) => {
  const { expenses, deleteExpense, categories } = useExpense();
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const filteredExpenses = expenses
    .filter(expense => filter === 'all' || expense.type === filter)
    .filter(expense => categoryFilter === 'all' || expense.category === categoryFilter)
    .slice(0, limit);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#6b7280';
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.icon || '📝';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setLoading(true);
      try {
        const success = await deleteExpense(id);
        if (!success) {
          alert('Failed to delete transaction. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete transaction. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            {limit ? 'Recent Transactions' : 'All Transactions'}
          </h3>
          {!limit && (
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'expense' | 'income')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="all">All Types</option>
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <div className="mb-4">
              <DollarSign className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 transition-colors duration-300" />
            </div>
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm">Start by adding your first expense or income</p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense._id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${getCategoryColor(expense.category)}20` }}
                  >
                    <span className="text-lg">{getCategoryIcon(expense.category)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{expense.description}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        {expense.category}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(expense.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`font-semibold transition-colors duration-300 ${
                      expense.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize transition-colors duration-300">{expense.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingExpense(expense)}
                      disabled={loading}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      disabled={loading}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
};