import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Ticket,
  Gift,
  CheckCircle2,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Copy,
  Calendar,
  Percent,
  Euro,
} from 'lucide-react';
import { CustomerVouchersApi } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

/* ─── Helpers ─── */
function formatDate(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getVoucherStatus(voucher) {
  const now = new Date();
  if (voucher.redeemed_at) return { label: 'Eingelöst', variant: 'muted' };
  if (voucher.expires_at && new Date(voucher.expires_at) < now)
    return { label: 'Abgelaufen', variant: 'danger' };
  return { label: 'Aktiv', variant: 'success' };
}

function getDiscountText(voucher) {
  if (voucher.discount_percent) return `${voucher.discount_percent}%`;
  if (voucher.discount_amount) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: voucher.currency || 'EUR',
    }).format(voucher.discount_amount);
  }
  return voucher.value
    ? new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: voucher.currency || 'EUR',
      }).format(voucher.value)
    : '–';
}

/* ─── Redeem Code Form ─── */
function RedeemForm({ onSuccess }) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmed = code.trim();
      if (!trimmed) return;

      setProcessing(true);
      setError(null);
      setSuccess(null);

      try {
        const result = await CustomerVouchersApi.redeem(trimmed);
        setSuccess(t('customer.voucher_redeemed', 'Gutschein erfolgreich eingelöst!'));
        setCode('');
        if (onSuccess) onSuccess(result);
      } catch (err) {
        const detail = err?.response?.data?.detail || err.message;
        if (typeof detail === 'string') {
          setError(detail);
        } else if (Array.isArray(detail)) {
          setError(detail.map((e) => e?.msg || JSON.stringify(e)).join(' '));
        } else {
          setError(t('customer.voucher_redeem_error', 'Gutschein konnte nicht eingelöst werden. Prüfe den Code.'));
        }
      } finally {
        setProcessing(false);
      }
    },
    [code, onSuccess, t]
  );

  return (
    <div data-testid="customer-vouchers-page"
      className="rounded-xl p-5"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-divider)',
        boxShadow: 'var(--shadow-e1)',
      }}
    >
      <h2
        className="text-[14px] font-bold mb-4 flex items-center gap-2"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
      >
        <Gift size={16} style={{ color: 'var(--color-accent)' }} />
        {t('customer.redeem_voucher', 'Gutschein einlösen')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t('customer.voucher_code_ph', 'Gutscheincode eingeben')}
            disabled={processing}
            className="flex-1 px-4 py-3 text-[14px] font-mono uppercase tracking-widest"
            style={{
              border: '1px solid var(--color-divider)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface-sunken)',
            }}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={processing || !code.trim()}
            className="px-5 py-3 text-[13px] font-bold cursor-pointer transition-all disabled:opacity-50 flex items-center gap-2"
            style={{
              background: 'var(--color-accent)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-primary-dark)',
              border: 'none',
            }}
          >
            {processing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Ticket size={15} />
            )}
            {t('customer.redeem', 'Einlösen')}
          </button>
        </div>

        {error && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium"
            style={{
              background: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-border)',
              color: 'var(--color-danger)',
            }}
          >
            <AlertTriangle size={13} />
            {error}
          </div>
        )}

        {success && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium animate-slide-up"
            style={{
              background: 'var(--color-success-bg)',
              border: '1px solid var(--color-success-border)',
              color: 'var(--color-success)',
            }}
          >
            <CheckCircle2 size={13} />
            {success}
          </div>
        )}
      </form>
    </div>
  );
}

