import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Heart, Star, CalendarCheck, Loader2, AlertCircle, Trash2, MapPin, Tag, Search
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import { DashboardGrid } from '../../components/dashboard/DashboardGrid';

function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function FavoriteCard({ vendor, onRemove }) {
  const { t } = useTranslation();
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await onRemove(vendor.id || vendor._id);
    } catch {
      setRemoving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-card-hover transition-shadow group">
      {/* Image / avatar */}
      <div className="h-36 bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center relative">
        {vendor.image || vendor.avatar || vendor.logo ? (
          <img
            src={vendor.image || vendor.avatar || vendor.logo}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-brand/40">{getInitials(vendor.name)}</span>
        )}
        <button
          onClick={handleRemove}
          disabled={removing}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-lg text-gray-400 hover:text-danger opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
          title={t('customer.favorites.remove', 'Entfernen')}
        >
          {removing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-900 truncate">{vendor.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          {vendor.category && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Tag size={12} /> {vendor.category}
            </span>
          )}
          {vendor.rating != null && (
            <span className="flex items-center gap-1 text-xs text-warning">
              <Star size={12} fill="currentColor" /> {Number(vendor.rating).toFixed(1)}
            </span>
          )}
        </div>
        {vendor.address && (
          <p className="flex items-center gap-1 text-xs text-gray-400 mt-1 truncate">
            <MapPin size={12} /> {vendor.address}
          </p>
        )}

        <Link
          to={`/marketplace/${vendor.slug || vendor.id}`}
          className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-hover transition-colors"
        >
          <CalendarCheck size={14} />
          {t('customer.favorites.book_now', 'Jetzt buchen')}
        </Link>
      </div>
    </div>
  );
}

export default function CustomerFavoritesPage() {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get('/api/favorites');
      setFavorites(Array.isArray(data) ? data : data.favorites || data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || t('customer.favorites.load_error', 'Fehler beim Laden der Favoriten.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const handleRemove = async (id) => {
    try {
      await apiClient.delete(`/api/favorites/${id}`);
      setFavorites((prev) => prev.filter((v) => (v.id || v._id) !== id));
    } catch (err) {
      throw err;
    }
  };

  const filtered = favorites.filter((v) =>
    !search || v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 bg-danger-light rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={24} className="text-danger" />
        </div>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchFavorites}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-title-lg text-gray-900">
            {t('customer.favorites.title', 'Meine Favoriten')}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {t('customer.favorites.subtitle', 'Deine gespeicherten Anbieter.')}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder={t('customer.favorites.search', 'Favoriten durchsuchen...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Heart size={28} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            {search
              ? t('customer.favorites.no_results', 'Keine Favoriten für diese Suche.')
              : t('customer.favorites.empty', 'Du hast noch keine Favoriten gespeichert.')}
          </p>
          {!search && (
            <Link
              to="/marketplace"
              className="mt-4 px-6 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors"
            >
              {t('customer.favorites.browse_marketplace', 'Anbieter entdecken')}
            </Link>
          )}
        </div>
      ) : (
        <DashboardGrid cols={3} className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((vendor) => (
            <FavoriteCard
              key={vendor.id || vendor._id}
              vendor={vendor}
              onRemove={handleRemove}
            />
          ))}
        </DashboardGrid>
      )}
    </div>
  );
}
