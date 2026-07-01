import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Receipt, Loader2, AlertCircle, CheckCircle, Plus, Trash2, Edit2,
  Save, ToggleLeft, ToggleRight, X,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import DataTable from '../../components/dashboard/DataTable';
import StatCard from '../../components/dashboard/StatCard';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';

const emptyTax = { name: '', rate: '', country: 'DE', included_in_price: false, show_on_invoice: true };

export default function VendorTaxesPage() {
  const { t } = useTranslation();
  const [taxes, setTaxes] = useState([]);
  const [vatNumber, setVatNumber] = useState('');
  const [includeTax, setIncludeTax] = useState(true);
  const [showOnInvoice, setShowOnInvoice] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyTax });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/vendor/taxes');
        if (!cancelled) {
          setTaxes(data.taxes || []);
          setVatNumber(data.vatNumber || '');
          setIncludeTax(data.includeTax ?? true);
          setShowOnInvoice(data.showOnInvoice ?? true);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || t('vendor.taxes.load_error', 'Fehler beim Laden.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [t]);

  function resetForm() {
    setForm({ ...emptyTax });
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(tax) {
    setForm({ name: tax.name, rate: tax.rate, country: tax.country, included_in_price: tax.included_in_price, show_on_invoice: tax.show_on_invoice });
    setEditingId(tax.id);
    setShowForm(true);
  }

  async function handleSaveTax() {
    if (!form.name || !form.rate) return;
    setSaving(true);
    try {
      if (editingId) {
        await apiClient.put(`/api/vendor/taxes/${editingId}`, form);
        setTaxes(prev => prev.map(t => t.id === editingId ? { ...t, ...form } : t));
      } else {
        const { data } = await apiClient.post('/api/vendor/taxes', form);
        setTaxes(prev => [...prev, data]);
      }
      resetForm();
    } catch (err) {
      setError(err.message || t('vendor.taxes.save_error', 'Fehler beim Speichern.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTax(id) {
    try {
      await apiClient.delete(`/api/vendor/taxes/${id}`);
      setTaxes(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message || t('vendor.taxes.delete_error', 'Fehler beim Löschen.'));
    }
  }

  async function handleSaveGlobal() {
    setSaving(true);
    try {
      await apiClient.put('/api/vendor/taxes/settings', { vatNumber, includeTax, showOnInvoice });
    } catch {
      // ponytail: toast
    } finally {
      setSaving(false);
    }
  }

  const totalRate = taxes.reduce((sum, t) => sum + (Number(t.rate) || 0), 0);

  const columns = [
    { header: t('vendor.taxes.col_name', 'Name'), key: 'name' },
    {
      header: t('vendor.taxes.col_rate', 'Satz'),
      key: 'rate',
      render: (val) => <span className="font-semibold">{val}%</span>,
    },
    { header: t('vendor.taxes.col_country', 'Land'), key: 'country' },
    {
      header: t('vendor.taxes.col_included', 'Inkl.'),
      key: 'included_in_price',
      render: (val) => val
        ? <CheckCircle size={16} className="text-success" />
        : <X size={16} className="text-gray-300" />,
    },
    {
      header: t('common.actions', 'Aktionen'),
      key: 'id',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleEdit(row)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Edit2 size={14} className="text-gray-500" />
          </button>
          <button onClick={() => handleDeleteTax(val)} className="p-1.5 rounded-lg hover:bg-danger-light transition-colors">
            <Trash2 size={14} className="text-danger" />
          </button>
        </div>
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
        <h1 className="text-title-lg text-gray-900">{t('vendor.taxes.title', 'Steuereinstellungen')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('vendor.taxes.subtitle', 'Steuersätze verwalten und MwSt. konfigurieren.')}</p>
      </div>

      <DashboardGrid cols={3}>
        <StatCard icon={Receipt} label={t('vendor.taxes.stat_count', 'Steuersätze')} value={taxes.length} color="brand" />
        <StatCard icon={Receipt} label={t('vendor.taxes.stat_total', 'Gesamtsatz')} value={`${totalRate.toFixed(1)}%`} color="info" />
        <StatCard
          icon={Receipt}
          label={t('vendor.taxes.stat_vat', 'USt-IdNr.')}
          value={vatNumber || '—'}
          color={vatNumber ? 'success' : 'warning'}
        />
      </DashboardGrid>

      {/* Global Tax Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">{t('vendor.taxes.global', 'Globale Einstellungen')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.taxes.vat_number', 'USt-IdNr.')}</label>
            <input
              type="text"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              placeholder="DE123456789"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">{t('vendor.taxes.include_toggle', 'Steuern im Preis enthalten')}</p>
              <p className="text-xs text-gray-400">{t('vendor.taxes.include_desc', 'Preise inklusive Steuern anzeigen.')}</p>
            </div>
            <button onClick={() => setIncludeTax(!includeTax)}>
              {includeTax ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-gray-300" />}
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">{t('vendor.taxes.invoice_toggle', 'Steuern auf Rechnung')}</p>
              <p className="text-xs text-gray-400">{t('vendor.taxes.invoice_desc', 'Steueraufschlüsselung auf Rechnungen anzeigen.')}</p>
            </div>
            <button onClick={() => setShowOnInvoice(!showOnInvoice)}>
              {showOnInvoice ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-gray-300" />}
            </button>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={handleSaveGlobal} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {t('common.save', 'Speichern')}
          </button>
        </div>
      </div>

      {/* Tax Rates Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900">{t('vendor.taxes.rates', 'Steuersätze')}</h2>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand/[0.08] text-brand rounded-lg hover:bg-brand/[0.15] transition-colors">
            <Plus size={14} /> {t('vendor.taxes.add', 'Steuersatz hinzufügen')}
          </button>
        </div>

        {showForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder={t('vendor.taxes.name_placeholder', 'z.B. MwSt.')}
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                placeholder={t('vendor.taxes.rate_placeholder', 'z.B. 19')}
                value={form.rate}
                onChange={(e) => setForm(prev => ({ ...prev, rate: e.target.value }))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <select
                value={form.country}
                onChange={(e) => setForm(prev => ({ ...prev, country: e.target.value }))}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="DE">Deutschland</option>
                <option value="AT">Österreich</option>
                <option value="CH">Schweiz</option>
                <option value="EU">EU (Standard)</option>
              </select>
              <div className="flex gap-2">
                <button onClick={handleSaveTax} disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {t('common.save', 'Speichern')}
                </button>
                <button onClick={resetForm}
                  className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  {t('common.cancel', 'Abbrechen')}
                </button>
              </div>
            </div>
          </div>
        )}

        <DataTable
          columns={columns}
          data={taxes}
          emptyText={t('vendor.taxes.empty', 'Keine Steuersätze vorhanden.')}
          pageSize={10}
        />
      </div>
    </div>
  );
}
