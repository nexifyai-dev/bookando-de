import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users, Search, Mail, Calendar, Loader2, AlertCircle, Phone, MapPin, Edit3, Save, X,
  Tag, FileText, CheckCircle, Clock, User, MessageSquare
} from 'lucide-react';
import { formatAmount, formatDate } from '../../lib/utils';
import apiClient from '../../lib/apiClient';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';

const statusColors = {
  confirmed: { bg: 'rgba(196,155,62,0.12)', text: 'var(--color-accent)' },
  pending: { bg: 'rgba(74,144,201,0.12)', text: 'var(--color-primary-light)' },
  completed: { bg: 'rgba(74,222,128,0.12)', text: 'var(--color-success)' },
  cancelled: { bg: 'rgba(220,38,38,0.1)', text: 'var(--color-danger)' },
};

/* ─── Customer Detail Modal ─── */
function CustomerDetailModal({ customer, onClose }) {
  const { t } = useTranslation();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(customer?.notes || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(customer?.tags || []);

  const saveMutation = usePortalMutation({
    mutationFn: (payload) => apiClient.put(`/api/crm/contacts/${customer.id}`, payload),
    invalidateKeys: [['vendor', 'customers'], ['vendor', 'dashboard']],
  });

  const handleSaveNotes = () => {
    saveMutation.mutate({ notes });
    setEditingNotes(false);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setTagInput('');
      saveMutation.mutate({ tags: newTags });
    }
  };

  const removeTag = (tag) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    saveMutation.mutate({ tags: newTags });
  };

  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(12,29,46,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}>
      <div className="w-full max-w-2xl rounded-xl p-6 animate-fade-in max-h-[85vh] overflow-y-auto"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', boxShadow: 'var(--shadow-e4)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {t('vendor.customers.detail_title', 'Kundendetails')}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg" style={{ color: 'var(--color-text-tertiary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Stammdaten */}
        <div className="grid grid-cols-2 gap-4 text-[13px] mb-5">
          <div><p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.customers.name', 'Name')}</p>
            <p style={{ color: 'var(--color-text-primary)' }}>{customer.customer_name || customer.customer?.name || customer.customer?.first_name || '–'}</p></div>
          <div><p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.customers.email', 'E-Mail')}</p>
            <p style={{ color: 'var(--color-text-primary)' }}><Mail size={12} className="inline mr-1" />{customer.customer_email || customer.customer?.email || '–'}</p></div>
          <div><p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.customers.phone', 'Telefon')}</p>
            <p style={{ color: 'var(--color-text-primary)' }}>{customer.customer_phone || customer.customer?.phone || '–'}</p></div>
          <div><p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>{t('vendor.customers.total_bookings', 'Buchungen')}</p>
            <p style={{ color: 'var(--color-text-primary)' }}>{(customer.bookings?.length || customer.booking_count || 0)}</p></div>
        </div>

        {/* Tags */}
        <div className="mb-5">
          <p className="text-[12px] font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            <Tag size={12} className="inline mr-1" />{t('vendor.customers.tags', 'Tags')}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: 'var(--color-accent)' }}>
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:opacity-70">✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()}
              placeholder={t('vendor.customers.add_tag', 'Tag hinzufügen…')}
              className="flex-1 px-2 py-1 text-[12px] rounded-md outline-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            <button onClick={addTag} className="px-2 py-1 text-[12px] rounded-md font-medium text-white"
              style={{ backgroundColor: 'var(--color-accent)' }}>+</button>
          </div>
        </div>

        {/* Notizen */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              <FileText size={12} className="inline mr-1" />{t('vendor.customers.notes', 'Notizen')}
            </p>
            {!editingNotes ? (
              <button onClick={() => setEditingNotes(true)} className="text-[11px] flex items-center gap-1 px-2 py-0.5 rounded"
                style={{ color: 'var(--color-text-muted)' }}><Edit3 size={11} /> {t('common.edit', 'Bearbeiten')}</button>
            ) : (
              <button onClick={handleSaveNotes} className="text-[11px] flex items-center gap-1 px-2 py-0.5 rounded font-medium"
                style={{ color: 'var(--color-success)' }}>
                <Save size={11} /> {t('common.save', 'Speichern')}
              </button>
            )}
          </div>
          {editingNotes ? (
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full px-3 py-2 text-[13px] rounded-lg outline-none resize-none"
              style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
          ) : (
            <p className="text-[12px] leading-relaxed" style={{ color: notes ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
              {notes || t('vendor.customers.no_notes', 'Keine Notizen')}
            </p>
          )}
        </div>

        {/* Follow-Up Status */}
        <div className="mb-5">
          <p className="text-[12px] font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            <MessageSquare size={12} className="inline mr-1" />{t('vendor.customers.follow_up', 'Follow-Up')}
          </p>
          <select value={customer.follow_up || 'none'}
            className="w-full px-3 py-2 text-[13px] rounded-lg outline-none"
            style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }}
            onChange={e => saveMutation.mutate({ follow_up: e.target.value })}>
            <option value="none">{t('vendor.customers.follow_up_none', 'Kein Follow-Up')}</option>
            <option value="today">{t('vendor.customers.follow_up_today', 'Heute')}</option>
            <option value="3days">{t('vendor.customers.follow_up_3days', 'In 3 Tagen')}</option>
            <option value="week">{t('vendor.customers.follow_up_week', 'In 1 Woche')}</option>
            <option value="month">{t('vendor.customers.follow_up_month', 'In 1 Monat')}</option>
          </select>
        </div>

        {/* Buchungshistorie */}
        <div>
          <p className="text-[12px] font-semibold mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            <Calendar size={12} className="inline mr-1" />{t('vendor.customers.booking_history', 'Buchungshistorie')}
          </p>
          {(!customer.bookings || customer.bookings.length === 0) ? (
            <p className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>{t('vendor.customers.no_bookings', 'Keine Buchungen')}</p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {customer.bookings.slice().sort((a, b) => new Date(b.date || b.start_at) - new Date(a.date || a.start_at)).map(b => {
                const sc = statusColors[b.status] || statusColors.pending;
                return (
                  <div key={b.id} className="flex items-center justify-between p-2 rounded-md text-[12px]"
                    style={{ background: 'var(--color-surface-sunken)' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--color-text-primary)' }}>{formatDate(b.date || b.start_at)}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{b.service_name || b.service?.name || '–'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--color-text-secondary)' }}>{formatAmount(b.amount || b.price)}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: sc.bg, color: sc.text }}>{b.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DSGVO Hinweis */}
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--color-divider-subtle)' }}>
          <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            {t('vendor.customers.dsgvo_note', 'DSGVO: Datenexport und Löschung müssen über das Backend erfolgen.')}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function VendorCustomersPage() {
  const { t } = useTranslation();

  const { data: bookings = [], isLoading, error, refetch } = useAutoRefresh(
    ['vendor', 'customers'],
    () => apiClient.get('/api/crm/contacts').then(r => Array.isArray(r.data) ? r.data : []),
  );

  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Gruppiere Kontakte — nutze echte CRM-Daten wo vorhanden, sonst Booking-Backfill
  const customerMap = {};
  bookings.forEach(b => {
    const key = b.email || b.customer_email || b.id || 'unknown';
    if (!customerMap[key]) {
      customerMap[key] = {
        id: b.id,
        customer_name: b.first_name ? `${b.first_name} ${b.last_name || ''}`.trim() : b.customer_name || b.name || '–',
        customer_email: b.email || b.customer_email,
        customer_phone: b.phone || b.customer_phone,
        notes: b.notes || '',
        tags: b.tags || [],
        follow_up: b.follow_up || 'none',
        booking_count: 0,
        bookings: [],
      };
    }
    customerMap[key].booking_count += 1;
    customerMap[key].bookings.push(b);
  });

  let customers = Object.values(customerMap);

  if (search) {
    const q = search.toLowerCase();
    customers = customers.filter(c =>
      (c.customer_name || '').toLowerCase().includes(q) ||
      (c.customer_email || '').toLowerCase().includes(q) ||
      (c.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  customers.sort((a, b) => (b.bookings[0]?.created_at || '') > (a.bookings[0]?.created_at || '') ? 1 : -1);

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.customers.title', 'Kunden')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.customers.subtitle', 'Verwalte deine Kunden und Buchungen.')}</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} /></div>
      )}

      {!isLoading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: 'var(--color-danger)', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem' }}>{error?.message || 'Fehler'}</p>
          <button onClick={refetch} className="mt-4 px-6 py-2.5 text-[13px] font-semibold rounded-lg text-white" style={{ background: 'var(--color-primary)' }}>
            {t('common.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Search */}
          <div className="px-6 pb-4">
            <div className="relative max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-tertiary)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t('vendor.customers.search', 'Kunde suchen...')}
                className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
            </div>
          </div>

          {customers.length === 0 ? (
            <div className="text-center py-16">
              <Users size={48} style={{ color: 'var(--color-text-tertiary)', margin: '0 auto 16px', opacity: 0.4 }} />
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem' }}>
                {search ? t('vendor.customers.no_search_results', 'Keine Kunden gefunden.') : t('vendor.customers.empty', 'Noch keine Kunden.')}
              </p>
            </div>
          ) : (
            <div className="grid gap-2 px-6">
              {customers.map((c, i) => (
                <div key={c.customer_email || i}
                  onClick={() => setSelectedCustomer(c)}
                  className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-150"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-accent-muted)' }}>
                    <User size={16} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>{c.customer_name}</p>
                    <p className="text-[11px] truncate" style={{ color: 'var(--color-text-muted)' }}>{c.customer_email || ''}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.tags && c.tags.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full hidden sm:inline"
                        style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: 'var(--color-accent)' }}>
                        {c.tags.length} {t('vendor.customers.tags', 'Tags')}
                      </span>
                    )}
                    <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                      {c.booking_count} {t('vendor.customers.bookings', 'Buchungen')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
