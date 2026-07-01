import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Loader2, AlertCircle, Eye, EyeOff, ExternalLink, BarChart3, MousePointerClick, Globe,
  ChevronDown, ChevronUp, X, Image, Type, MessageSquare, CalendarCheck, Save
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { useAutoRefresh, usePortalMutation } from '../../hooks/useAutoRefresh';
import StatCard from '../../components/dashboard/StatCard';
import DataTable from '../../components/dashboard/DataTable';
import { DashboardGrid, DashboardSection } from '../../components/dashboard/DashboardGrid';
import { toast } from 'sonner';

/* ── Landing Page Editor Modal ── */
function LandingPageEditor({ page, onClose, onSaved }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    hero_headline: page?.hero_headline || '',
    hero_subheadline: page?.hero_subheadline || '',
    hero_cta_text: page?.hero_cta_text || t('lp.default_cta', 'Jetzt buchen'),
    hero_bg_url: page?.hero_bg_url || '',
    show_services: page?.show_services !== false,
    show_testimonials: page?.show_testimonials !== false,
    show_booking_widget: page?.show_booking_widget !== false,
    custom_css: page?.custom_css || '',
  });

  const saveMut = usePortalMutation({
    mutationFn: (data) => page?.id
      ? apiClient.put(`/api/vendor/landing-pages/${page.id}`, data)
      : apiClient.post('/api/vendor/landing-pages', data),
    invalidateKeys: [['vendor', 'landing-pages']],
    onSuccess: () => { toast.success(t('lp.saved', 'Landingpage gespeichert')); onSaved(); },
    onError: () => toast.error(t('lp.save_error', 'Fehler beim Speichern')),
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-12 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mb-12">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">
            {page?.id ? t('lp.edit', 'Landingpage bearbeiten') : t('lp.create', 'Neue Landingpage')}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); saveMut.mutate(form); }} className="p-6 space-y-5">
          {/* Basics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('lp.title', 'Titel')}</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} required
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('lp.slug', 'URL-Slug')}</label>
              <input value={form.slug} onChange={e => set('slug', e.target.value)}
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand"
                placeholder="mein-salon" />
            </div>
          </div>

          {/* Hero Section */}
          <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
            <legend className="text-xs font-bold text-gray-700 px-1">{t('lp.hero_section', 'Hero-Bereich')}</legend>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('lp.headline', 'Überschrift')}</label>
              <input value={form.hero_headline} onChange={e => set('hero_headline', e.target.value)}
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">{t('lp.subheadline', 'Unterüberschrift')}</label>
              <input value={form.hero_subheadline} onChange={e => set('hero_subheadline', e.target.value)}
                className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('lp.cta_text', 'Button-Text')}</label>
                <input value={form.hero_cta_text} onChange={e => set('hero_cta_text', e.target.value)}
                  className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{t('lp.bg_url', 'Hintergrund-URL')}</label>
                <input value={form.hero_bg_url} onChange={e => set('hero_bg_url', e.target.value)}
                  className="w-full px-3 py-2 text-[13px] rounded-lg border border-gray-200 outline-none focus:border-brand"
                  placeholder="https://..." />
              </div>
            </div>
          </fieldset>

          {/* Toggles */}
          <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
            <legend className="text-xs font-bold text-gray-700 px-1">{t('lp.sections', 'Sektionen')}</legend>
            {[
              { key: 'show_services', label: t('lp.show_services', 'Leistungen anzeigen'), icon: CalendarCheck },
              { key: 'show_testimonials', label: t('lp.show_testimonials', 'Bewertungen anzeigen'), icon: MessageSquare },
              { key: 'show_booking_widget', label: t('lp.show_booking', 'Buchungs-Widget anzeigen'), icon: CalendarCheck },
            ].map(({ key, label, icon: Ic }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => set(key, !form[key])}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form[key] ? 'bg-brand' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form[key] ? 'translate-x-5' : ''}`} />
                </button>
                <Ic size={14} className="text-gray-400" />
                <span className="text-xs text-gray-700">{label}</span>
              </label>
            ))}
          </fieldset>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="h-9 px-4 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              {t('common.cancel', 'Abbrechen')}
            </button>
            <button type="submit" disabled={saveMut.isPending}
              className="h-9 px-4 text-xs font-medium rounded-lg bg-brand text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5">
              {saveMut.isPending && <Loader2 size={14} className="animate-spin" />}
              <Save size={14} /> {t('common.save', 'Speichern')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function VendorLandingPageBuilder() {
  const { t } = useTranslation();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editPage, setEditPage] = useState(null);

  const { data: pages = [], isLoading, isError } = useAutoRefresh(
    ['vendor', 'landing-pages'],
    () => apiClient.get('/api/vendor/landing-pages').then(r => Array.isArray(r.data) ? r.data : []),
  );

  const togglePublish = usePortalMutation({
    mutationFn: ({ id, status }) => apiClient.put(`/api/vendor/landing-pages/${id}`, { status }),
    invalidateKeys: [['vendor', 'landing-pages']],
    onSuccess: () => toast.success(t('lp.status_updated', 'Status aktualisiert')),
  });

  const totalViews = pages.reduce((s, p) => s + (p.views || 0), 0);
  const totalConversions = pages.reduce((s, p) => s + (p.conversions || 0), 0);
  const publishedCount = pages.filter(p => p.status === 'published').length;

  const openEditor = (page = null) => { setEditPage(page); setEditorOpen(true); };

  const columns = [
    { key: 'title', header: t('lp.title', 'Titel'), render: (v, row) => (
      <span className="font-medium text-gray-900">{v || row.slug || '—'}</span>
    )},
    { key: 'status', header: t('lp.status', 'Status'), render: (v) => (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${v === 'published' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'}`}>
        {v === 'published' ? <Eye size={12} /> : <EyeOff size={12} />}
        {v === 'published' ? t('lp.published', 'Veröffentlicht') : t('lp.draft', 'Entwurf')}
      </span>
    )},
    { key: 'views', header: t('lp.views', 'Aufrufe'), render: v => (v || 0).toLocaleString() },
    { key: 'conversions', header: t('lp.conversions', 'Konversionen'), render: v => (v || 0).toLocaleString() },
    { key: 'actions', header: '', render: (_, row) => (
      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
        <button onClick={() => togglePublish.mutate({ id: row.id, status: row.status === 'published' ? 'draft' : 'published' })}
          title={row.status === 'published' ? t('lp.unpublish', 'Veröffentlichung aufheben') : t('lp.publish', 'Veröffentlichen')}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand transition-colors">
          {row.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        {row.status === 'published' && (
          <a href={`/lp/${row.slug || row.id}`} target="_blank" rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand transition-colors">
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    )},
  ];

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 size={32} className="animate-spin text-brand" /></div>;
  if (isError) return <div className="flex items-center justify-center min-h-[60vh] text-danger"><AlertCircle size={20} className="mr-2" />{t('common.error', 'Fehler beim Laden')}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-title-lg text-gray-900">{t('lp.title_page', 'Landingpages')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('lp.desc', 'Erstelle und verwalte deine Landingpages')}</p>
        </div>
        <button onClick={() => openEditor()}
          className="h-9 px-4 text-xs font-semibold rounded-lg bg-brand text-white hover:opacity-90 flex items-center gap-1.5">
          <Plus size={14} /> {t('lp.create', 'Neue Landingpage')}
        </button>
      </div>

      <DashboardGrid cols={3} className="mb-6">
        <StatCard icon={Globe} label={t('lp.pages_count', 'Seiten')} value={pages.length} color="brand" />
        <StatCard icon={Eye} label={t('lp.total_views', 'Gesamtaufrufe')} value={totalViews.toLocaleString()} color="info" />
        <StatCard icon={MousePointerClick} label={t('lp.total_conversions', 'Konversionen gesamt')} value={totalConversions.toLocaleString()} color="success" />
      </DashboardGrid>

      <DashboardSection title={t('lp.all_pages', 'Alle Landingpages')}>
        <DataTable
          columns={columns}
          data={pages}
          emptyText={t('lp.empty', 'Noch keine Landingpages erstellt')}
          onRowClick={(row) => openEditor(row)}
        />
      </DashboardSection>

      {editorOpen && (
        <LandingPageEditor
          page={editPage}
          onClose={() => { setEditorOpen(false); setEditPage(null); }}
          onSaved={() => { setEditorOpen(false); setEditPage(null); }}
        />
      )}
    </div>
  );
}
