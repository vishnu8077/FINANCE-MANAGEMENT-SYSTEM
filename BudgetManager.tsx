import React, { useState } from 'react';
import { X, Plus, Trash2, Edit, Target, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useExpense } from '../contexts/ExpenseContext';

interface BudgetManagerProps {
  onClose: () => void;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({ onClose }) => {
  const { 
    budgetLimits, 
    addBudgetLimit, 
    updateBudgetLimit, 
    deleteBudgetLimit 
  } = useNotifications();
  const { categories, expenses } = useExpense();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLimit, setEditingLimit] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    limit: 0,
    period: 'monthly' as 'daily' | 'weekly' | 'monthly',
    alertThreshold: 80,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLimit) {
      updateBudgetLimit(editingLimit, formData);
      setEditingLimit(null);
    } else {
      addBudgetLimit(formData);
    }
    
    setFormData({ category: '', limit: 0, period: 'monthly', alertThreshold: 80 });
    setShowAddForm(false);
  };

  const startEdit = (limit: any) => {
    setFormData({
      category: limit.category,
      limit: limit.limit,
      period: limit.period,
      alertThreshold: limit.alertThreshold,
    });
    setEditingLimit(limit.id);
    setShowAddForm(true);
  };

  const getCurrentSpending = (category: string, period: string) => {
    const currentDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'daily':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expense.category === category && 
             expense.type === 'expense' && 
             expenseDate >= startDate && 
             expenseDate <= currentDate;
    }).reduce((sum, expense) => sum + expense.amount, 0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-colors duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Budget Management
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
              Budget Limits
            </h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Budget</span>
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                    >
                      <option value="">Select category</option>
                      {categories.filter(cat => !['Salary', 'Freelance'].includes(cat.name)).map(category => (
                        <option key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Budget Limit
                    </label>
                    <input
                      type="number"
                      value={formData.limit}
                      onChange={(e) => setFormData(prev => ({ ...prev, limit: parseFloat(e.target.value) || 0 }))}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Period
                    </label>
                    <select
                      value={formData.period}
                      onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as any }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Alert Threshold (%)
                    </label>
                    <input
                      type="number"
                      value={formData.alertThreshold}
                      onChange={(e) => setFormData(prev => ({ ...prev, alertThreshold: parseInt(e.target.value) || 80 }))}
                      required
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      placeholder="80"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingLimit(null);
                      setFormData({ category: '', limit: 0, period: 'monthly', alertThreshold: 80 });
                    }}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    {editingLimit ? 'Update Budget' : 'Add Budget'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {budgetLimits.map((limit) => {
              const currentSpending = getCurrentSpending(limit.category, limit.period);
              const percentage = (currentSpending / limit.limit) * 100;
              const isOverBudget = percentage > 100;
              const isNearLimit = percentage >= limit.alertThreshold;

              return (
                <div
                  key={limit.id}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                    isOverBudget 
                      ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' 
                      : isNearLimit 
                      ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                        {limit.category}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize transition-colors duration-300">
                        {limit.period} budget
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(isOverBudget || isNearLimit) && (
                        <AlertTriangle className={`h-5 w-5 ${isOverBudget ? 'text-red-500' : 'text-yellow-500'}`} />
                      )}
                      <button
                        onClick={() => startEdit(limit)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteBudgetLimit(limit.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        Spent: ${currentSpending.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        Budget: ${limit.limit.toFixed(2)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 transition-colors duration-300">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isOverBudget 
                            ? 'bg-red-500' 
                            : isNearLimit 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium transition-colors duration-300 ${
                        isOverBudget 
                          ? 'text-red-600 dark:text-red-400' 
                          : isNearLimit 
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}>
                        {percentage.toFixed(1)}% used
                      </span>
                      {isOverBudget && (
                        <span className="text-sm font-medium text-red-600 dark:text-red-400 transition-colors duration-300">
                          Over by ${(currentSpending - limit.limit).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {budgetLimits.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">No budget limits set</p>
              <p className="text-sm">Create your first budget to start tracking spending limits</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};