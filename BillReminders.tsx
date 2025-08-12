import React, { useState } from 'react';
import { X, Plus, Trash2, Edit, Calendar, Check, Clock, AlertCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useExpense } from '../contexts/ExpenseContext';

interface BillRemindersProps {
  onClose: () => void;
}

export const BillReminders: React.FC<BillRemindersProps> = ({ onClose }) => {
  const { 
    billReminders, 
    addBillReminder, 
    updateBillReminder, 
    deleteBillReminder,
    markBillAsPaid 
  } = useNotifications();
  const { categories } = useExpense();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0],
    category: '',
    recurring: 'monthly' as 'none' | 'weekly' | 'monthly' | 'yearly',
    reminderDays: 3,
    isPaid: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reminderData = {
      ...formData,
      dueDate: new Date(formData.dueDate),
    };
    
    if (editingReminder) {
      updateBillReminder(editingReminder, reminderData);
      setEditingReminder(null);
    } else {
      addBillReminder(reminderData);
    }
    
    setFormData({
      name: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0],
      category: '',
      recurring: 'monthly',
      reminderDays: 3,
      isPaid: false,
    });
    setShowAddForm(false);
  };

  const startEdit = (reminder: any) => {
    setFormData({
      name: reminder.name,
      amount: reminder.amount,
      dueDate: reminder.dueDate.toISOString().split('T')[0],
      category: reminder.category,
      recurring: reminder.recurring,
      reminderDays: reminder.reminderDays,
      isPaid: reminder.isPaid,
    });
    setEditingReminder(reminder.id);
    setShowAddForm(true);
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getBillStatus = (reminder: any) => {
    if (reminder.isPaid) return 'paid';
    
    const daysUntilDue = getDaysUntilDue(reminder.dueDate);
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue === 0) return 'due-today';
    if (daysUntilDue <= reminder.reminderDays) return 'due-soon';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'overdue': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'due-today': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'due-soon': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <Check className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'due-today': return <Clock className="h-4 w-4" />;
      case 'due-soon': return <Calendar className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusText = (reminder: any) => {
    const status = getBillStatus(reminder);
    const daysUntilDue = getDaysUntilDue(reminder.dueDate);
    
    switch (status) {
      case 'paid': return 'Paid';
      case 'overdue': return `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`;
      case 'due-today': return 'Due today';
      case 'due-soon': return `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`;
      default: return `Due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`;
    }
  };

  const sortedReminders = [...billReminders].sort((a, b) => {
    // Sort by status priority, then by due date
    const statusPriority = { overdue: 0, 'due-today': 1, 'due-soon': 2, upcoming: 3, paid: 4 };
    const aStatus = getBillStatus(a);
    const bStatus = getBillStatus(b);
    
    if (statusPriority[aStatus] !== statusPriority[bStatus]) {
      return statusPriority[aStatus] - statusPriority[bStatus];
    }
    
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-colors duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Bill Reminders
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
              Upcoming Bills
            </h3>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Bill</span>
            </button>
          </div>

          {showAddForm && (
            <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-300">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Bill Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      placeholder="e.g., Electricity Bill"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                    />
                  </div>

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
                      Recurring
                    </label>
                    <select
                      value={formData.recurring}
                      onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.value as any }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                    >
                      <option value="none">One-time</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      Remind me (days before)
                    </label>
                    <input
                      type="number"
                      value={formData.reminderDays}
                      onChange={(e) => setFormData(prev => ({ ...prev, reminderDays: parseInt(e.target.value) || 3 }))}
                      required
                      min="1"
                      max="30"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                      placeholder="3"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingReminder(null);
                      setFormData({
                        name: '',
                        amount: 0,
                        dueDate: new Date().toISOString().split('T')[0],
                        category: '',
                        recurring: 'monthly',
                        reminderDays: 3,
                        isPaid: false,
                      });
                    }}
                    className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    {editingReminder ? 'Update Bill' : 'Add Bill'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {sortedReminders.map((reminder) => {
              const status = getBillStatus(reminder);
              const statusColor = getStatusColor(status);
              const statusIcon = getStatusIcon(status);
              const statusText = getStatusText(reminder);

              return (
                <div
                  key={reminder.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${statusColor}`}>
                        {statusIcon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                          {reminder.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          <span>${reminder.amount.toFixed(2)}</span>
                          <span>•</span>
                          <span>{reminder.category}</span>
                          <span>•</span>
                          <span>{reminder.dueDate.toLocaleDateString()}</span>
                          {reminder.recurring !== 'none' && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{reminder.recurring}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                        {statusText}
                      </div>
                      
                      {!reminder.isPaid && (
                        <button
                          onClick={() => markBillAsPaid(reminder.id)}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors duration-200 text-sm font-medium"
                        >
                          Mark Paid
                        </button>
                      )}

                      <button
                        onClick={() => startEdit(reminder)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteBillReminder(reminder.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {billReminders.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">No bill reminders set</p>
              <p className="text-sm">Add your first bill to get reminded before due dates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};