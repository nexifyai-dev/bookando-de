import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Loader2, AlertCircle, Globe } from 'lucide-react';
import apiClient from '../../lib/apiClient';

function seoScore({ meta_title, meta_description, slug }) {
  let score = 0;
  if (meta_title) {
    score += 30;
    if (meta_title.length >= 30 && meta_title.length <= 60) score += 10;
  }
  if (meta_description) {
    score += 30;
    if (meta_description.length >= 120 && meta_description.length <= 160) score += 10;
  }
  if (slug && slug.length > 0) score += 20;
  return Math.min(score, 100);
}

function scoreColor(s) {
  if (s >= 80) return 'text-success';
  if (s >= 50) return 'text-warning';
  return 'text-danger';
}

function scoreBg(s) {
  if (s >= 80) return 'bg-success';
  if (s >= 50) return 'bg-warning';
  return 'bg-danger';
}

export default function VendorSEOPage() {
  const { t } = useTranslation();
  const [seo, setSeo] = useState({ meta_title: '', meta_description: '', slug: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/api/vendor/seo');
        if (!cancelled) setSeo(prev => ({ ...prev, ...data }));
      } catch (err) {
        if (!cancelled) setError(err.message || t('vendor.seo.load_error', 'Fehler beim Laden.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [t]);

  async function handleSave() {
    setSaving(true);
    try {
      await apiClient.put('/api/vendor/seo', seo);
    } catch {
      // ponytail: toast
    } finally {
      setSaving(false);
    }
  }

  const score = useMemo(() => seoScore(seo), [seo]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-brand" /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle size={40} className="text-danger mb-4" /><p className="text-sm text-gray-600">{error}</p>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('vendor.seo.title', 'SEO-Einstellungen')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('vendor.seo.subtitle', 'Optimieren Sie Ihre Sichtbarkeit in Suchmaschinen.')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">{t('vendor.seo.meta_section', 'Meta-Informationen')}</h2>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.seo.meta_title_label', 'Meta-Titel')}</label>
              <input type="text" value={seo.meta_title || ''} maxLength={70}
                onChange={(e) => setSeo(prev => ({ ...prev, meta_title: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                placeholder={t('vendor.seo.meta_title_ph', 'Name Ihres Unternehmens')} />
              <p className="text-xs text-gray-400 mt-1">{(seo.meta_title || '').length}/60 {t('vendor.seo.characters', 'Zeichen')}</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.seo.meta_desc_label', 'Meta-Beschreibung')}</label>
              <textarea value={seo.meta_description || ''} maxLength={170} rows={3}
                onChange={(e) => setSeo(prev => ({ ...prev, meta_description: e.target.value }))}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 resize-none"
                placeholder={t('vendor.seo.meta_desc_ph', 'Beschreiben Sie Ihr Angebot in 1-2 Sätzen...')} />
              <p className="text-xs text-gray-400 mt-1">{(seo.meta_description || '').length}/160 {t('vendor.seo.characters', 'Zeichen')}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">{t('vendor.seo.slug_label', 'URL-Slug')}</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 shrink-0">bookando.de/marketplace/</span>
                <input type="text" value={seo.slug || ''}
                  onChange={(e) => setSeo(prev => ({ ...prev, slug: e.target.value.replace(/[^a-z0-9-]/g, '-').toLowerCase() }))}
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="mein-unternehmen" />
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50">
            {saving && <Loader2 size={16} className="animate-spin" />}
            {t('common.save', 'Speichern')}
          </button>
        </div>

        {/* Right: Score + Preview */}
        <div className="space-y-5">
          {/* Score */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
            <h3 className="text-sm font-bold text-gray-900 mb-3">{t('vendor.seo.score', 'SEO-Score')}</h3>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${score}, 100`}
                  className={scoreColor(score)} />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-xl font-extrabold ${scoreColor(score)}`}>{score}</span>
            </div>
            <p className="text-xs text-gray-400">
              {score >= 80 ? t('vendor.seo.score_good', 'Gut!') : score >= 50 ? t('vendor.seo.score_ok', 'Okay – Verbesserung möglich') : t('vendor.seo.score_bad', 'Verbesserung nötig')}
            </p>
          </div>

          {/* Google Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">{t('vendor.seo.preview', 'Google-Vorschau')}</h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-green-700 truncate">bookando.de/marketplace/{seo.slug || '...'}</p>
              <p className="text-base text-blue-700 font-medium truncate mt-0.5">{seo.meta_title || t('vendor.seo.preview_title', 'Ihr Unternehmenstitel')}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{seo.meta_description || t('vendor.seo.preview_desc', 'Ihre Meta-Beschreibung erscheint hier...')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
