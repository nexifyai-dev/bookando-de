import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Palette, Globe, Upload, Check, X, Loader2, AlertCircle, Image, Link, Trash2
} from 'lucide-react';
import { BrandingApi, UploadsApi } from '../../lib/api';
import { toast } from 'sonner';

function ColorPicker({ label, value, onChange }) {
  return (
    <div data-testid="vendor-branding-page" className="flex items-center gap-3">
      <label className="text-[12px] font-semibold w-[100px]" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input type="color" value={value || '#1A202C'} onChange={e => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border-none"
          style={{ background: 'transparent' }} />
        <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
          className="w-[110px] px-3 py-2 text-[13px] rounded-lg outline-none"
          style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)', fontFamily: 'monospace' }} />
      </div>
    </div>
  );
}

function DomainRow({ domain, onDelete, onVerify }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg"
      style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider-subtle)' }}>
      <Globe size={14} style={{ color: domain.verified ? 'var(--color-success)' : 'var(--color-text-tertiary)' }} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
          {domain.domain}
        </p>
        <p className="text-[11px]" style={{ color: domain.verified ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>
          {domain.verified
            ? t('vendor.branding.verified', 'Verifiziert')
            : t('vendor.branding.pending_verification', 'Ausstehend')}
        </p>
      </div>
      <button onClick={() => onDelete(domain.id)}
        className="p-2 rounded-lg cursor-pointer hover:bg-[var(--color-danger-bg)] transition-colors"
        style={{ color: 'var(--color-text-tertiary)' }}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function VendorBrandingPage() {
  const { t } = useTranslation();

  const [branding, setBranding] = useState({
    logo_url: null,
    primary_color: '#1A202C',
    accent_color: '#F59E0B',
    company_name: '',
  });
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [newDomain, setNewDomain] = useState('');
  const fileInputRef = useRef(null);

  const fetchBranding = async () => {
    setLoading(true);
    setError(null);
    try {
      const [brandData, domainData] = await Promise.allSettled([
        BrandingApi.get(),
        BrandingApi.listDomains(),
      ]);
      if (brandData.status === 'fulfilled' && brandData.value) {
        setBranding({
          logo_url: brandData.value.logo_url || null,
          primary_color: brandData.value.primary_color || '#1A202C',
          accent_color: brandData.value.accent_color || '#F59E0B',
          company_name: brandData.value.company_name || '',
        });
      }
      if (domainData.status === 'fulfilled') {
        setDomains(Array.isArray(domainData.value) ? domainData.value : (domainData.value.domains || []));
      }
    } catch (err) {
      setError(err.message || t('vendor.branding.load_error', 'Fehler beim Laden des Brandings.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBranding(); }, [t]);

  const handleSaveBranding = async () => {
    setSaving(true);
    try {
      await BrandingApi.update({
        logo_url: branding.logo_url,
        primary_color: branding.primary_color,
        accent_color: branding.accent_color,
        company_name: branding.company_name,
      });
      toast.success(t('vendor.branding.save_success', 'Branding gespeichert.'));
    } catch (err) {
      toast.error(err.message || t('vendor.branding.save_error', 'Fehler beim Speichern.'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await UploadsApi.uploadImage(file);
      const url = result.url || result.image_url || result.data?.url || '';
      setBranding(prev => ({ ...prev, logo_url: url }));
      toast.success(t('vendor.branding.logo_uploaded', 'Logo hochgeladen.'));
    } catch (err) {
      toast.error(err.message || t('vendor.branding.upload_error', 'Fehler beim Hochladen.'));
    } finally {
      setUploading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    try {
      await BrandingApi.addDomain(newDomain.trim());
      toast.success(t('vendor.branding.domain_added', 'Domain hinzugefügt.'));
      setNewDomain('');
      const data = await BrandingApi.listDomains();
      setDomains(Array.isArray(data) ? data : (data.domains || []));
    } catch (err) {
      toast.error(err.message || t('vendor.branding.domain_error', 'Fehler beim Hinzufügen.'));
    }
  };

  const handleDeleteDomain = async (id) => {
    try {
      await BrandingApi.deleteDomain(id);
      toast.success(t('vendor.branding.domain_removed', 'Domain entfernt.'));
      setDomains(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      toast.error(err.message || t('vendor.branding.domain_error', 'Fehler beim Entfernen.'));
    }
  };

  return (
    <div style={{ background: 'var(--color-shell-bg)', minHeight: '100vh' }}>
      <div className="w2g-page-header">
        <div>
          <h1 className="w2g-page-title">{t('vendor.branding.title', 'Branding & WhiteLabel')}</h1>
          <p className="w2g-page-subtitle">{t('vendor.branding.subtitle', 'Passe das Erscheinungsbild deiner Plattform an.')}</p>
        </div>
        <button onClick={handleSaveBranding} disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg text-white border-none cursor-pointer disabled:opacity-60"
          style={{ background: 'var(--color-primary)' }}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {t('vendor.branding.save', 'Speichern')}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20">
          <AlertCircle size={40} style={{ color: '#EF4444', margin: '0 auto 16px' }} />
          <p style={{ color: '#EF4444', fontSize: '0.9rem' }}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="w2g-page-stack">
          {/* Logo Upload */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Image size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.branding.logo', 'Logo')}
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center overflow-hidden"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)' }}>
                {branding.logo_url ? (
                  <img src={branding.logo_url} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Image size={28} style={{ color: 'var(--color-text-tertiary)', opacity: 0.4 }} />
                )}
              </div>
              <div>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)', color: 'var(--color-text-secondary)' }}>
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {branding.logo_url ? t('vendor.branding.change_logo', 'Logo ändern') : t('vendor.branding.upload_logo', 'Logo hochladen')}
                </button>
                {branding.logo_url && (
                  <button onClick={() => setBranding(prev => ({ ...prev, logo_url: null }))}
                    className="flex items-center gap-1 mt-2 text-[11px] font-medium cursor-pointer"
                    style={{ color: 'var(--color-danger)' }}>
                    <Trash2 size={11} /> {t('vendor.branding.remove_logo', 'Entfernen')}
                  </button>
                )}
                <p className="text-[11px] mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('vendor.branding.logo_hint', 'Empfohlen: PNG oder SVG, min. 512x512px')}
                </p>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Palette size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                {t('vendor.branding.colors', 'Farben')}
              </h2>
            </div>

            <div className="space-y-3">
              <ColorPicker label={t('vendor.branding.primary_color', 'Primärfarbe')}
                value={branding.primary_color} onChange={v => setBranding(prev => ({ ...prev, primary_color: v }))} />
              <ColorPicker label={t('vendor.branding.accent_color', 'Akzentfarbe')}
                value={branding.accent_color} onChange={v => setBranding(prev => ({ ...prev, accent_color: v }))} />
              <div>
                <label className="text-[12px] font-semibold mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>
                  {t('vendor.branding.company_name', 'Firmenname')}
                </label>
                <input type="text" value={branding.company_name}
                  onChange={e => setBranding(prev => ({ ...prev, company_name: e.target.value }))}
                  className="w-full max-w-md px-3 py-2.5 text-[13px] rounded-lg outline-none"
                  style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>
          </div>

          {/* Custom Domain */}
          <div className="rounded-xl p-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-divider)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent-muted)' }}>
                <Globe size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h2 className="text-[14px] font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                  {t('vendor.branding.custom_domain', 'Eigene Domain')}
                </h2>
                <p className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('vendor.branding.custom_domain_hint', 'Verbinde deine eigene Domain für ein WhiteLabel-Erlebnis.')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input type="text" value={newDomain} onChange={e => setNewDomain(e.target.value)}
                placeholder="meine-domain.de"
                className="flex-1 px-3 py-2.5 text-[13px] rounded-lg outline-none"
                style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-divider)', color: 'var(--color-text-primary)' }} />
              <button onClick={handleAddDomain} disabled={!newDomain.trim()}
                className="px-4 py-2.5 text-[13px] font-semibold rounded-lg cursor-pointer disabled:opacity-50"
                style={{ background: 'var(--color-primary)', color: '#fff', border: 'none' }}>
                {t('vendor.branding.add_domain', 'Hinzufügen')}
              </button>
            </div>

            {domains.length > 0 && (
              <div className="space-y-2">
                {domains.map((d, i) => (
                  <DomainRow key={d.id || i} domain={d} onDelete={handleDeleteDomain} />
                ))}
              </div>
            )}

            {domains.length === 0 && (
              <p className="text-[12px]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('vendor.branding.no_domains', 'Noch keine eigenen Domains hinzugefügt.')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
