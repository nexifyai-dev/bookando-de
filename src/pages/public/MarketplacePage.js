import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import SEOHead from '../../components/shared/SEOHead';
import PublicNav from '../../components/layout/PublicNav';
import PublicFooter from '../../components/layout/PublicFooter';
import { Search, MapPin, Star, ArrowRight, Sparkles, Scissors, Palette, Droplet, Zap, Store, Loader2, AlertCircle } from 'lucide-react';
import { MarketplaceApi } from '../../lib/api';

/**
 * Generates initials from a vendor name
 * @param {string} name
 * @returns {string}
 */
const getInitials = (name) => {
  return name
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

/**
 * Generates a deterministic background color from a string
 * @param {string} name
 * @returns {string}
 */
const getAvatarColor = (name) => {
  const colors = [
    '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6',
    '#EF4444', '#8B5CF6', '#14B8A6', '#F97316', '#6366F1',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Renders star rating as JSX elements
 * @param {number} rating
 * @returns {JSX.Element[]}
 */
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} size={14} fill="var(--color-warning)" style={{ color: 'var(--color-warning)' }} />
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <span key={i} style={{ position: 'relative', display: 'inline-block' }}>
          <Star size={14} style={{ color: 'var(--color-divider)' }} />
          <span style={{ position: 'absolute', top: 0, left: 0, overflow: 'hidden', width: '50%' }}>
            <Star size={14} fill="var(--color-warning)" style={{ color: 'var(--color-warning)' }} />
          </span>
        </span>
      );
    } else {
      stars.push(
        <Star key={i} size={14} style={{ color: 'var(--color-divider)' }} />
      );
    }
  }
  return stars;
};

