import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'destructive' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-green-500/10 text-green-600 border border-green-500/20 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30',
    destructive: 'bg-red-500/10 text-red-600 border border-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30',
    outline: 'border border-border text-foreground',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
};
