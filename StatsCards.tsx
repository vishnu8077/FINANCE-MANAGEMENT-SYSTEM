import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { useExpense } from '../contexts/ExpenseContext';

export const StatsCards: React.FC = () => {
  const { totalIncome, totalExpenses, balance, expenses } = useExpense();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear &&
           expense.type === 'expense';
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const stats = [
    {
      title: 'Total Balance',
      value: `$${balance.toFixed(2)}`,
      icon: DollarSign,
      color: balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: balance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      iconColor: balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Total Income',
      value: `$${totalIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'This Month',
      value: `$${monthlyExpenses.toFixed(2)}`,
      icon: PieChart,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-1 transition-colors duration-300`}>{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor} transition-colors duration-300`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor} transition-colors duration-300`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};