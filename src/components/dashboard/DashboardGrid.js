import React from 'react';

export function DashboardGrid({ children, cols = 4, className = '' }) {
  const colMap = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };
  return <div className={`grid ${colMap[cols] || colMap[4]} gap-5 ${className}`}>{children}</div>;
}

export function DashboardRow({ children, className = '' }) {
  return <div className={`grid grid-cols-1 lg:grid-cols-3 gap-5 ${className}`}>{children}</div>;
}

export function DashboardSection({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={className}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h2 className="text-sm font-bold text-gray-900">{title}</h2>}
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
