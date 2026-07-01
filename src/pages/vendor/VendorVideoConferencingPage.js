import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Video, Loader2, AlertCircle, CheckCircle, XCircle, Link2, Unlink,
  Wifi, MonitorPlay, Settings2, Zap,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';

const PLATFORMS = [
  { key: 'zoom', label: 'Zoom', icon: Video, color: 'text-blue-500 bg-blue-50' },
  { key: 'google_meet', label: 'Google Meet', icon: MonitorPlay, color: 'text-green-600 bg-green-50' },
  { key: 'teams', label: 'Microsoft Teams', icon: MonitorPlay, color: 'text-purple-600 bg-purple-50' },
];

export default function VendorVideoConferencingPage() {
  const { t } = useTranslation();
  const [connections, setConnections] = useState({});
  const [defaultPlatform, setDefaultPlatform] = useState('zoom');
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/api/vendor/video-integrations');
      if (data.connections) setConnections(data.connections);
      if (data.default_platform) setDefaultPlatform(data.default_platform);
      if (data.auto_generate !== undefined) setAutoGenerate(data.auto_generate);
    } catch (err) {
      setError(err.response?.data?.message || t('vendor.video.load_error', 'Fehler beim Laden der Video-Integrationen.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleConnect(platformKey) {
    setTesting(platformKey);
    try {
      const { data } = await apiClient.post('/api/vendor/video-integrations', {
        platform: platformKey,
        action: 'connect',
      });
      if (data.auth_url) {
        window.open(data.auth_url, '_blank', 'width=600,height=700');
      }
      setConnections(prev => ({
        ...prev,
        [platformKey]: { connected: true, connected_at: new Date().toISOString() },
      }));
    } catch {
      // ponytail: toast
    } finally {
      setTesting(null);
    }
  }

  async function handleDisconnect(platformKey) {
    setTesting(platformKey);
    try {
      await apiClient.delete(`/api/vendor/video-integrations/${platformKey}`);
      setConnections(prev => ({
        ...prev,
        [platformKey]: { connected: false, connected_at: null },
      }));
      if (defaultPlatform === platformKey) {
        const fallback = PLATFORMS.find(p => p.key !== platformKey && connections[p.key]?.connected);
        if (fallback) setDefaultPlatform(fallback.key);
      }
    } catch {
      // ponytail: toast
    } finally {
      setTesting(null);
    }
  }

  async function handleTestConnection(platformKey) {
    setTesting(platformKey);
    setTestResult(null);
    try {
      const { data } = await apiClient.post('/api/vendor/video-integrations', {
        platform: platformKey,
        action: 'test',
      });
      setTestResult({ platform: platformKey, success: true, message: data.message || t('vendor.video.test_success', 'Verbindung erfolgreich!') });
    } catch (err) {
      setTestResult({ platform: platformKey, success: false, message: err.response?.data?.message || t('vendor.video.test_failed', 'Verbindung fehlgeschlagen.') });
    } finally {
      setTesting(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiClient.post('/api/vendor/video-integrations', {
        default_platform: defaultPlatform,
        auto_generate: autoGenerate,
      });
    } catch {
      // ponytail: toast
    } finally {
      setSaving(false);
    }
  }

  const connectedPlatforms = PLATFORMS.filter(p => connections[p.key]?.connected);

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
          {t('vendor.video.title', 'Video-Konferenz Integrationen')}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {t('vendor.video.subtitle', 'Verbinden Sie Video-Plattformen für automatische Meeting-Links.')}
        </p>
      </div>

      {/* Platform cards */}
      <div className="space-y-4 mb-8">
        {PLATFORMS.map((platform) => {
          const conn = connections[platform.key] || {};
          const isConnected = conn.connected;
          const isLoading = testing === platform.key;
          const Icon = platform.icon;
          const result = testResult?.platform === platform.key ? testResult : null;

          return (
            <div key={platform.key} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platform.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{platform.label}</h3>
                    {isConnected ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <CheckCircle size={12} className="text-success" />
                        <span className="text-xs text-gray-500">{t('vendor.video.connected', 'Verbunden')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <XCircle size={12} className="text-gray-300" />
                        <span className="text-xs text-gray-400">{t('vendor.video.not_connected', 'Nicht verbunden')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isConnected && (
                    <>
                      <button
                        onClick={() => handleTestConnection(platform.key)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Wifi size={14} />}
                        {t('vendor.video.test', 'Testen')}
                      </button>
                      <button
                        onClick={() => handleDisconnect(platform.key)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-danger bg-danger-light rounded-lg hover:bg-danger/10 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Unlink size={14} />}
                        {t('vendor.video.disconnect', 'Trennen')}
                      </button>
                    </>
                  )}
                  {!isConnected && (
                    <button
                      onClick={() => handleConnect(platform.key)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
                      {t('vendor.video.connect', 'Verbinden')}
                    </button>
                  )}
                </div>
              </div>

              {/* Test result */}
              {result && (
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm ${result.success ? 'bg-success-light text-success-dark' : 'bg-danger-light text-danger-dark'}`}>
                  {result.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {result.message}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state if nothing connected */}
      {connectedPlatforms.length === 0 && (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-8 text-center mb-8">
          <Video size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {t('vendor.video.no_connections', 'Noch keine Video-Plattform verbunden.')}
          </p>
        </div>
      )}

      {/* Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <Settings2 size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">
            {t('vendor.video.settings_title', 'Einstellungen')}
          </h2>
        </div>

        {/* Default platform */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {t('vendor.video.default_platform', 'Standard-Plattform')}
          </label>
          {connectedPlatforms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {connectedPlatforms.map((p) => {
                const PIcon = p.icon;
                return (
                  <button
                    key={p.key}
                    onClick={() => setDefaultPlatform(p.key)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                      defaultPlatform === p.key ? 'border-brand bg-brand/5' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <PIcon size={16} className={defaultPlatform === p.key ? 'text-brand' : 'text-gray-400'} />
                    <span className="text-sm font-medium text-gray-700">{p.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400">{t('vendor.video.connect_first', 'Bitte verbinden Sie zuerst eine Plattform.')}</p>
          )}
        </div>

        {/* Auto-generate toggle */}
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {t('vendor.video.auto_generate', 'Meeting-Links automatisch erstellen')}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 ml-[22px]">
              {t('vendor.video.auto_generate_desc', 'Für neue Online-Buchungen wird automatisch ein Meeting-Link generiert.')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAutoGenerate(!autoGenerate)}
            className={`relative w-11 h-6 rounded-full transition-colors ${autoGenerate ? 'bg-brand' : 'bg-gray-200'}`}
            role="switch"
            aria-checked={autoGenerate}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${autoGenerate ? 'translate-x-5' : ''}`} />
          </button>
        </label>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
        {saving && <Loader2 size={16} className="animate-spin" />}
        {t('common.save', 'Speichern')}
      </button>
    </div>
  );
}
