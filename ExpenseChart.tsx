import React, { useState } from 'react';
import { PieChart as PieChartIcon, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { PieChart } from './charts/PieChart';
import { BarChart } from './charts/BarChart';
import { LineChart } from './charts/LineChart';
import { AreaChart } from './charts/AreaChart';

type ChartType = 'pie' | 'bar' | 'line' | 'area';

export const ExpenseChart: React.FC = () => {
  const [activeChart, setActiveChart] = useState<ChartType>('pie');

  const chartTypes = [
    { type: 'pie' as ChartType, label: 'Category Breakdown', icon: PieChartIcon },
    { type: 'bar' as ChartType, label: 'Monthly Comparison', icon: BarChart3 },
    { type: 'line' as ChartType, label: 'Daily Trends', icon: TrendingUp },
    { type: 'area' as ChartType, label: 'Weekly Overview', icon: Activity },
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'pie':
        return <PieChart />;
      case 'bar':
        return <BarChart />;
      case 'line':
        return <LineChart />;
      case 'area':
        return <AreaChart />;
      default:
        return <PieChart />;
    }
  };

  const getChartDescription = () => {
    switch (activeChart) {
      case 'pie':
        return 'Expense distribution by category';
      case 'bar':
        return 'Income vs expenses over the last 6 months';
      case 'line':
        return 'Daily spending patterns for the last 30 days';
      case 'area':
        return 'Weekly financial overview for the last 12 weeks';
      default:
        return 'Financial data visualization';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Financial Analytics
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
              {getChartDescription()}
            </p>
          </div>
          <div className="flex space-x-1 mt-4 sm:mt-0 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors duration-300">
            {chartTypes.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setActiveChart(type)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeChart === type
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
                title={label}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {renderChart()}
      </div>
    </div>
  );
};