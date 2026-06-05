import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Users, Calendar, TrendingUp, Wallet, Bell, Settings, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const stats = [
    { icon: Calendar, label: 'Buchungen', value: '12', variant: 'info' },
    { icon: TrendingUp, label: 'Umsatz (Monat)', value: '2.450 €', variant: 'success' },
    { icon: Users, label: 'Kunden', value: '48', variant: 'gold' },
    { icon: Wallet, label: 'Guthaben', value: '890 €', variant: 'warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-heading)]">
            {t('portal.dashboard', 'Dashboard')}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Willkommen zurück{user?.full_name ? `, ${user.full_name}` : ''}!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">Premium</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx}>
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide">{stat.label}</p>
                    <p className="text-[28px] font-bold tracking-tight text-[var(--color-text-primary)] font-[var(--font-heading)] mt-1">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                    <Icon size={20} style={{ color: 'var(--color-accent)' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Aktivität</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-[var(--color-divider-subtle)] last:border-0">
                  <div className="w-8 h-8 rounded-[var(--radius-xs)] flex items-center justify-center bg-[var(--color-surface-sunken)]">
                    <Calendar size={14} className="text-[var(--color-text-tertiary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">Neue Buchung #{i}</p>
                    <p className="text-[11px] text-[var(--color-text-tertiary)]">Vor {i * 10} Minuten</p>
                  </div>
                  <Badge variant="muted" size="xs">Neu</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Schnellzugriff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Calendar, label: 'Buchungen', href: '/portal/bookings' },
                { icon: Wallet, label: 'Wallet', href: '/portal/wallet' },
                { icon: Settings, label: 'Einstellungen', href: '/portal/settings' },
                { icon: Bell, label: 'Benachrichtigungen', href: '/portal/notifications' },
              ].map((item) => (
                <a key={item.label} href={item.href}
                  className="flex flex-col items-center gap-2 px-4 py-5 text-[13px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-divider)] rounded-[var(--radius-sm)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                  <item.icon size={20} />
                  {item.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Buchungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-divider)]">
                  <th className="text-left py-3 px-2 text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide">Datum</th>
                  <th className="text-left py-3 px-2 text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide">Kunde</th>
                  <th className="text-left py-3 px-2 text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide">Service</th>
                  <th className="text-left py-3 px-2 text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide">Status</th>
                  <th className="text-right py-3 px-2 text-[11px] font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide">Betrag</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-[var(--color-divider-subtle)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                    <td className="py-3 px-2 text-[13px]">01.06.2026</td>
                    <td className="py-3 px-2 text-[13px] font-medium">Kunde #{i}</td>
                    <td className="py-3 px-2 text-[13px] text-[var(--color-text-secondary)]">Service {i}</td>
                    <td className="py-3 px-2">
                      <Badge variant={i % 2 === 0 ? 'success' : 'warning'} size="xs">
                        {i % 2 === 0 ? 'Bestätigt' : 'Ausstehend'}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-[13px] text-right font-medium">{i * 49} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
