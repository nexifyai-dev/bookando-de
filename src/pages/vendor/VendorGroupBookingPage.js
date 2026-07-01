import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, Loader2, AlertCircle, CheckCircle, ToggleLeft, ToggleRight,
  Save, UserPlus, Clock, DollarSign, ListOrdered,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import DataTable from '../../components/dashboard/DataTable';
import StatCard from '../../components/dashboard/StatCard';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';

export default function VendorGroupBookingPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [groupSettings, setGroupSettings] = useState({});
  const [waitingList, setWaitingList] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/vendor/group-booking');
        if (!cancelled) {
          setServices(data.services || []);
          const settingsMap = {};
          (data.services || []).forEach(svc => {
            settingsMap[svc.id] = svc.groupBooking || {
              enabled: false,
              max_participants: 10,
              pricing_type: 'per_person',
              price_per_person: svc.price || 0,
              flat_rate: 0,
              waiting_list_enabled: false,
            };
          });
          setGroupSettings(settingsMap);
          setWaitingList(data.waitingList || []);
          setParticipants(data.participants || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || t('vendor.group.load_error', 'Fehler beim Laden.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [t]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      await apiClient.put('/api/vendor/group-booking', { groupSettings });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || t('vendor.group.save_error', 'Fehler beim Speichern.'));
    } finally {
      setSaving(false);
    }
  }, [groupSettings, t]);

  function updateSetting(svcId, field, value) {
    setGroupSettings(prev => ({
      ...prev,
      [svcId]: { ...prev[svcId], [field]: value },
    }));
  }

  function toggleService(svcId) {
    setGroupSettings(prev => ({
      ...prev,
      [svcId]: { ...prev[svcId], enabled: !prev[svcId]?.enabled },
    }));
  }

  const enabledCount = Object.values(groupSettings).filter(s => s?.enabled).length;
  const totalParticipants = participants.length;
  const totalWaiting = waitingList.length;

  const participantColumns = [
    { header: t('vendor.group.col_name', 'Name'), key: 'name' },
    { header: t('vendor.group.col_email', 'E-Mail'), key: 'email' },
    { header: t('vendor.group.col_service', 'Dienstleistung'), key: 'service_name' },
    { header: t('vendor.group.col_date', 'Datum'), key: 'date' },
    {
      header: t('vendor.group.col_status', 'Status'),
      key: 'status',
      render: (val) => (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
          val === 'confirmed' ? 'bg-success/[0.08] text-success' : 'bg-warning/[0.08] text-warning'
        }`}>
          {val === 'confirmed' ? t('vendor.group.confirmed', 'Bestätigt') : t('vendor.group.waiting', 'Warteliste')}
        </span>
      ),
    },
  ];

  const waitingColumns = [
    { header: t('vendor.group.col_position', 'Position'), key: 'position', render: (_, __, idx) => `#${(idx || 0) + 1}` },
    { header: t('vendor.group.col_name', 'Name'), key: 'name' },
    { header: t('vendor.group.col_email', 'E-Mail'), key: 'email' },
    { header: t('vendor.group.col_service', 'Dienstleistung'), key: 'service_name' },
    { header: t('vendor.group.col_registered', 'Angemeldet'), key: 'registered_at' },
  ];

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand" /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle size={40} className="text-danger mb-4" /><p className="text-sm text-gray-600">{error}</p>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('vendor.group.title', 'Gruppenbuchungen')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('vendor.group.subtitle', 'Gruppenbuchungen pro Dienstleistung konfigurieren.')}</p>
      </div>

      <DashboardGrid cols={4}>
        <StatCard icon={Users} label={t('vendor.group.stat_services', 'Aktive Gruppen')} value={enabledCount} color="brand" />
        <StatCard icon={UserPlus} label={t('vendor.group.stat_participants', 'Teilnehmer')} value={totalParticipants} color="success" />
        <StatCard icon={Clock} label={t('vendor.group.stat_waiting', 'Warteliste')} value={totalWaiting} color="warning" />
        <StatCard icon={ListOrdered} label={t('vendor.group.stat_total', 'Dienste gesamt')} value={services.length} color="info" />
      </DashboardGrid>

      {/* Tab Navigation */}
      <div className="flex gap-1 mt-6 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        {['settings', 'participants', 'waiting'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'settings' && t('vendor.group.tab_settings', 'Einstellungen')}
            {tab === 'participants' && t('vendor.group.tab_participants', 'Teilnehmer')}
            {tab === 'waiting' && t('vendor.group.tab_waiting', 'Warteliste')}
          </button>
        ))}
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <Users size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-400">{t('vendor.group.no_services', 'Keine Dienstleistungen vorhanden.')}</p>
            </div>
          ) : services.map(svc => {
            const gs = groupSettings[svc.id] || { enabled: false, max_participants: 10, pricing_type: 'per_person', price_per_person: 0, flat_rate: 0, waiting_list_enabled: false };
            return (
              <div key={svc.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{svc.name}</p>
                    <p className="text-xs text-gray-400">€{svc.price} · {svc.duration} min</p>
                  </div>
                  <button onClick={() => toggleService(svc.id)}>
                    {gs.enabled
                      ? <ToggleRight size={28} className="text-success" />
                      : <ToggleLeft size={28} className="text-gray-300" />}
                  </button>
                </div>

                {gs.enabled && (
                  <div className="space-y-4 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.group.max_participants', 'Max. Teilnehmer')}</label>
                        <input
                          type="number"
                          min={2}
                          value={gs.max_participants}
                          onChange={(e) => updateSetting(svc.id, 'max_participants', Number(e.target.value))}
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.group.pricing_type', 'Preismodell')}</label>
                        <select
                          value={gs.pricing_type}
                          onChange={(e) => updateSetting(svc.id, 'pricing_type', e.target.value)}
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                        >
                          <option value="per_person">{t('vendor.group.per_person', 'Pro Person')}</option>
                          <option value="flat_rate">{t('vendor.group.flat_rate', 'Pauschalpreis')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          {gs.pricing_type === 'per_person'
                            ? t('vendor.group.price_per_person', 'Preis pro Person (€)')
                            : t('vendor.group.flat_price', 'Pauschalpreis (€)')}
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={gs.pricing_type === 'per_person' ? gs.price_per_person : gs.flat_rate}
                          onChange={(e) => updateSetting(svc.id, gs.pricing_type === 'per_person' ? 'price_per_person' : 'flat_rate', Number(e.target.value))}
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{t('vendor.group.waiting_list', 'Warteliste')}</p>
                          <p className="text-xs text-gray-400">{t('vendor.group.waiting_list_desc', 'Warteliste wenn Gruppe voll ist.')}</p>
                        </div>
                      </div>
                      <button onClick={() => updateSetting(svc.id, 'waiting_list_enabled', !gs.waiting_list_enabled)}>
                        {gs.waiting_list_enabled
                          ? <ToggleRight size={28} className="text-success" />
                          : <ToggleLeft size={28} className="text-gray-300" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {t('common.save', 'Speichern')}
            </button>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-success font-medium">
                <CheckCircle size={16} /> {t('vendor.group.saved', 'Gespeichert')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <DataTable
          columns={participantColumns}
          data={participants}
          emptyText={t('vendor.group.no_participants', 'Keine Teilnehmer vorhanden.')}
          pageSize={15}
        />
      )}

      {/* Waiting List Tab */}
      {activeTab === 'waiting' && (
        <DataTable
          columns={waitingColumns}
          data={waitingList}
          emptyText={t('vendor.group.no_waiting', 'Warteliste ist leer.')}
          pageSize={15}
        />
      )}
    </div>
  );
}
