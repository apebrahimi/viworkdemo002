import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  external?: boolean;
  onClick?: () => void;
}

export function ModernButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  external = false,
  onClick
}: ModernButtonProps) {
  const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white shadow-lg hover:shadow-xl",
    outline: "bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white shadow-lg hover:shadow-xl"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };

  const buttonContent = (
    <div className="flex items-center gap-2">
      {children}
      {external ? (
        <ExternalLink className="w-4 h-4" />
      ) : (
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      )}
    </div>
  );

  return (
    <Button
      asChild
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        "group",
        className
      )}
      onClick={onClick}
    >
      <Link href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
        {buttonContent}
      </Link>
    </Button>
  );
}
