'use client';

import { AlertTriangle } from 'lucide-react';

export const getAlertIcon = (type: string) => {
  switch (type) {
    case 'critical':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'high':
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    case 'medium':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'low':
      return <AlertTriangle className="w-4 h-4 text-blue-500" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-gray-500" />;
  }
};

export const getAlertColor = (type: string) => {
  switch (type) {
    case 'critical':
      return 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30';
    case 'high':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700/30';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/30';
    case 'low':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/30';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700/30';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
    case 'active':
      return 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30';
    case 'investigating':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-700/30';
    case 'resolved':
      return 'bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700/30';
  }
};
