import React from 'react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExpense } from '../../contexts/ExpenseContext';

interface AreaChartProps {
  className?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({ className = '' }) => {
  const { expenses } = useExpense();

  // Get weekly data for the last 12 weeks
  const weeklyData = [];
  const currentDate = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= weekStart && expenseDate <= weekEnd && expense.type === 'expense';
    }).reduce((sum, expense) => sum + expense.amount, 0);

    const weekIncome = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= weekStart && expenseDate <= weekEnd && expense.type === 'income';
    }).reduce((sum, expense) => sum + expense.amount, 0);

    weeklyData.push({
      week: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      expenses: weekExpenses,
      income: weekIncome,
      savings: weekIncome - weekExpenses,
    });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <p className="text-gray-900 dark:text-white font-medium mb-2">Week of {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-semibold" style={{ color: entry.color }}>
              {entry.dataKey === 'income' ? 'Income' : 
               entry.dataKey === 'expenses' ? 'Expenses' : 'Savings'}: ${entry.value.toFixed(2)}
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
        <RechartsAreaChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="week" 
            tick={{ fontSize: 12 }}
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-gray-600 dark:text-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="income"
            stackId="1"
            stroke="#22c55e"
            fill="url(#incomeGradient)"
            strokeWidth={2}
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stackId="2"
            stroke="#ef4444"
            fill="url(#expensesGradient)"
            strokeWidth={2}
            animationDuration={800}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};