import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarDays, RefreshCw, Loader2, AlertCircle, CheckCircle, XCircle,
  ArrowRightLeft, ArrowRight, Settings2, Trash2, Link2, Unlink, Clock,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';

const PROVIDERS = [
  { key: 'google', label: 'Google Calendar', icon: CalendarDays, color: 'text-blue-600 bg-blue-50' },
  { key: 'outlook', label: 'Outlook / Microsoft 365', icon: CalendarDays, color: 'text-blue-700 bg-blue-50' },
  { key: 'apple', label: 'Apple Calendar (CalDAV)', icon: CalendarDays, color: 'text-gray-700 bg-gray-50' },
];

const SYNC_DIRECTIONS = [
  { key: 'to_calendar', label: 'vendor.calendar_sync.dir_to_calendar', icon: ArrowRight, desc: 'vendor.calendar_sync.dir_to_calendar_desc' },
  { key: 'two_way', label: 'vendor.calendar_sync.dir_two_way', icon: ArrowRightLeft, desc: 'vendor.calendar_sync.dir_two_way_desc' },
];

const CONFLICT_STRATEGIES = [
  { key: 'bookando_wins', label: 'vendor.calendar_sync.conflict_bookando' },
  { key: 'calendar_wins', label: 'vendor.calendar_sync.conflict_calendar' },
  { key: 'newest_wins', label: 'vendor.calendar_sync.conflict_newest' },
];

