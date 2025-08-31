'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  count: number;
  label: string;
  color: 'blue' | 'green' | 'gray' | 'red' | 'yellow';
}

export function StatsCard({ icon: Icon, count, label, color }: StatsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-700 dark:text-blue-300'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950/30',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-700 dark:text-green-300'
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-950/30',
      border: 'border-gray-200 dark:border-gray-800',
      icon: 'text-gray-600 dark:text-gray-400',
      text: 'text-gray-700 dark:text-gray-300'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-700 dark:text-red-300'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-950/30',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-700 dark:text-yellow-300'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 ${colors.bg} border ${colors.border} rounded-md`}>
      <Icon className={`w-3 h-3 ${colors.icon}`} />
      <span className={`font-medium ${colors.text}`}>{count}</span>
      <span className={`${colors.icon}`}>{label}</span>
    </div>
  );
}
