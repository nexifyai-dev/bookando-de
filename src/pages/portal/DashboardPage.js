import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageScaffold } from '../../components/layout/PageScaffold';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Users, Activity, TrendingUp, Clock } from 'lucide-react';

/**
 * DashboardPage — Beispielseite für das Portal
 * Kann als Vorlage für eigene Dashboard-Seiten verwendet werden.
 */
export default function DashboardPage() {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, label: 'Nutzer', value: '128', variant: 'info' },
    { icon: Activity, label: 'Aktiv', value: '47', variant: 'success' },
    { icon: TrendingUp, label: 'Wachstum', value: '+12%', variant: 'gold' },
    { icon: Clock, label: 'Ausstehend', value: '3', variant: 'warning' },
  ];

  return (
    <PageScaffold
      title={t('portal.dashboard', 'Dashboard')}
      subtitle="Willkommen zurück! Hier siehst du eine Übersicht."
      actions={<Badge variant="gold" size="sm">Live</Badge>}
    >
      {/* Statistik-Karten */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide">{stat.label}</p>
                    <p className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)] font-[var(--font-heading)] mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center"
                    style={{ background: 'var(--color-accent-muted)' }}>
                    <Icon size={20} style={{ color: 'var(--color-accent)' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Platzhalter für weitere Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Aktivität</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-[var(--color-divider-subtle)] last:border-0">
                  <div className="w-8 h-8 rounded-[var(--radius-xs)] flex items-center justify-center bg-[var(--color-surface-sunken)]">
                    <Users size={14} className="text-[var(--color-text-tertiary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">Aktivität #{i}</p>
                    <p className="text-[11px] text-[var(--color-text-tertiary)]">Vor {i * 5} Minuten</p>
                  </div>
                  <Badge variant="muted" size="xs">Neu</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schnellzugriff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Einstellungen', 'Profil', 'Hilfe', 'Export'].map((item) => (
                <button key={item}
                  className="px-4 py-3 text-[13px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-divider)] rounded-[var(--radius-sm)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-left">
                  {item}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageScaffold>
  );
}
