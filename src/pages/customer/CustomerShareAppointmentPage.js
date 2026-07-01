import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  Share2, Loader2, AlertCircle, Copy, Check, Mail,
  MessageCircle, Download, QrCode, ExternalLink, CalendarDays,
} from 'lucide-react';
import apiClient from '../../lib/apiClient';

function formatDate(dateStr) {
  if (!dateStr) return '–';
  try {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function generateICS(booking) {
  const start = new Date(booking.start_time || booking.date);
  const end = new Date(start.getTime() + (booking.duration_minutes || 60) * 60000);
  const dt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bookando//DE',
    'BEGIN:VEVENT',
    `DTSTART:${dt(start)}`, `DTEND:${dt(end)}`,
    `SUMMARY:${booking.service_name || 'Termin'}`,
    `DESCRIPTION:${booking.vendor_name || ''} – ${booking.service_name || ''}`,
    booking.location ? `LOCATION:${booking.location}` : '',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n');
}

function downloadICS(booking) {
  const ics = generateICS(booking);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `termin-${booking.id || 'bookando'}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CustomerShareAppointmentPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrSvg, setQrSvg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const copyTimeoutRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get(`/api/bookings/${id}/share`);
      setBooking(data.booking || data);
      setShareUrl(data.share_url || `${window.location.origin}/booking/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || t('customer.share.load_error', 'Fehler beim Laden der Buchung.'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Cleanup timeout on unmount
  useEffect(() => () => { if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current); }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleEmail() {
    const subject = encodeURIComponent(t('customer.share.email_subject', 'Mein Termin bei Bookando'));
    const body = encodeURIComponent(
      t('customer.share.email_body', 'Hier sind die Details meines Termins') + `:\n\n${shareUrl}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      t('customer.share.whatsapp_text', 'Schau dir meinen Termin an') + `: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  async function handleShowQR() {
    if (showQR) {
      setShowQR(false);
      return;
    }
    setShowQR(true);
    // Simple QR code via API or inline generation
    // ponytail: real QR lib; using placeholder pattern
    try {
      const { data } = await apiClient.get(`/api/bookings/${id}/share?format=qr`);
      if (data.qr_svg) {
        setQrSvg(data.qr_svg);
      } else {
        // Fallback: use external API
        setQrSvg(''); // Will show fallback link
      }
    } catch {
      setQrSvg('');
    }
  }

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
        <button onClick={fetchData}
          className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          {t('common.retry', 'Erneut versuchen')}
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CalendarDays size={40} className="text-gray-300 mb-4" />
        <p className="text-sm text-gray-500">
          {t('customer.share.not_found', 'Buchung nicht gefunden.')}
        </p>
      </div>
    );
  }

  const shareOptions = [
    { key: 'copy', icon: copied ? Check : Copy, label: t('customer.share.copy_link', 'Link kopieren'), onClick: handleCopy, color: copied ? 'text-success' : 'text-gray-600' },
    { key: 'email', icon: Mail, label: t('customer.share.email', 'E-Mail'), onClick: handleEmail, color: 'text-blue-600' },
    { key: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', onClick: handleWhatsApp, color: 'text-green-600' },
    { key: 'calendar', icon: Download, label: t('customer.share.add_calendar', 'Zum Kalender hinzufügen'), onClick: () => downloadICS(booking), color: 'text-gray-600' },
    { key: 'qr', icon: QrCode, label: t('customer.share.qr_code', 'QR-Code'), onClick: handleShowQR, color: 'text-gray-600' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">
          {t('customer.share.title', 'Termin teilen')}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {t('customer.share.subtitle', 'Teilen Sie Ihre Buchung per Link, E-Mail oder WhatsApp.')}
        </p>
      </div>

      {/* Booking summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <CalendarDays size={18} className="text-brand" />
          <h2 className="text-sm font-bold text-gray-900">
            {t('customer.share.booking_details', 'Buchungsdetails')}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">{t('customer.share.service', 'Service')}</span>
            <p className="font-medium text-gray-900">{booking.service_name || '–'}</p>
          </div>
          <div>
            <span className="text-gray-400">{t('customer.share.vendor', 'Anbieter')}</span>
            <p className="font-medium text-gray-900">{booking.vendor_name || '–'}</p>
          </div>
          <div>
            <span className="text-gray-400">{t('customer.share.date', 'Datum')}</span>
            <p className="font-medium text-gray-900">{formatDate(booking.start_time || booking.date)}</p>
          </div>
          <div>
            <span className="text-gray-400">{t('customer.share.time', 'Uhrzeit')}</span>
            <p className="font-medium text-gray-900">{formatTime(booking.start_time || booking.date)}</p>
          </div>
        </div>
      </div>

      {/* Share URL */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <ExternalLink size={14} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t('customer.share.link', 'Buchungslink')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-600 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              copied ? 'bg-success-light text-success-dark' : 'bg-brand text-white hover:bg-brand-hover'
            }`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? t('customer.share.copied', 'Kopiert!') : t('customer.share.copy', 'Kopieren')}
          </button>
        </div>
      </div>

      {/* Share options */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {shareOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.key}
              onClick={opt.onClick}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <Icon size={22} className={opt.color} />
              <span className="text-xs font-medium text-gray-700 text-center">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* QR Code */}
      {showQR && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            {t('customer.share.qr_title', 'QR-Code')}
          </h3>
          {qrSvg ? (
            <div className="inline-block" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          ) : (
            <div>
              {/* Fallback: external QR API */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`}
                alt="QR Code"
                width={200}
                height={200}
                className="mx-auto rounded-lg"
              />
            </div>
          )}
          <p className="text-xs text-gray-400 mt-3">
            {t('customer.share.qr_hint', 'Scannen Sie den QR-Code, um den Termin-Link zu öffnen.')}
          </p>
        </div>
      )}
    </div>
  );
}
