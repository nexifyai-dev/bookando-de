import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ExternalLink, MousePointerClick, ShoppingCart, Wallet, Percent, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../lib/apiClient';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import StatCard from '../../components/dashboard/StatCard';
import { DashboardGrid, DashboardRow, DashboardSection } from '../../components/dashboard/DashboardGrid';

export default function AffiliateDashboardPage() {
  const { t } = useTranslation();

  const { data: links = [], isLoading: linksLoading } = useAutoRefresh(['affiliate', 'links'], () =>
    apiClient.get('/api/affiliate/links').then(r => Array.isArray(r.data) ? r.data : []));
  const { data: commissions = [] } = useAutoRefresh(['affiliate', 'commissions'], () =>
    apiClient.get('/api/affiliate/commissions').then(r => Array.isArray(r.data) ? r.data : []));
  const { data: wallet = {} } = useAutoRefresh(['affiliate', 'wallet'], () =>
    apiClient.get('/api/wallet/balance').then(r => r.data || {}));
  const { data: affStats = {} } = useAutoRefresh(['affiliate', 'stats'], () =>
    apiClient.get('/api/affiliate/stats').then(r => r.data || {}));

  const isLoading = linksLoading;

  const stats = {
    linkCount: Array.isArray(links) ? links.length : 0,
    commissionPending: Array.isArray(commissions) ? commissions.filter(c => c.status === 'pending').reduce((s, c) => s + (c.amount || 0), 0) : 0,
    commissionApproved: Array.isArray(commissions) ? commissions.filter(c => c.status === 'approved').reduce((s, c) => s + (c.amount || 0), 0) : 0,
    walletBalance: wallet.balance || wallet.current_balance || 0,
    walletPending: wallet.pending_balance || wallet.pending || 0,
    clicks: affStats.clicks || affStats.total_clicks || 0,
    conversions: affStats.conversions || affStats.total_conversions || 0,
  };

  const conversionRate = stats.clicks > 0 ? ((stats.conversions / stats.clicks) * 100).toFixed(1) : '0.0';

  if (isLoading && !links.length && !commissions.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('affiliate.dashboard', 'Affiliate Dashboard')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('affiliate.dashboard_desc', 'Deine Marketing-Performance auf einen Blick')}</p>
      </div>

      {/* Stat Cards */}
      <DashboardGrid cols={3} className="mb-6">
        <StatCard
          icon={ExternalLink}
          label={t('affiliate.links', 'Trackinglinks')}
          value={stats.linkCount}
          color="brand"
        />
        <StatCard
          icon={MousePointerClick}
          label={t('affiliate.clicks', 'Klicks')}
          value={stats.clicks}
          trend trendUp
          trendValue={`${conversionRate}% CVR`}
          color="warning"
        />
        <StatCard
          icon={ShoppingCart}
          label={t('affiliate.conversions', 'Buchungen')}
          value={stats.conversions}
          trend trendUp
          trendValue={`+${stats.conversions}`}
          color="success"
        />
      </DashboardGrid>

      <DashboardGrid cols={3} className="mb-6">
        <StatCard
          icon={Percent}
          label={t('affiliate.pending_commission', 'Offene Provision')}
          value={`${stats.commissionPending.toFixed(2)} €`}
          color="warning"
        />
        <StatCard
          icon={TrendingUp}
          label={t('affiliate.approved_commission', 'Bestätigte Provision')}
          value={`${stats.commissionApproved.toFixed(2)} €`}
          trend trendUp
          trendValue="Bestätigt"
          color="success"
        />
        <StatCard
          icon={Wallet}
          label={t('affiliate.wallet_balance', 'Wallet-Guthaben')}
          value={`${stats.walletBalance.toFixed(2)} €`}
          color="brand"
        />
      </DashboardGrid>

      {/* Links Table */}
      <DashboardSection
        title={t('affiliate.recent_links', 'Deine Trackinglinks')}
        action={
          <Link to="/affiliate/links" className="text-xs font-semibold text-brand hover:text-brand-hover flex items-center gap-1.5 transition-colors">
            {t('common.view_all', 'Alle anzeigen')} <ArrowRight size={12} />
          </Link>
        }
      >
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {links.length === 0 ? (
            <p className="text-sm text-center py-10 text-gray-400">
              {t('affiliate.no_links', 'Noch keine Trackinglinks vorhanden.')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Link</span></th>
                    <th className="text-left px-5 py-3"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Klicks</span></th>
                    <th className="text-left px-5 py-3"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversions</span></th>
                    <th className="text-left px-5 py-3"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {links.slice(0, 5).map((link, i) => (
                    <tr key={link.id || i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3 text-sm text-gray-700 font-medium truncate max-w-[200px]">
                        {link.name || link.slug || link.url || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{link.clicks || link.total_clicks || 0}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{link.conversions || link.total_conversions || 0}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${link.active !== false ? 'bg-success-light text-success-dark' : 'bg-gray-100 text-gray-600'}`}>
                          {link.active !== false ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardSection>
    </div>
  );
}
