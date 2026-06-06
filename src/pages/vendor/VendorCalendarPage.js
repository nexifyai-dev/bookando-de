import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ChevronLeft, ChevronRight, Clock, User, CheckCircle2, XCircle } from 'lucide-react';
import { VendorBookingsApi } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/card';

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 – 20:00
const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function formatTime(iso) {
  if (!iso) return '';
  try { return new Date(iso).toLocaleTimeString('de-DE', { hour:'2-digit', minute:'2-digit' }); }
  catch { return ''; }
}

function getWeekStart(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset * 7);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0,0,0,0);
  return d;
}

function formatWeekRange(start) {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const opts = { day:'numeric', month:'short', year:'numeric' };
  return `${start.toLocaleDateString('de-DE', opts)} – ${end.toLocaleDateString('de-DE', opts)}`;
}

function formatDateShort(d) {
  return d.toISOString().split('T')[0];
}

export default function VendorCalendarPage() {
  const { t } = useTranslation();
  const [weekOffset, setWeekOffset] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekStart = getWeekStart(weekOffset);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await VendorBookingsApi.list();
      setBookings(Array.isArray(data) ? data : []);
    } catch { setBookings([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const weekBookings = bookings.filter(b => {
    const d = new Date(b.start_at || b.start);
    return d >= weekStart && d < weekEnd;
  });

  const getBookingAt = (day, hour) => {
    return weekBookings.filter(b => {
      const d = new Date(b.start_at || b.start);
      return d.getDay() === (day + 1) % 7 && d.getHours() === hour;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{color:'var(--color-text-primary)'}}>{t('vendor.calendar', 'Kalender')}</h1>
          <p className="text-sm mt-1" style={{color:'var(--color-text-secondary)'}}>{formatWeekRange(weekStart)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(o => o - 1)}
            className="p-2 rounded-[var(--radius-md)] transition-all duration-150 active:scale-[0.95]"
            style={{border:'1px solid var(--color-divider)', color:'var(--color-text-secondary)'}}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setWeekOffset(0)}
            className="px-3 py-1.5 text-xs font-medium rounded-[var(--radius-md)] transition-all duration-150 active:scale-[0.97]"
            style={{backgroundColor:'var(--color-accent)', color:'#fff'}}>
            {t('common.today', 'Heute')}
          </button>
          <button onClick={() => setWeekOffset(o => o + 1)}
            className="p-2 rounded-[var(--radius-md)] transition-all duration-150 active:scale-[0.95]"
            style={{border:'1px solid var(--color-divider)', color:'var(--color-text-secondary)'}}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin" style={{color:'var(--color-accent)'}} /></div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Tages-Header */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px mb-px">
              <div className="text-xs font-medium px-2 py-2" style={{color:'var(--color-text-muted)'}}></div>
              {DAYS.map((d, i) => {
                const date = new Date(weekStart);
                date.setDate(date.getDate() + i);
                const isToday = formatDateShort(date) === formatDateShort(new Date());
                return (
                  <div key={d} className="text-center px-2 py-2 rounded-t-md"
                    style={{backgroundColor: isToday ? 'var(--color-accent)' : 'var(--color-shell-bg)', color: isToday ? '#fff' : 'var(--color-text-secondary)'}}>
                    <div className="text-xs font-medium">{d}</div>
                    <div className="text-lg font-bold">{date.getDate()}</div>
                  </div>
                );
              })}
            </div>

            {/* Zeit-Raster */}
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] gap-px" style={{minHeight:'48px'}}>
                <div className="text-[10px] font-medium px-2 flex items-start pt-1" style={{color:'var(--color-text-muted)'}}>
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {DAYS.map((_, dayIdx) => {
                  const slotBookings = getBookingAt(dayIdx, hour);
                  return (
                    <div key={dayIdx} className="relative px-0.5 py-0.5"
                      style={{borderBottom:'1px solid var(--color-divider)', borderRight:'1px solid var(--color-divider)', minHeight:'48px'}}>
                      {slotBookings.map(b => (
                        <div key={b.id} className="text-[10px] px-1 py-0.5 rounded-sm mb-0.5 truncate"
                          style={{
                            backgroundColor: b.status === 'confirmed' ? 'rgba(56,161,105,0.15)' : 'rgba(245,158,11,0.12)',
                            color: b.status === 'confirmed' ? 'var(--color-success)' : 'var(--color-warning)',
                          }}>
                          {formatTime(b.start_at || b.start)} {b.customer_name || ''}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
