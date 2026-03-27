import React from 'react';
import { cn } from '../lib/utils';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ children, className, hoverable = true }) => {
  return (
    <div className={cn(
      "bg-white p-6 rounded-2xl border border-gray-200 shadow-sm",
      hoverable && "hover:border-gray-300 transition-colors group",
      className
    )}>
      {children}
    </div>
  );
};
