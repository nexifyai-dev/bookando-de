import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlansApi } from '../../lib/api';
import { Loader2, AlertCircle, CreditCard, Check, X, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

function formatDate(dateStr) {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AdminPlansPage() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      setLoading(true); setError(null);
      try {
        const data = await PlansApi.publicList();
        if (!cancelled) setPlans(Array.isArray(data) ? data : (data.plans || data.data || []));
      } catch (err) {
        if (!cancelled) setError(err?.message || t('common.error', 'Fehler beim Laden'));
      } finally { if (!cancelled) setLoading(false); }
    }
    fetch();
    return () => { cancelled = true; };
  }, [t]);

  if (loading) return (
    <div data-testid="admin-plans-page" className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} /></div>
  );

  if (error) return (
    <div className="text-center py-20">
      <AlertCircle size={40} className="mx-auto mb-4" style={{ color: 'var(--color-danger)' }} />
      <p className="text-sm mb-4" style={{ color: 'var(--color-danger)' }}>{error}</p>
      <button onClick={() => window.location.reload()} className="px-5 py-2 rounded-md border text-sm font-semibold cursor-pointer"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-divider)', color: 'var(--color-primary)' }}>
        {t('common.retry', 'Erneut versuchen')}
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
          {t('admin.plans.title', 'Abonnement-Pläne')}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          {t('admin.plans.subtitle', 'Übersicht aller verfügbaren Tarife')}
        </p>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <CreditCard size={40} style={{ color: 'var(--color-text-tertiary)' }} className="mb-4" />
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('admin.plans.no_plans', 'Keine Pläne gefunden.')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id || plan.tier} className="relative overflow-hidden">
              {plan.is_popular && (
                <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: 'var(--color-accent)' }}>
                  {t('admin.plans.popular', 'Beliebt')}
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{plan.name || plan.tier}</CardTitle>
                <div className="mt-2">
                  <span className="text-2xl font-extrabold" style={{ color: 'var(--color-primary)' }}>
                    {plan.price || plan.amount || 0}€
                  </span>
                  <span className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
                    /{plan.billing_period === 'yearly' ? t('admin.plans.year', 'Jahr') : t('admin.plans.month', 'Monat')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {plan.description || plan.tagline || ''}
                </p>
                {plan.features && Array.isArray(plan.features) && (
                  <ul className="space-y-2">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        <Check size={14} style={{ color: 'var(--color-success)' }} className="mt-0.5 shrink-0" />
                        <span>{typeof feat === 'string' ? feat : feat.name || feat.label || ''}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.tier && (
                    <Badge variant="outline">{plan.tier}</Badge>
                  )}
                  {plan.billing_period && (
                    <Badge variant="secondary">{plan.billing_period}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