export default function MarketplacePage() {
  const { t, i18n } = useTranslation();

  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    let cancelled = false;
    MarketplaceApi.countries()
      .then(() => {
        // Countries endpoint indicates API is reachable; categories come from vendors
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Fetch vendors on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    MarketplaceApi.vendors()
      .then((data) => {
        if (!cancelled) {
          // data can be an array or { vendors: [...] }
          const vendorList = Array.isArray(data) ? data : (data.vendors || data.data || []);
          setVendors(vendorList);

          // Extract unique categories from vendor data
          const cats = new Set();
          vendorList.forEach(v => {
            if (v.category) cats.add(v.category);
          });
          setCategories([{ key: 'all', label: t('marketplace.filter_all', 'Alle'), icon: null }, ...Array.from(cats).map(c => ({ key: c, label: c, icon: '✦' }))]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Marketplace fetch error:', err);
          setError(err.message || t('marketplace.error_load', 'Fehler beim Laden der Daten.'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // Fallback categories if API doesn't return any
  const displayCategories = categories.length > 1 ? categories : [
    { key: 'all', label: t('marketplace.filter_all', 'Alle'), icon: null },
    { key: 'tattoo', label: t('marketplace.filter_tattoo', 'Tattoo'), icon: 'Sparkles' },
    { key: 'kosmetik', label: t('marketplace.filter_kosmetik', 'Kosmetik'), icon: '✦' },
    { key: 'friseur', label: t('marketplace.filter_friseur', 'Friseur'), icon: '✁' },
    { key: 'barber', label: t('marketplace.filter_barber', 'Barbershop'), icon: 'Scissors' },
    { key: 'nagel', label: t('marketplace.filter_nagel', 'Nagelstudio'), icon: '✦' },
    { key: 'laser', label: t('marketplace.filter_laser', 'Laser'), icon: '✦' },
  ];

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesCategory = activeCategory === 'all' || vendor.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const nameMatch = (vendor.name || '').toLowerCase().includes(query);
      const catMatch = (vendor.category || '').toLowerCase().includes(query);
      const descDe = (vendor.descriptionDe || vendor.description_de || vendor.description || '');
      const descEn = (vendor.descriptionEn || vendor.description_en || vendor.description || '');
      const descMatch = (i18n.language === 'de' ? descDe : descEn).toLowerCase().includes(query);
      const services = vendor.services || vendor.service_names || [];
      const serviceMatch = services.some((s) => (typeof s === 'string' ? s : s.name || s).toLowerCase().includes(query));
      const matchesSearch = !query || nameMatch || catMatch || descMatch || serviceMatch;
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, i18n.language, vendors]);

  return (
    <div>
      <SEOHead title="Bookando – Marketplace für Dienstleister" description="Finde den passenden Dienstleister in Aachen und Umgebung. Tattoo, Kosmetik, Friseur & mehr – mit Bookando." />
      <PublicNav />
      <main style={{ paddingTop: '96px', paddingBottom: '64px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '12px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {t('marketplace.title', 'Unser Marktplatz')}
            </h1>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              {t('marketplace.subtitle', 'Finde die besten Dienstleister in Aachen und Umgebung. Von Tattoo-Studios bis Kosmetik.')}
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ maxWidth: '640px', margin: '0 auto 32px' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-tertiary)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('marketplace.search_placeholder', 'Dienstleistung, Kategorie oder Anbieter suchen...')}
                style={{
                  width: '100%',
                  height: '52px',
                  paddingLeft: '48px',
                  paddingRight: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-divider)',
                  backgroundColor: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxShadow: 'var(--shadow-e1)',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-divider)';
                  e.target.style.boxShadow = 'var(--shadow-e1)';
                }}
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ marginBottom: '40px' }}>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-text-tertiary)',
                marginBottom: '12px',
                textAlign: 'center',
              }}
            >
              {t('marketplace.categories', 'Kategorien')}
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      borderRadius: '9999px',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 500,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: isActive ? '#fff' : 'var(--color-text-primary)',
                      boxShadow: isActive ? 'var(--shadow-e2)' : 'var(--shadow-e1)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.target.style.backgroundColor = 'var(--color-primary-muted)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.target.style.backgroundColor = 'var(--color-surface)';
                    }}
                  >
                    {cat.key !== 'all' && <span style={{ fontSize: '0.8rem' }}>{cat.icon}</span>}
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem' }}>
                {t('marketplace.loading', 'Marktplatz wird geladen...')}
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <AlertCircle size={32} style={{ color: '#EF4444', margin: '0 auto 16px' }} />
              <p style={{ color: '#EF4444', fontSize: '0.9rem', marginBottom: '8px' }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-divider)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('common.retry', 'Erneut versuchen')}
              </button>
            </div>
          )}

          {/* Vendor Grid */}
          {!loading && !error && filteredVendors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <p style={{ color: 'var(--color-text-tertiary)', fontSize: '1rem' }}>
                {t('marketplace.no_results', 'Keine Ergebnisse gefunden.')}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: '24px',
              }}
            >
              {/* Responsive grid: 1 col base, 2 cols md, 3 cols lg */}
              <style>{`
                @media (min-width: 768px) {
                  .vendor-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (min-width: 1024px) {
                  .vendor-grid { grid-template-columns: repeat(3, 1fr) !important; }
                }
              `}</style>
              <div className="vendor-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: '24px',
              }}>
                {filteredVendors.map((vendor) => {
                  const description = vendor.descriptionDe || vendor.description_en || vendor.descriptionEn || vendor.description || '';
                  const avatarColor = getAvatarColor(vendor.name);
                  const initials = getInitials(vendor.name);

                  return (
                    <Link
                      key={vendor.id}
                      to="/auth/register"
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <div
                        style={{
                          border: '1px solid var(--color-divider)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '24px',
                          backgroundColor: 'var(--color-surface)',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          height: '100%',
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = 'var(--shadow-e3)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.borderColor = 'var(--color-primary-light)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'var(--color-divider)';
                        }}
                      >
                        {/* Vendor Header: Avatar + Name/Location */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: 'var(--radius-sm)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: avatarColor,
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              fontFamily: 'var(--font-heading)',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <h3
                              style={{
                                fontWeight: 600,
                                fontSize: '1rem',
                                color: 'var(--color-text-primary)',
                                margin: 0,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {vendor.name}
                            </h3>
                            <p
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-tertiary)',
                                margin: '2px 0 0 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <MapPin size={11} />
                              {vendor.location}
                            </p>
                          </div>
                        </div>

                        {/* Rating */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                            {renderStars(vendor.rating)}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            {vendor.rating.toFixed(1)}
                          </span>
                          {vendor.reviewCount != null && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>
                              ({vendor.reviewCount})
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.5,
                            margin: '0 0 16px 0',
                            flex: 1,
                          }}
                        >
                          {description}
                        </p>

                        {/* Services Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                          {(vendor.services || vendor.service_names || []).map((service, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.7rem',
                                padding: '3px 10px',
                                borderRadius: '9999px',
                                backgroundColor: 'var(--color-primary-muted)',
                                color: 'var(--color-primary)',
                                fontWeight: 500,
                              }}
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '10px 20px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--color-primary)',
                            color: '#fff',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            width: '100%',
                            boxSizing: 'border-box',
                            textDecoration: 'none',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                          }}
                        >
                          {t('marketplace.book_now', 'Jetzt buchen')}
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
