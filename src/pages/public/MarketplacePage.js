import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { Search, MapPin, Star, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { MarketplaceApi } from '../../lib/api';
import { cn } from '../../lib/utils-cn';

const getInitials = (name) => {
  if (!name) return '--';
  return name.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase();
};

const getAvatarColor = (name) => {
  const colors = ['#F59E0B', '#1A202C', '#D97706', '#2D3748', '#B07C00', '#2D3748'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const renderStars = (rating) => {
  const r = rating || 0;
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} size={14} fill="var(--color-warning)" style={{ color: 'var(--color-warning)' }} />);
    } else if (i === full && half) {
      stars.push(
        <span key={i} className="relative inline-block">
          <Star size={14} style={{ color: 'var(--color-divider)' }} />
          <span className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={14} fill="var(--color-warning)" style={{ color: 'var(--color-warning)' }} />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} size={14} style={{ color: 'var(--color-divider)' }} />);
    }
  }
  return stars;
};

const CategoryPill = ({ cat, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-1.5 px-[18px] py-2 rounded-full text-[0.85rem] border-none cursor-pointer transition-all duration-200',
      isActive ? 'font-semibold shadow-[var(--shadow-e2)]' : 'font-medium shadow-[var(--shadow-e1)]'
    )}
    style={{
      backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
      color: isActive ? '#fff' : 'var(--color-text-primary)',
    }}
    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-primary-muted)'; }}
    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-surface)'; }}
  >
    {cat.key !== 'all' && <span className="text-[0.8rem]">{cat.icon}</span>}
    {cat.label}
  </button>
);

