import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DollarSign, Loader2, AlertCircle, CheckCircle, Users, Percent,
  Plus, Trash2, Save, ChevronDown, ChevronUp, Banknote, CalendarClock,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import DataTable from '../../components/dashboard/DataTable';
import StatCard from '../../components/dashboard/StatCard';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';

const defaultTier = { min_bookings: 0, max_bookings: 10, rate: 10 };
const defaultCommission = { type: 'percentage', value: 15, tiers: [defaultTier], payout_schedule: 'monthly' };

export default function VendorEmployeeCommissionPage() {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [commissions, setCommissions] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [empRes, histRes] = await Promise.all([
          apiClient.get('/api/vendor/employee-commission'),
          apiClient.get('/api/vendor/employee-commission/history'),
        ]);
        if (!cancelled) {
          setEmployees(empRes.data.employees || []);
          const commMap = {};
          (empRes.data.employees || []).forEach(emp => {
            commMap[emp.id] = emp.commission || { ...defaultCommission };
          });
          setCommissions(commMap);
          setHistory(histRes.data || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || t('vendor.commission.load_error', 'Fehler beim Laden.'));
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
      await apiClient.put('/api/vendor/employee-commission', { commissions });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || t('vendor.commission.save_error', 'Fehler beim Speichern.'));
    } finally {
      setSaving(false);
    }
  }, [commissions, t]);

  function updateCommission(empId, field, value) {
    setCommissions(prev => ({
      ...prev,
      [empId]: { ...prev[empId], [field]: value },
    }));
  }

  function addTier(empId) {
    const current = commissions[empId]?.tiers || [];
    const lastMax = current.length > 0 ? current[current.length - 1].max_bookings : 0;
    setCommissions(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        tiers: [...current, { min_bookings: lastMax, max_bookings: lastMax + 10, rate: 10 }],
      },
    }));
  }

  function updateTier(empId, idx, field, value) {
    setCommissions(prev => {
      const tiers = [...(prev[empId]?.tiers || [])];
      tiers[idx] = { ...tiers[idx], [field]: Number(value) };
      return { ...prev, [empId]: { ...prev[empId], tiers } };
    });
  }

  function removeTier(empId, idx) {
    setCommissions(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        tiers: (prev[empId]?.tiers || []).filter((_, i) => i !== idx),
      },
    }));
  }

  const totalPaid = history.reduce((sum, h) => sum + (h.amount || 0), 0);
  const avgCommission = employees.length > 0
    ? employees.reduce((sum, emp) => sum + (commissions[emp.id]?.value || 0), 0) / employees.length
    : 0;

  const historyColumns = [
    { header: t('vendor.commission.col_employee', 'Mitarbeiter'), key: 'employee_name' },
    { header: t('vendor.commission.col_service', 'Dienstleistung'), key: 'service_name' },
    {
      header: t('vendor.commission.col_amount', 'Betrag'),
      key: 'amount',
      render: (val) => <span className="font-semibold text-gray-900">€{Number(val || 0).toFixed(2)}</span>,
    },
    { header: t('vendor.commission.col_date', 'Datum'), key: 'date' },
    {
      header: t('vendor.commission.col_status', 'Status'),
      key: 'status',
      render: (val) => (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
          val === 'paid' ? 'bg-success/[0.08] text-success' : 'bg-warning/[0.08] text-warning'
        }`}>
          {val === 'paid' ? t('vendor.commission.paid', 'Ausgezahlt') : t('vendor.commission.pending', 'Ausstehend')}
        </span>
      ),
    },
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
        <h1 className="text-title-lg text-gray-900">{t('vendor.commission.title', 'Mitarbeiterprovisionen')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('vendor.commission.subtitle', 'Provisionseinstellungen und Auszahlungen verwalten.')}</p>
      </div>

      <DashboardGrid cols={4}>
        <StatCard icon={Users} label={t('vendor.commission.stat_employees', 'Mitarbeiter')} value={employees.length} color="brand" />
        <StatCard icon={Percent} label={t('vendor.commission.stat_avg', 'Ø Provision')} value={`${avgCommission.toFixed(1)}%`} color="info" />
        <StatCard icon={DollarSign} label={t('vendor.commission.stat_paid', 'Ausgezahlt')} value={`€${totalPaid.toFixed(2)}`} color="success" />
        <StatCard icon={Banknote} label={t('vendor.commission.stat_history', 'Buchungen')} value={history.length} color="warning" />
      </DashboardGrid>

      {/* Employee Commission Settings */}
      <div className="mt-6 space-y-4">
        {employees.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <Users size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-400">{t('vendor.commission.no_employees', 'Keine Mitarbeiter vorhanden.')}</p>
          </div>
        ) : employees.map(emp => {
          const comm = commissions[emp.id] || defaultCommission;
          const expanded = expandedId === emp.id;
          return (
            <div key={emp.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setExpandedId(expanded ? null : emp.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand/[0.08] rounded-full flex items-center justify-center text-sm font-bold text-brand">
                    {emp.name?.charAt(0) || '?'}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{emp.name}</p>
                    <p className="text-xs text-gray-400">{emp.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">
                    {comm.type === 'tiered'
                      ? t('vendor.commission.type_tiered', 'Gestaffelt')
                      : comm.type === 'fixed'
                        ? `€${comm.value}`
                        : `${comm.value}%`}
                  </span>
                  {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </button>

              {expanded && (
                <div className="p-5 border-t border-gray-100 bg-gray-50/30">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.commission.type', 'Provisionstyp')}</label>
                      <select
                        value={comm.type}
                        onChange={(e) => updateCommission(emp.id, 'type', e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                      >
                        <option value="percentage">{t('vendor.commission.type_percentage', 'Prozent der Dienstleistung')}</option>
                        <option value="fixed">{t('vendor.commission.type_fixed', 'Fester Betrag pro Buchung')}</option>
                        <option value="tiered">{t('vendor.commission.type_tiered', 'Gestaffelt')}</option>
                      </select>
                    </div>
                    {comm.type !== 'tiered' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          {comm.type === 'percentage'
                            ? t('vendor.commission.value_pct', 'Prozentsatz (%)')
                            : t('vendor.commission.value_fixed', 'Betrag (€)')}
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={comm.value}
                          onChange={(e) => updateCommission(emp.id, 'value', Number(e.target.value))}
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.commission.payout', 'Auszahlung')}</label>
                      <select
                        value={comm.payout_schedule}
                        onChange={(e) => updateCommission(emp.id, 'payout_schedule', e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                      >
                        <option value="weekly">{t('vendor.commission.payout_weekly', 'Wöchentlich')}</option>
                        <option value="biweekly">{t('vendor.commission.payout_biweekly', 'Alle 2 Wochen')}</option>
                        <option value="monthly">{t('vendor.commission.payout_monthly', 'Monatlich')}</option>
                      </select>
                    </div>
                  </div>

                  {/* Tiered Commission */}
                  {comm.type === 'tiered' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-gray-900">{t('vendor.commission.tiers', 'Provisionsstufen')}</h3>
                        <button onClick={() => addTier(emp.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-brand/[0.08] text-brand rounded-lg hover:bg-brand/[0.15] transition-colors">
                          <Plus size={12} /> {t('vendor.commission.add_tier', 'Stufe hinzufügen')}
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(comm.tiers || []).map((tier, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-100">
                            <span className="text-xs text-gray-400 w-8">{idx + 1}.</span>
                            <input
                              type="number"
                              min={0}
                              value={tier.min_bookings}
                              onChange={(e) => updateTier(emp.id, idx, 'min_bookings', e.target.value)}
                              placeholder="Min"
                              className="w-20 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                            />
                            <span className="text-xs text-gray-400">–</span>
                            <input
                              type="number"
                              min={0}
                              value={tier.max_bookings}
                              onChange={(e) => updateTier(emp.id, idx, 'max_bookings', e.target.value)}
                              placeholder="Max"
                              className="w-20 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                            />
                            <span className="text-xs text-gray-400">{t('vendor.commission.bookings', 'Buchungen')}</span>
                            <input
                              type="number"
                              min={0}
                              value={tier.rate}
                              onChange={(e) => updateTier(emp.id, idx, 'rate', e.target.value)}
                              className="w-16 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                            />
                            <span className="text-xs text-gray-400">%</span>
                            <button onClick={() => removeTier(emp.id, idx)} className="p-1 rounded-lg hover:bg-danger-light transition-colors ml-auto">
                              <Trash2 size={12} className="text-danger" />
                            </button>
                          </div>
                        ))}
                        {(!comm.tiers || comm.tiers.length === 0) && (
                          <p className="text-xs text-gray-400 text-center py-4">{t('vendor.commission.no_tiers', 'Keine Stufen definiert.')}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Commission History */}
      <div className="mt-6 mb-5">
        <DataTable
          columns={historyColumns}
          data={history}
          emptyText={t('vendor.commission.no_history', 'Keine Provisionsbuchungen vorhanden.')}
          pageSize={10}
          className=""
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {t('common.save', 'Speichern')}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm text-success font-medium">
            <CheckCircle size={16} /> {t('vendor.commission.saved', 'Gespeichert')}
          </span>
        )}
      </div>
    </div>
  );
}
