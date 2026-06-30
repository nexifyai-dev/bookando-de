import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({ icon: Icon, label, value, trend, trendUp = true, trendValue, color = 'brand', className = '' }) {
  const colorMap = {
    brand: { bg: 'bg-brand/[0.08]', icon: 'text-brand', accent: 'bg-brand' },
    success: { bg: 'bg-success/[0.08]', icon: 'text-success', accent: 'bg-success' },
    danger: { bg: 'bg-danger/[0.08]', icon: 'text-danger', accent: 'bg-danger' },
    warning: { bg: 'bg-warning/[0.08]', icon: 'text-warning', accent: 'bg-warning' },
    info: { bg: 'bg-info/[0.08]', icon: 'text-info', accent: 'bg-info' },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 hover:shadow-card-hover transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 ${c.bg} rounded-lg flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-success' : 'text-danger'}`}>
            {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{value}</p>
        <p className="text-xs font-medium text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
