import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ExternalLink, MousePointerClick, ShoppingCart, Wallet, Percent } from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { Card, CardContent } from '../../components/ui/card';

export default function AffiliateDashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      // Pull data from multiple endpoints efficiently
      const [linksRes, commissionsRes, walletRes, statsRes] = await Promise.allSettled([
        apiClient.get('/api/affiliate/links'),
        apiClient.get('/api/affiliate/commissions'),
        apiClient.get('/api/wallet/balance'),
        apiClient.get('/api/affiliate/stats'),
      ]);
      const links = linksRes.status === 'fulfilled' ? (linksRes.value.data || []) : [];
      const commissions = commissionsRes.status === 'fulfilled' ? (commissionsRes.value.data || []) : [];
      const wallet = walletRes.status === 'fulfilled' ? (walletRes.value.data || {}) : {};
      const affStats = statsRes.status === 'fulfilled' ? (statsRes.value.data || {}) : {};

      setStats({
        linkCount: Array.isArray(links) ? links.length : 0,
        commissionPending: Array.isArray(commissions) ? commissions.filter(c => c.status === 'pending').reduce((s, c) => s + (c.amount || 0), 0) : 0,
        commissionApproved: Array.isArray(commissions) ? commissions.filter(c => c.status === 'approved').reduce((s, c) => s + (c.amount || 0), 0) : 0,
        walletBalance: wallet.balance || wallet.current_balance || 0,
        walletPending: wallet.pending_balance || wallet.pending || 0,
        clicks: affStats.clicks || affStats.total_clicks || 0,
        conversions: affStats.conversions || affStats.total_conversions || 0,
      });
    } catch (err) { setError('Fehler beim Laden der Statistiken'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) return <div className="p-6 flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin" style={{color:'var(--color-accent)'}} /></div>;
  if (error) return <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]" style={{color:'var(--color-danger)'}}><p>{error}</p></div>;

  const kpis = [
    { label: t('affiliate.links', 'Trackinglinks'), value: stats?.linkCount || 0, icon: ExternalLink, color: '#3182CE' },
    { label: t('affiliate.clicks', 'Klicks'), value: stats?.clicks || 0, icon: MousePointerClick, color: '#F59E0B' },
    { label: t('affiliate.conversions', 'Buchungen'), value: stats?.conversions || 0, icon: ShoppingCart, color: '#38A169' },
    { label: t('affiliate.pending_commission', 'Offene Provision'), value: `${(stats?.commissionPending || 0).toFixed(2)} €`, icon: Percent, color: '#F59E0B' },
    { label: t('affiliate.approved_commission', 'Bestätigte Provision'), value: `${(stats?.commissionApproved || 0).toFixed(2)} €`, icon: Wallet, color: '#38A169' },
    { label: t('affiliate.wallet_balance', 'Wallet'), value: `${(stats?.walletBalance || 0).toFixed(2)} €`, icon: Wallet, color: '#3182CE' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{color:'var(--color-text-primary)'}}>{t('affiliate.dashboard', 'Affiliate Dashboard')}</h1>
        <p className="text-sm mt-1" style={{color:'var(--color-text-secondary)'}}>{t('affiliate.dashboard_desc', 'Deine Marketing-Performance auf einen Blick')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="transition-all duration-150 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{color:'var(--color-text-secondary)'}}>{kpi.label}</p>
                <kpi.icon size={20} style={{color: kpi.color}} />
              </div>
              <p className="text-2xl font-bold mt-2" style={{color:'var(--color-text-primary)'}}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
