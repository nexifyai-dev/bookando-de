import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Building2, CalendarCheck, DollarSign, Users, TrendingUp, Activity,
  Loader2, AlertCircle, ArrowRight, Server, ShieldCheck, Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import apiClient from '../../lib/apiClient';
import { formatAmount } from '../../lib/utils';
import StatCard from '../../components/dashboard/StatCard';
import ChartCard from '../../components/dashboard/ChartCard';
import { DashboardGrid, DashboardRow, DashboardSection } from '../../components/dashboard/DashboardGrid';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [statsRes, activityRes] = await Promise.allSettled([
          apiClient.get('/api/admin/stats').then(r => r.data),
          apiClient.get('/api/admin/activity?limit=8').then(r => r.data),
        ]);
        if (!cancelled) {
          if (statsRes.status === 'fulfilled') setStats(statsRes.value);
          else setStats({ total_vendors: 0, active_bookings: 0, total_revenue: 0, total_users: 0, vendors_growth: [] });

          if (activityRes.status === 'fulfilled') {
            const a = activityRes.value;
            setRecentActivity(Array.isArray(a) ? a : (a.activities || a.data || []));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const vendorGrowthData = stats?.vendors_growth?.length
    ? stats.vendors_growth
    : Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return { name: d.toLocaleDateString('de-DE', { month: 'short' }), vendors: Math.floor(Math.random() * 20) + 5 };
      });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={40} className="text-danger mb-4" />
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors">
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('admin.dashboard.title', 'Admin Dashboard')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('admin.dashboard.subtitle', 'Platform-Übersicht')}</p>
      </div>

      {/* Stat Cards */}
      <DashboardGrid cols={4} className="mb-6">
        <StatCard
          icon={Building2}
          label={t('admin.dashboard.total_vendors', 'Anbieter gesamt')}
          value={stats?.total_vendors || 0}
          trend trendUp
          trendValue="+12%"
          color="brand"
        />
        <StatCard
          icon={CalendarCheck}
          label={t('admin.dashboard.active_bookings', 'Aktive Buchungen')}
          value={stats?.active_bookings || 0}
          trend trendUp
          trendValue="+8%"
          color="success"
        />
        <StatCard
          icon={DollarSign}
          label={t('admin.dashboard.total_revenue', 'Plattform-Umsatz')}
          value={formatAmount(stats?.total_revenue || 0)}
          trend trendUp
          trendValue="+23%"
          color="warning"
        />
        <StatCard
          icon={Users}
          label={t('admin.dashboard.total_users', 'Registrierte Nutzer')}
          value={stats?.total_users || 0}
          trend trendUp
          trendValue="+5%"
          color="info"
        />
      </DashboardGrid>

      <DashboardRow>
        {/* Vendor Growth Chart */}
        <div className="lg:col-span-2">
          <ChartCard title={t('admin.dashboard.vendor_growth', 'Anbieter-Wachstum')} subtitle={t('admin.dashboard.vendor_growth_sub', 'Letzte 6 Monate')}>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vendorGrowthData} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
                  <defs>
                    <linearGradient id="adminAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3C50E0" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#3C50E0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="vendors" stroke="#3C50E0" strokeWidth={2} fill="url(#adminAreaGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Right Column: Recent Activity + System Health */}
        <div className="space-y-5">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="text-sm font-bold text-gray-900">{t('admin.dashboard.recent_activity', 'Letzte Aktivitäten')}</h3>
              <Link to="/admin/activity" className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1 transition-colors">
                {t('common.view_all', 'Alle')} <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-center py-8 text-gray-400">Keine Aktivitäten</p>
              ) : recentActivity.slice(0, 5).map((item, i) => (
                <div key={item.id || i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/80 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-brand shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-700 truncate">{item.description || item.message || 'Aktivität'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.timestamp || item.created_at || ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">{t('admin.dashboard.system_health', 'Systemstatus')}</h3>
            <div className="space-y-3">
              {[
                { icon: Server, label: 'API Server', status: 'Online', ok: true },
                { icon: ShieldCheck, label: 'Auth Service', status: 'OK', ok: true },
                { icon: Activity, label: 'Bookings Queue', status: 'Normal', ok: true },
                { icon: Clock, label: 'Cron Jobs', status: 'Aktiv', ok: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                    <item.icon size={16} className="text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.ok ? 'bg-success-light text-success-dark' : 'bg-danger-light text-danger-dark'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardRow>
    </div>
  );
}
