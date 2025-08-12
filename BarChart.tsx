import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpense } from '../../contexts/ExpenseContext';

interface BarChartProps {
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ className = '' }) => {
  const { expenses } = useExpense();

  // Get last 6 months of data
  const monthsData = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === date.getMonth() && 
             expenseDate.getFullYear() === date.getFullYear() &&
             expense.type === 'expense';
    }).reduce((sum, expense) => sum + expense.amount, 0);

    const monthIncome = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === date.getMonth() && 
             expenseDate.getFullYear() === date.getFullYear() &&
             expense.type === 'income';
    }).reduce((sum, expense) => sum + expense.amount, 0);

    monthsData.push({
      month: `${monthName} ${year}`,
      expenses: monthExpenses,
      income: monthIncome,
    });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <p className="text-gray-900 dark:text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-semibold" style={{ color: entry.color }}>
              {entry.dataKey === 'income' ? 'Income' : 'Expenses'}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={monthsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-gray-600 dark:text-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="income" 
            fill="#22c55e" 
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
          <Bar 
            dataKey="expenses" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};