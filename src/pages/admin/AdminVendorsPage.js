import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Store, Search, Filter, Eye, EyeOff, ChevronDown,
  Loader2, AlertCircle, RefreshCw, ExternalLink, Star
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

/* ── Helpers ── */
function formatDate(dateStr) {
  if (!dateStr) return '–';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatNumber(num) {
  if (num === undefined || num === null) return '–';
  return new Intl.NumberFormat('de-DE').format(num);
}

/* ── Detail Modal ── */
function VendorDetailModal({ vendor, onClose }) {
  const { t } = useTranslation();
  if (!vendor) return null;

  return (
    <div data-testid="admin-vendors-page"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl p-6 animate-slide-up space-y-4"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-modal)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {vendor.name || vendor.business_name || '–'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-sunken)]">
            <EyeOff size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-[13px]">
          <div>
            <p className="text-[11px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('admin.vendors.detail_id', 'ID')}
            </p>
            <p style={{ color: 'var(--color-text-primary)' }}>{vendor.id || '–'}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('admin.vendors.detail_email', 'E-Mail')}
            </p>
            <p style={{ color: 'var(--color-text-primary)' }}>{vendor.email || vendor.contact_email || '–'}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('admin.vendors.detail_status', 'Status')}
            </p>
            <Badge variant={vendor.is_active ? 'success' : 'muted'} size="sm">
              {vendor.is_active ? t('common.active', 'Aktiv') : t('common.inactive', 'Inaktiv')}
            </Badge>
          </div>
          <div>
            <p className="text-[11px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('admin.vendors.detail_created', 'Erstellt')}
            </p>
            <p style={{ color: 'var(--color-text-primary)' }}>{formatDate(vendor.created_at)}</p>
          </div>
        </div>

        {vendor.description && (
          <div>
            <p className="text-[11px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              {t('admin.vendors.detail_description', 'Beschreibung')}
            </p>
            <p className="text-[13px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>{vendor.description}</p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors"
            style={{ background: 'var(--color-primary)', color: '#fff' }}
          >
            {t('common.close', 'Schließen')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function AdminVendorsPage() {
  const { t } = useTranslation();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get('/api/admin/vendors').then(r => r.data);
      if (mountedRef.current) setVendors(Array.isArray(data) ? data : data?.vendors || data?.data || []);
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

  /* ── Toggle Status ── */
  const handleToggleStatus = async (vendorId, currentStatus) => {
    setActionLoading(vendorId);
    try {
      const endpoint = currentStatus ? 'deactivate' : 'activate';
      await apiClient.patch(`/api/admin/vendors/${vendorId}/${endpoint}`);
      await fetchData();
    } catch (err) {
      alert(err?.message || t('common.error_generic', 'Fehler.'));
    } finally {
      setActionLoading(null);
    }
  };

  /* ── Filter ── */
  const filtered = vendors.filter((v) => {
    const searchMatch = !searchTerm ||
      (v.name || v.business_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.email || v.contact_email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' ||
      (statusFilter === 'active' && v.is_active !== false) ||
      (statusFilter === 'inactive' && v.is_active === false);
    return searchMatch && statusMatch;
  });

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
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
  if (error && vendors.length === 0) {
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
          <h1 className="w2g-page-title">{t('admin.vendors.title', 'Vendor-Verwaltung')}</h1>
          <p className="w2g-page-subtitle">
            {t('admin.vendors.subtitle', 'Alle Vendors der Plattform verwalten.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">
            <Store size={12} />
            {filtered.length} / {vendors.length}
          </Badge>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                placeholder={t('admin.vendors.search', 'Vendor suchen…')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-[13px] rounded-lg outline-none transition-all"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-[12px] font-medium rounded-lg outline-none transition-all"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}
            >
              <option value="all">{t('admin.vendors.all_status', 'Alle Status')}</option>
              <option value="active">{t('common.active', 'Aktiv')}</option>
              <option value="inactive">{t('common.inactive', 'Inaktiv')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="px-1 pb-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-14 gap-3">
              <Store size={36} style={{ color: 'var(--color-text-tertiary)' }} />
              <p className="text-[14px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {t('admin.vendors.empty', 'Keine Vendors gefunden.')}
              </p>
            </div>
          ) : (
            <div>
              <div
                className="hidden md:flex items-center gap-4 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ color: 'var(--color-text-tertiary)', borderBottom: '1px solid var(--color-divider)' }}
              >
                <span className="flex-1 min-w-0">{t('admin.vendors.col_vendor', 'Vendor')}</span>
                <span className="w-[160px] shrink-0">{t('admin.vendors.col_email', 'E-Mail')}</span>
                <span className="w-[80px] shrink-0 text-center">{t('admin.vendors.col_status', 'Status')}</span>
                <span className="w-[60px] shrink-0 text-center">{t('admin.vendors.col_rating', 'Bewertung')}</span>
                <span className="w-[100px] shrink-0 text-center">{t('admin.vendors.col_joined', 'Beigetreten')}</span>
                <span className="w-[100px] shrink-0 text-right">{t('admin.vendors.col_actions', 'Aktionen')}</span>
              </div>

              {filtered.map((v, i) => (
                <div
                  key={v.id || i}
                  className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 py-3 px-4 rounded-lg transition-colors hover:bg-[var(--color-surface-elevated)]"
                  style={{ borderBottom: '1px solid var(--color-divider-subtle)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {v.name || v.business_name || '–'}
                    </p>
                    <p className="text-[11px] md:hidden truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                      {v.email || v.contact_email || ''}
                    </p>
                  </div>

                  <p className="text-[12px] w-[160px] shrink-0 hidden md:block truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                    {v.email || v.contact_email || '–'}
                  </p>

                  <div className="w-[80px] shrink-0 flex justify-center">
                    <Badge variant={v.is_active ? 'success' : 'muted'} size="sm">
                      {v.is_active ? t('common.active', 'Aktiv') : t('common.inactive', 'Inaktiv')}
                    </Badge>
                  </div>

                  <div className="w-[60px] shrink-0 flex justify-center">
                    <div className="flex items-center gap-1">
                      <Star size={11} style={{ color: v.rating ? 'var(--color-accent)' : 'var(--color-text-tertiary)' }} />
                      <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        {v.rating ? v.rating.toFixed(1) : '–'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] w-[100px] shrink-0 text-center hidden md:block" style={{ color: 'var(--color-text-tertiary)' }}>
                    {formatDate(v.created_at)}
                  </p>

                  <div className="w-[100px] shrink-0 flex justify-end gap-1">
                    <button
                      onClick={() => setSelectedVendor(v)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'var(--color-text-tertiary)', background: 'var(--color-surface-sunken)' }}
                      title={t('admin.vendors.view_details', 'Details')}
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(v.id, v.is_active)}
                      disabled={actionLoading === v.id}
                      className="p-1.5 rounded-lg transition-colors disabled:opacity-50"
                      style={{
                        color: v.is_active ? 'var(--color-warning)' : 'var(--color-success)',
                        background: v.is_active ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
                      }}
                    >
                      {actionLoading === v.id
                        ? <Loader2 size={13} className="animate-spin" />
                        : v.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedVendor && (
        <VendorDetailModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
        />
      )}
    </div>
  );
}