/* ─── Voucher Card ─── */
function VoucherCard({ voucher }) {
  const { t } = useTranslation();
  const status = getVoucherStatus(voucher);
  const discount = getDiscountText(voucher);
  const showIcon = voucher.discount_percent ? Percent : Euro;

  return (
    <Card className="group">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background:
                status.label === 'Aktiv'
                  ? 'var(--color-accent-muted)'
                  : 'var(--color-surface-sunken)',
            }}
          >
            <Ticket
              size={18}
              style={{
                color:
                  status.label === 'Aktiv'
                    ? 'var(--color-accent)'
                    : 'var(--color-text-tertiary)',
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className="text-[14px] font-bold truncate"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {voucher.name || voucher.code || t('customer.voucher', 'Gutschein')}
              </h3>
              <Badge variant={status.variant} size="xs">
                {status.label}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[18px] font-extrabold"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
              >
                {discount}
              </span>
              {voucher.discount_percent && (
                <span className="text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t('customer.rabatt', 'Rabatt')}
                </span>
              )}
            </div>

            {voucher.code && (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  background: 'var(--color-surface-sunken)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-divider)',
                }}
                onClick={() => {
                  navigator.clipboard.writeText(voucher.code);
                }}
                title={t('customer.copy_code', 'Code kopieren')}
              >
                {voucher.code}
                <Copy size={10} />
              </div>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px]" style={{ color: 'var(--color-text-tertiary)' }}>
              {voucher.created_at && (
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {t('customer.received', 'Erhalten')}: {formatDate(voucher.created_at)}
                </span>
              )}
              {voucher.expires_at && (
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {t('customer.expires', 'Gültig bis')}: {formatDate(voucher.expires_at)}
                </span>
              )}
              {voucher.redeemed_at && (
                <span className="flex items-center gap-1" style={{ color: 'var(--color-success)' }}>
                  <CheckCircle2 size={10} />
                  {t('customer.redeemed_at', 'Eingelöst am')}: {formatDate(voucher.redeemed_at)}
                </span>
              )}
            </div>

            {voucher.description && (
              <p className="text-[11px] mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                {voucher.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── MAIN PAGE ─── */
export default function CustomerVouchersPage() {
  const { t } = useTranslation();

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CustomerVouchersApi.list();
      const list = Array.isArray(data) ? data : data?.vouchers || data?.data || [];
      setVouchers(list);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || t('customer.error_load_vouchers', 'Fehler beim Laden der Gutscheine.'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRedeemSuccess = useCallback(
    (result) => {
      fetchData();
    },
    [fetchData]
  );

  const activeVouchers = vouchers.filter(
    (v) => !v.redeemed_at && !(v.expires_at && new Date(v.expires_at) < new Date())
  );
  const historyVouchers = vouchers.filter(
    (v) => v.redeemed_at || (v.expires_at && new Date(v.expires_at) < new Date())
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* ═══ Header ═══ */}
      <div
        className="rounded-xl p-5 md:p-6"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
        }}
      >
        <h1
          className="text-[20px] md:text-[24px] font-extrabold tracking-[-0.02em] text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('customer.vouchers_title', 'Gutscheine')}
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {t('customer.vouchers_sub', 'Gutscheine einlösen und deine Guthaben anzeigen.')}
        </p>
      </div>

      {/* ═══ Redeem Form ═══ */}
      <RedeemForm onSuccess={handleRedeemSuccess} />

      {/* ═══ Loading ═══ */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            {t('customer.loading_vouchers', 'Gutscheine werden geladen…')}
          </p>
        </div>
      )}

      {/* ═══ Error ═══ */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <AlertCircle size={36} style={{ color: 'var(--color-danger)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>
            {error}
          </p>
          <button
            onClick={fetchData}
            className="px-5 py-2 text-sm font-semibold cursor-pointer transition-colors"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-divider)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-primary)',
            }}
          >
            {t('customer.retry', 'Erneut versuchen')}
          </button>
        </div>
      )}

      {/* ═══ Active Vouchers ═══ */}
      {!loading && !error && (
        <>
          {activeVouchers.length > 0 && (
            <section>
              <h2
                className="text-[14px] font-bold mb-3 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
              >
                <Ticket size={16} style={{ color: 'var(--color-accent)' }} />
                {t('customer.active_vouchers', 'Aktive Gutscheine')}
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: 'var(--color-success-bg)',
                    color: 'var(--color-success)',
                  }}
                >
                  {activeVouchers.length}
                </span>
              </h2>
              <div className="space-y-3">
                {activeVouchers.map((v) => (
                  <VoucherCard key={v.id} voucher={v} />
                ))}
              </div>
            </section>
          )}

          {/* ═══ Voucher History ═══ */}
          {historyVouchers.length > 0 && (
            <section>
              <h2
                className="text-[14px] font-bold mb-3 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-tertiary)' }}
              >
                {t('customer.voucher_history', 'Verlauf')}
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: 'var(--color-surface-sunken)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  {historyVouchers.length}
                </span>
              </h2>
              <div className="space-y-3 opacity-70">
                {historyVouchers.map((v) => (
                  <VoucherCard key={v.id} voucher={v} />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {vouchers.length === 0 && (
            <div className="text-center py-16">
              <Gift size={44} className="mx-auto mb-3" style={{ color: 'var(--color-text-tertiary)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                {t('customer.no_vouchers', 'Du hast noch keine Gutscheine.')}
              </p>
              <p className="text-[12px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                {t('customer.no_vouchers_hint', 'Gutscheine kannst du über Aktionen oder direkt von Dienstleistern erhalten. Gib oben einen Code ein, um einen Gutschein einzulösen.')}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
