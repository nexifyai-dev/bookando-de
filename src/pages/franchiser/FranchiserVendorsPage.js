import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Store, Plus, X, Search, Loader2, AlertCircle, RefreshCw,
  UserCheck, UserX, Mail, ChevronRight, Link2, Unlink
} from 'lucide-react';
import { FranchiseApi } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

/* ── Helpers ── */
function formatDate(dateStr) {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/* ── Main ── */
export default function FranchiserVendorsPage() {
  const { t } = useTranslation();

  const [franchise, setFranchise] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [attachModal, setAttachModal] = useState(false);
  const [vendorIdInput, setVendorIdInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await FranchiseApi.me();
      if (!mountedRef.current) return;
      setFranchise(me);

      if (me?.id) {
        const vData = await FranchiseApi.vendors(me.id);
        if (mountedRef.current) {
          setVendors(Array.isArray(vData) ? vData : vData?.vendors || []);
        }
      }
    } catch (err) {
      if (mountedRef.current) setError(err?.message || t('common.error_load', 'Fehler beim Laden.'));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  /* ── Attach Vendor ── */
  const handleAttach = async () => {
    if (!vendorIdInput.trim() || !franchise?.id) return;
    setActionLoading(true);
    try {
      await FranchiseApi.attachVendor(franchise.id, vendorIdInput.trim());
      setAttachModal(false);
      setVendorIdInput('');
      await fetchData();
    } catch (err) {
      alert(err?.message || t('common.error_generic', 'Fehler beim Hinzufügen.'));
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Detach Vendor ── */
  const handleDetach = async (vendorId, vendorName) => {
    if (!window.confirm(
      t('franchiser.vendors.confirm_detach', '{{name}} wirklich entfernen?', { name: vendorName || vendorId })
    )) return;
    if (!franchise?.id) return;
    setActionLoading(true);
    try {
      await FranchiseApi.detachVendor(franchise.id, vendorId);
      await fetchData();
    } catch (err) {
      alert(err?.message || t('common.error_generic', 'Fehler beim Entfernen.'));
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Filter ── */
  const filtered = vendors.filter(v =>
    !searchTerm ||
    (v.name || v.business_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.email || v.contact_email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ── Loading ── */
  if (loading) {
    return (
      <div data-testid="franchiser-vendors-page" className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('common.loading', 'Lade Vendors…')}
          </p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error && !franchise) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--color-danger-bg)' }}>
          <AlertCircle size={28} style={{ color: 'var(--color-danger)' }} />
        </div>
        <p className="text-[14px] font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-colors"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-primary)' }}
        >
          <RefreshCw size={14} />
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 pb-10">
      {/* Header */}
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('franchiser.vendors.title', 'Vendors verwalten')}</h1>
          <p className="w2g-page-subtitle">
            {t('franchiser.vendors.subtitle', 'Verwalte die angeschlossenen Vendors deines Franchises.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAttachModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-all"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
            }}
          >
            <Plus size={14} />
            {t('franchiser.vendors.add_vendor', 'Vendor hinzufügen')}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
        <input
          type="text"
          placeholder={t('franchiser.vendors.search', 'Vendor suchen…')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-[13px] rounded-lg outline-none transition-all"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-divider)',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>

      {/* Vendor Liste */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {t('franchiser.vendors.list_title', 'Vendors')}
              <span className="ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}>
                {filtered.length}
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-1 pb-1">
          {vendors.length === 0 ? (
            <div className="flex flex-col items-center py-14 gap-3">
              <Store size={36} style={{ color: 'var(--color-text-tertiary)' }} />
              <p className="text-[14px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {t('franchiser.vendors.empty', 'Noch keine Vendors angeschlossen.')}
              </p>
              <button
                onClick={() => setAttachModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold rounded-lg transition-all"
                style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}
              >
                <Plus size={13} />
                {t('franchiser.vendors.add_first', 'Ersten Vendor hinzufügen')}
              </button>
            </div>
          ) : filtered.length === 0 && searchTerm ? (
            <div className="flex flex-col items-center py-14 gap-2">
              <Search size={28} style={{ color: 'var(--color-text-tertiary)' }} />
              <p className="text-[13px]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('franchiser.vendors.no_search_results', 'Keine Vendors gefunden für "{{term}}"', { term: searchTerm })}
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div
                className="hidden sm:flex items-center gap-4 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-divider)' }}
              >
                <span className="w-6 shrink-0">#</span>
                <span className="flex-1">{t('franchiser.vendors.col_vendor', 'Vendor')}</span>
                <span className="w-[120px] shrink-0">{t('franchiser.vendors.col_email', 'E-Mail')}</span>
                <span className="w-[90px] shrink-0 text-center">{t('franchiser.vendors.col_status', 'Status')}</span>
                <span className="w-[80px] shrink-0 text-center">{t('franchiser.vendors.col_joined', 'Beigetreten')}</span>
                <span className="w-[40px] shrink-0" />
              </div>

              {filtered.map((v, i) => (
                <div
                  key={v.id || i}
                  className="flex items-center gap-4 py-3 px-4 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                  style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}
                >
                  <span className="text-[11px] font-medium w-6 shrink-0 hidden sm:block" style={{ color: 'var(--color-text-tertiary)' }}>
                    {i + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {v.name || v.business_name || t('common.unnamed', 'Unbenannt')}
                    </p>
                    <p className="text-[11px] sm:hidden truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                      {v.email || v.contact_email || ''}
                    </p>
                  </div>

                  <p className="text-[12px] w-[120px] shrink-0 hidden sm:block truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                    {v.email || v.contact_email || '–'}
                  </p>

                  <div className="w-[90px] shrink-0 flex justify-center">
                    <Badge variant={v.is_active ? 'success' : 'muted'} size="sm">
                      {v.is_active ? t('common.active', 'Aktiv') : t('common.inactive', 'Inaktiv')}
                    </Badge>
                  </div>

                  <p className="text-[11px] w-[80px] shrink-0 text-center hidden sm:block" style={{ color: 'var(--color-text-tertiary)' }}>
                    {formatDate(v.joined_at || v.created_at)}
                  </p>

                  <div className="w-[40px] shrink-0 flex justify-center">
                    <button
                      onClick={() => handleDetach(v.id, v.name || v.business_name)}
                      disabled={actionLoading}
                      className="p-1.5 rounded-lg transition-colors hover:bg-[var(--color-danger-bg)]"
                      title={t('franchiser.vendors.remove', 'Entfernen')}
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      <Unlink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Attach Modal ── */}
      {attachModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setAttachModal(false)}
        >
          <div
            className="w-full max-w-md rounded-xl p-6 animate-slide-up"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-modal)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('franchiser.vendors.attach_title', 'Vendor hinzufügen')}
              </h3>
              <button
                onClick={() => setAttachModal(false)}
                className="p-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-sunken)]"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-[12px] mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {t('franchiser.vendors.attach_desc', 'Gib die Vendor-ID ein, um einen Vendor mit deinem Franchise zu verbinden.')}
            </p>

            <input
              type="text"
              placeholder={t('franchiser.vendors.vendor_id_placeholder', 'Vendor-ID')}
              value={vendorIdInput}
              onChange={(e) => setVendorIdInput(e.target.value)}
              className="w-full px-4 py-2.5 text-[13px] rounded-lg mb-4 outline-none transition-all"
              style={{
                background: 'var(--color-surface-sunken)',
                border: '1px solid var(--color-divider)',
                color: 'var(--color-text-primary)',
              }}
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setAttachModal(false)}
                className="px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t('common.cancel', 'Abbrechen')}
              </button>
              <button
                onClick={handleAttach}
                disabled={actionLoading || !vendorIdInput.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg transition-all disabled:opacity-50"
                style={{ background: 'var(--color-primary)', color: '#fff' }}
              >
                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
                {t('franchiser.vendors.attach_btn', 'Verbinden')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