function formatDate(dateStr) {
  if (!dateStr) return '–';
  try {
    return new Date(dateStr).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function VendorCalendarSyncPage() {
  const { t } = useTranslation();
  const [connections, setConnections] = useState({});
  const [settings, setSettings] = useState({
    sync_direction: 'to_calendar',
    conflict_strategy: 'newest_wins',
    sync_past_days: 30,
    sync_future_days: 90,
    auto_sync: true,
  });
  const [lastSync, setLastSync] = useState(null);
  const [syncing, setSyncing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/api/vendor/calendar-sync');
      if (data.connections) setConnections(data.connections);
      if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
      if (data.last_sync) setLastSync(data.last_sync);
    } catch (err) {
      setError(err.response?.data?.message || t('vendor.calendar_sync.load_error', 'Fehler beim Laden der Kalender-Einstellungen.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleConnect(providerKey) {
    setSyncing(providerKey);
    try {
      const { data } = await apiClient.post('/api/vendor/calendar-sync', {
        provider: providerKey,
        action: 'connect',
      });
      if (data.auth_url) {
        window.open(data.auth_url, '_blank', 'width=600,height=700');
      }
      setConnections(prev => ({
        ...prev,
        [providerKey]: { connected: true, connected_at: new Date().toISOString(), email: data.email || '' },
      }));
    } catch {
      // ponytail: toast
    } finally {
      setSyncing(null);
    }
  }

  async function handleDisconnect(providerKey) {
    setSyncing(providerKey);
    try {
      await apiClient.delete(`/api/vendor/calendar-sync/${providerKey}`);
      setConnections(prev => ({
        ...prev,
        [providerKey]: { connected: false, connected_at: null, email: '' },
      }));
    } catch {
      // ponytail: toast
    } finally {
      setSyncing(null);
    }
  }

  async function handleManualSync(providerKey) {
    setSyncing(providerKey);
    try {
      await apiClient.post('/api/vendor/calendar-sync', {
        provider: providerKey,
        action: 'sync',
      });
      setLastSync(new Date().toISOString());
    } catch {
      // ponytail: toast
    } finally {
      setSyncing(null);
    }
  }

  async function handleSaveSettings() {
    setSaving(true);
    try {
      await apiClient.post('/api/vendor/calendar-sync', { settings });
    } catch {
      // ponytail: toast
    } finally {
      setSaving(false);
    }
  }

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
        <div className="w-14 h-14 bg-danger-light rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={24} className="text-danger" />
        </div>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button onClick={fetchData}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">
          {t('vendor.calendar_sync.title', 'Kalender-Synchronisation')}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {t('vendor.calendar_sync.subtitle', 'Verbinden Sie Ihre Kalender und synchronisieren Sie Termine automatisch.')}
        </p>
      </div>

      {/* Last sync info */}
      {lastSync && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
          <Clock size={14} />
          <span>{t('vendor.calendar_sync.last_sync', 'Letzte Synchronisation')}: {formatDate(lastSync)}</span>
        </div>
      )}

      {/* Provider cards */}
      <div className="space-y-4 mb-8">
        {PROVIDERS.map((provider) => {
          const conn = connections[provider.key] || {};
          const isConnected = conn.connected;
          const isActionLoading = syncing === provider.key;
          const Icon = provider.icon;

          return (
            <div key={provider.key} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${provider.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{provider.label}</h3>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <CheckCircle size={12} className="text-success" />
                        <span className="text-xs text-gray-500">
                          {conn.email || t('vendor.calendar_sync.connected', 'Verbunden')}
                          {conn.connected_at && ` · ${formatDate(conn.connected_at)}`}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <XCircle size={12} className="text-gray-300" />
                        <span className="text-xs text-gray-400">
                          {t('vendor.calendar_sync.not_connected', 'Nicht verbunden')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isConnected && (
                    <>
                      <button
                        onClick={() => handleManualSync(provider.key)}
                        disabled={isActionLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                        title={t('vendor.calendar_sync.sync_now', 'Jetzt synchronisieren')}
                      >
                        {isActionLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <RefreshCw size={14} />
                        )}
                        {t('vendor.calendar_sync.sync', 'Sync')}
                      </button>
                      <button
                        onClick={() => handleDisconnect(provider.key)}
                        disabled={isActionLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-danger bg-danger-light rounded-lg hover:bg-danger/10 transition-colors disabled:opacity-50"
                      >
                        {isActionLoading ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Unlink size={14} />
                        )}
                        {t('vendor.calendar_sync.disconnect', 'Trennen')}
                      </button>
                    </>
                  )}
                  {!isConnected && (
                    <button
                      onClick={() => handleConnect(provider.key)}
                      disabled={isActionLoading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50"
                    >
                      {isActionLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Link2 size={14} />
                      )}
                      {t('vendor.calendar_sync.connect', 'Verbinden')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sync direction */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <ArrowRightLeft size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">
            {t('vendor.calendar_sync.direction_title', 'Synchronisationsrichtung')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SYNC_DIRECTIONS.map((dir) => {
            const DirIcon = dir.icon;
            return (
              <button
                key={dir.key}
                onClick={() => setSettings(prev => ({ ...prev, sync_direction: dir.key }))}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors text-left ${
                  settings.sync_direction === dir.key
                    ? 'border-brand bg-brand/5'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <DirIcon size={18} className={settings.sync_direction === dir.key ? 'text-brand' : 'text-gray-400'} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t(dir.label, dir.key)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t(dir.desc, '')}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conflict handling */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <Settings2 size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">
            {t('vendor.calendar_sync.conflict_title', 'Konfliktbehandlung')}
          </h2>
        </div>
        <div className="space-y-2 mb-5">
          {CONFLICT_STRATEGIES.map((strat) => (
            <label
              key={strat.key}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                settings.conflict_strategy === strat.key ? 'bg-brand/5 border border-brand/20' : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <input
                type="radio"
                name="conflict_strategy"
                value={strat.key}
                checked={settings.conflict_strategy === strat.key}
                onChange={() => setSettings(prev => ({ ...prev, conflict_strategy: strat.key }))}
                className="w-4 h-4 text-brand border-gray-300 focus:ring-brand/20"
              />
              <span className="text-sm text-gray-700">{t(strat.label, strat.key.replace(/_/g, ' '))}</span>
            </label>
          ))}
        </div>

        {/* Sync range */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {t('vendor.calendar_sync.range_title', 'Synchronisationsbereich')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t('vendor.calendar_sync.past_days', 'Vergangene Tage')}
              </label>
              <input
                type="number"
                min={0}
                max={365}
                value={settings.sync_past_days}
                onChange={(e) => setSettings(prev => ({ ...prev, sync_past_days: Number(e.target.value) }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t('vendor.calendar_sync.future_days', 'Zukünftige Tage')}
              </label>
              <input
                type="number"
                min={0}
                max={730}
                value={settings.sync_future_days}
                onChange={(e) => setSettings(prev => ({ ...prev, sync_future_days: Number(e.target.value) }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>
        </div>

        {/* Auto-sync toggle */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-gray-700">
                {t('vendor.calendar_sync.auto_sync', 'Automatische Synchronisation')}
              </span>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('vendor.calendar_sync.auto_sync_desc', 'Termine werden automatisch alle 15 Minuten synchronisiert.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettings(prev => ({ ...prev, auto_sync: !prev.auto_sync }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${settings.auto_sync ? 'bg-brand' : 'bg-gray-200'}`}
              role="switch"
              aria-checked={settings.auto_sync}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.auto_sync ? 'translate-x-5' : ''}`} />
            </button>
          </label>
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSaveSettings} disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
        {saving && <Loader2 size={16} className="animate-spin" />}
        {t('common.save', 'Speichern')}
      </button>
    </div>
  );
}