const VendorCard = ({ vendor, t }) => {
  const description = vendor.descriptionDe || vendor.description_de || vendor.descriptionEn || vendor.description_en || vendor.description || '';
  const avatarColor = getAvatarColor(vendor.name);

  return (
    <Link
      to={`/marketplace/${vendor.id || vendor.slug}`}
      className="block no-underline group"
    >
      <div
        className="flex flex-col h-full p-6 rounded-[var(--radius-lg)] cursor-pointer transition-all duration-250"
        style={{
          border: '1px solid var(--color-divider)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div
            className="w-[50px] h-[50px] rounded-[var(--radius-sm)] flex items-center justify-center text-white font-bold shrink-0"
            style={{ backgroundColor: avatarColor, fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}
          >
            {getInitials(vendor.name)}
          </div>
          <div className="min-w-0">
            <h3 className="m-0 text-base font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
              {vendor.name}
            </h3>
            {vendor.location && (
              <p className="m-0 mt-0.5 flex items-center gap-1 text-[0.75rem]" style={{ color: 'var(--color-text-tertiary)' }}>
                <MapPin size={11} /> {vendor.location}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="flex items-center gap-px">{renderStars(vendor.rating)}</span>
          <span className="text-[0.75rem] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {vendor.rating ? vendor.rating.toFixed(1) : '0.0'}
          </span>
          {vendor.reviewCount != null && (
            <span className="text-[0.7rem]" style={{ color: 'var(--color-text-tertiary)' }}>
              ({vendor.reviewCount})
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="m-0 mb-4 text-[0.85rem] leading-[1.5] flex-1 line-clamp-3" style={{ color: 'var(--color-text-secondary)' }}>
            {description}
          </p>
        )}

        {/* Services */}
        {(vendor.services || vendor.service_names || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-[18px]">
            {(vendor.services || vendor.service_names || []).slice(0, 4).map((service, idx) => (
              <span key={idx} className="text-[0.7rem] px-[10px] py-[3px] rounded-full font-medium"
                style={{ backgroundColor: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}>
                {typeof service === 'string' ? service : service.name || service}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-center gap-1.5 w-full py-[10px] px-5 rounded-[var(--radius-md)] text-[0.85rem] font-semibold border-none cursor-pointer transition-all duration-200 group-hover:brightness-110"
          style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
          {t('marketplace.book_now', 'Jetzt buchen')}
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
};

export default function MarketplacePage() {
  const { t, i18n } = useTranslation();

  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Fetch vendors
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    MarketplaceApi.vendors()
      .then((data) => {
        if (!cancelled) {
          const vendorList = Array.isArray(data) ? data : (data.vendors || data.data || []);
          setVendors(vendorList);
          const cats = new Set();
          vendorList.forEach(v => { if (v.category) cats.add(v.category); });
          setCategories([
            { key: 'all', label: t('marketplace.filter_all', 'Alle'), icon: null },
            ...Array.from(cats).map(c => ({ key: c, label: c, icon: '✦' }))
          ]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error('Marketplace fetch error:', err);
          setError(err.message || t('marketplace.error_load', 'Fehler beim Laden der Daten.'));
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [t, reloadKey]);

  const displayCategories = categories.length > 1 ? categories : [
    { key: 'all', label: t('marketplace.filter_all', 'Alle'), icon: null },
    { key: 'tattoo', label: t('marketplace.filter_tattoo', 'Tattoo'), icon: '✦' },
    { key: 'kosmetik', label: t('marketplace.filter_kosmetik', 'Kosmetik'), icon: '✦' },
    { key: 'friseur', label: t('marketplace.filter_friseur', 'Friseur'), icon: '✦' },
    { key: 'barber', label: t('marketplace.filter_barber', 'Barbershop'), icon: '✦' },
    { key: 'nagel', label: t('marketplace.filter_nagel', 'Nagelstudio'), icon: '✦' },
    { key: 'laser', label: t('marketplace.filter_laser', 'Laser'), icon: '✦' },
  ];

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesCategory = activeCategory === 'all' || vendor.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;
      const nameMatch = (vendor.name || '').toLowerCase().includes(query);
      const catMatch = (vendor.category || '').toLowerCase().includes(query);
      const desc = (vendor.descriptionDe || vendor.description_de || vendor.descriptionEn || vendor.description_en || vendor.description || '');
      const descMatch = desc.toLowerCase().includes(query);
      const services = vendor.services || vendor.service_names || [];
      const serviceMatch = services.some((s) => (typeof s === 'string' ? s : s.name || '').toLowerCase().includes(query));
      return matchesCategory && (nameMatch || catMatch || descMatch || serviceMatch);
    });
  }, [activeCategory, searchQuery, vendors]);

  return (
    <div data-testid="marketplace-page">
      <SEOHead title={t('marketplace.seo_title', 'Bookando – Marketplace für Dienstleister')}
               description={t('marketplace.seo_desc', 'Finde den passenden Dienstleister in Aachen und Umgebung.')} />
      <PublicNav />

      <main className="pt-24 pb-16">
        <div className="max-w-[1280px] mx-auto px-6">

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold mb-3 tracking-[-0.02em]"
                style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
              {t('marketplace.title', 'Unser Marktplatz')}
            </h1>
            <p className="max-w-[560px] mx-auto leading-[1.6]" style={{ color: 'var(--color-text-secondary)' }}>
              {t('marketplace.subtitle', 'Finde die besten Dienstleister in Aachen und Umgebung.')}
            </p>
          </div>

          {/* Search */}
          <div className="max-w-[640px] mx-auto mb-8">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                     style={{ color: 'var(--color-text-tertiary)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('marketplace.search_placeholder', 'Dienstleistung, Kategorie oder Anbieter suchen...')}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full h-[52px] pl-12 pr-4 rounded-[var(--radius-md)] text-[0.875rem] outline-none transition-all duration-200"
                style={{
                  border: `1px solid ${searchFocused ? 'var(--color-primary)' : 'var(--color-divider)'}`,
                  backgroundColor: '#fff',
                  boxShadow: searchFocused
                    ? '0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent)'
                    : 'var(--shadow-e1)',
                }}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-10">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] mb-3 text-center"
               style={{ color: 'var(--color-text-tertiary)' }}>
              {t('marketplace.categories', 'Kategorien')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {displayCategories.map((cat) => (
                <CategoryPill key={cat.key} cat={cat} isActive={activeCategory === cat.key} onClick={() => setActiveCategory(cat.key)} />
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-16 px-6">
              <Loader2 size={32} className="animate-spin mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
              <p className="text-[0.9rem]" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('marketplace.loading', 'Marktplatz wird geladen...')}
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-16 px-6">
              <AlertCircle size={32} className="mx-auto mb-4" style={{ color: '#EF4444' }} />
              <p className="text-[0.9rem] mb-2" style={{ color: '#EF4444' }}>{error}</p>
              <button onClick={() => setReloadKey((k) => k + 1)}
                className="px-6 py-[10px] rounded-[var(--radius-md)] text-[0.85rem] font-semibold cursor-pointer"
                style={{ border: '1px solid var(--color-divider)', backgroundColor: 'var(--color-surface)', color: 'var(--color-primary)' }}>
                {t('common.retry', 'Erneut versuchen')}
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredVendors.length === 0 && (
            <div className="text-center py-16 px-6">
              <p className="text-base" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('marketplace.no_results', 'Keine Ergebnisse gefunden.')}
              </p>
            </div>
          )}

          {/* Vendor Grid */}
          {!loading && !error && filteredVendors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} t={t} />
              ))}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
