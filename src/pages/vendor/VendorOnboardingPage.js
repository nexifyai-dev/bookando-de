import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Scissors, Clock, CreditCard, UserPlus, Rocket,
  ChevronRight, ChevronLeft, SkipForward, Loader2, AlertCircle,
  Check, Plus, Trash2, MapPin, Mail
} from 'lucide-react';
import apiClient from '../../lib/apiClient';
import StatCard from '../../components/dashboard/StatCard';

const STEPS = [
  { key: 'business', icon: Building2, labelKey: 'vendor.onboarding.step_business', fallback: 'Unternehmensdaten' },
  { key: 'services', icon: Scissors, labelKey: 'vendor.onboarding.step_services', fallback: 'Leistungen' },
  { key: 'hours', icon: Clock, labelKey: 'vendor.onboarding.step_hours', fallback: 'Öffnungszeiten' },
  { key: 'payment', icon: CreditCard, labelKey: 'vendor.onboarding.step_payment', fallback: 'Zahlungsanbieter' },
  { key: 'team', icon: UserPlus, labelKey: 'vendor.onboarding.step_team', fallback: 'Team einladen' },
  { key: 'golive', icon: Rocket, labelKey: 'vendor.onboarding.step_golive', fallback: 'Go Live' },
];

const CATEGORIES = [
  'Friseur', 'Kosmetik', 'Nagelstudio', 'Massage', 'Physiotherapie',
  'Zahnarzt', 'Tierarzt', 'Fitness', 'Coaching', 'Fotografie',
  'Reinigung', 'Handwerk', 'Sonstiges',
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = { monday: 'Mo', tuesday: 'Di', wednesday: 'Mi', thursday: 'Do', friday: 'Fr', saturday: 'Sa', sunday: 'So' };

function ProgressBar({ current, total, t }) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i < current;
          const active = i === current;
          return (
            <div key={step.key} className="flex items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done ? 'bg-success text-white' :
                active ? 'bg-brand text-white shadow-lg shadow-brand/30' :
                'bg-gray-100 text-gray-400'
              }`}>
                {done ? <Check size={16} /> : <Icon size={16} />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`hidden sm:block w-8 lg:w-14 h-0.5 mx-1 ${done ? 'bg-success' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function TrialBanner({ t, trialEnd }) {
  const [daysLeft, setDaysLeft] = useState(null);
  useEffect(() => {
    if (!trialEnd) { setDaysLeft(30); return; }
    const end = new Date(trialEnd);
    const diff = Math.max(0, Math.ceil((end - Date.now()) / 86400000));
    setDaysLeft(diff);
  }, [trialEnd]);
  if (daysLeft === null) return null;
  return (
    <div className="mb-6 bg-gradient-to-r from-brand/10 to-accent/10 border border-brand/20 rounded-xl px-5 py-3.5 flex items-center gap-3">
      <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
        <Rocket size={20} className="text-brand" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">
          {t('vendor.onboarding.trial_title', '30 Tage kostenlose Testphase')}
        </p>
        <p className="text-xs text-gray-500">
          {t('vendor.onboarding.trial_remaining', 'Noch {{count}} Tage übrig', { count: daysLeft })}
        </p>
      </div>
    </div>
  );
}

/* ─── Step 1: Business Info ─── */
function StepBusiness({ register, errors, t }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">{t('vendor.onboarding.business_desc', 'Erzählen Sie uns etwas über Ihr Unternehmen.')}</p>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('vendor.onboarding.business_name', 'Unternehmensname')} *</label>
        <input {...register('businessName', { required: true })} className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="z.B. Beauty Salon München" />
        {errors.businessName && <p className="text-xs text-danger mt-1">{t('common.required', 'Pflichtfeld')}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('vendor.onboarding.category', 'Kategorie')} *</label>
        <select {...register('category', { required: true })} className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none bg-white">
          <option value="">{t('common.select', 'Bitte wählen...')}</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="text-xs text-danger mt-1">{t('common.required', 'Pflichtfeld')}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('vendor.onboarding.street', 'Straße')} *</label>
          <input {...register('street', { required: true })} className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="Musterstraße 1" />
          {errors.street && <p className="text-xs text-danger mt-1">{t('common.required', 'Pflichtfeld')}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('vendor.onboarding.zip', 'PLZ')} *</label>
          <input {...register('zip', { required: true })} className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="80331" />
          {errors.zip && <p className="text-xs text-danger mt-1">{t('common.required', 'Pflichtfeld')}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('vendor.onboarding.city', 'Stadt')} *</label>
          <input {...register('city', { required: true })} className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="München" />
          {errors.city && <p className="text-xs text-danger mt-1">{t('common.required', 'Pflichtfeld')}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('vendor.onboarding.phone', 'Telefon')}</label>
          <input {...register('phone')} className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="+49 89 123456" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('vendor.onboarding.description', 'Beschreibung')}</label>
        <textarea {...register('description')} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none resize-none" placeholder="Beschreiben Sie Ihr Unternehmen..." />
      </div>
    </div>
  );
}

/* ─── Step 2: Services ─── */
function StepServices({ control, register, errors, t }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'services' });
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{t('vendor.onboarding.services_desc', 'Fügen Sie Ihre ersten Leistungen hinzu. Sie können später weitere hinzufügen.')}</p>
      {fields.map((field, idx) => (
        <div key={field.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">{t('vendor.onboarding.service', 'Leistung')} {idx + 1}</span>
            {fields.length > 1 && (
              <button type="button" onClick={() => remove(idx)} className="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <input {...register(`services.${idx}.name`, { required: true })} className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder={t('vendor.onboarding.service_name', 'Name der Leistung')} />
          <div className="grid grid-cols-2 gap-3">
            <input {...register(`services.${idx}.duration`, { required: true, valueAsNumber: true })} type="number" className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder={t('vendor.onboarding.duration_min', 'Dauer (Min.)')} />
            <input {...register(`services.${idx}.price`, { required: true, valueAsNumber: true })} type="number" step="0.01" className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder={t('vendor.onboarding.price_eur', 'Preis (€)')} />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: '', duration: 30, price: 0 })} className="w-full h-11 rounded-lg border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-500 hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-2">
        <Plus size={16} /> {t('vendor.onboarding.add_service', 'Weitere Leistung hinzufügen')}
      </button>
    </div>
  );
}

/* ─── Step 3: Working Hours ─── */
function StepHours({ register, watch, t }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{t('vendor.onboarding.hours_desc', 'Legen Sie Ihre regulären Öffnungszeiten fest.')}</p>
      <div className="space-y-2">
        {DAYS.map(day => (
          <div key={day} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
            <label className="flex items-center gap-2 w-12">
              <input type="checkbox" {...register(`hours.${day}.enabled`)} className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand/20" />
              <span className="text-sm font-medium text-gray-700">{DAY_LABELS[day]}</span>
            </label>
            <div className="flex items-center gap-2 flex-1">
              <input type="time" {...register(`hours.${day}.start`)} defaultValue="09:00" className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none flex-1" />
              <span className="text-xs text-gray-400">—</span>
              <input type="time" {...register(`hours.${day}.end`)} defaultValue="18:00" className="h-9 px-3 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none flex-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 4: Payment Provider ─── */
function StepPayment({ register, t }) {
  const [provider, setProvider] = useState('stripe');
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">{t('vendor.onboarding.payment_desc', 'Verbinden Sie Ihren Zahlungsanbieter, um Zahlungen zu empfangen.')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['stripe', 'paypal'].map(p => (
          <button key={p} type="button" onClick={() => setProvider(p)} className={`relative p-5 rounded-xl border-2 text-left transition-all ${provider === p ? 'border-brand bg-brand/5 shadow-lg shadow-brand/10' : 'border-gray-200 hover:border-gray-300'}`}>
            {provider === p && <div className="absolute top-3 right-3 w-5 h-5 bg-brand rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
            <CreditCard size={24} className={provider === p ? 'text-brand mb-2' : 'text-gray-400 mb-2'} />
            <p className="text-sm font-bold text-gray-900">{p === 'stripe' ? 'Stripe' : 'PayPal'}</p>
            <p className="text-xs text-gray-400 mt-0.5">{p === 'stripe' ? 'Kreditkarte, SEPA, Apple Pay' : 'PayPal, Lastschrift'}</p>
          </button>
        ))}
      </div>
      <input type="hidden" {...register('paymentProvider')} value={provider} />
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {provider === 'stripe' ? t('vendor.onboarding.stripe_key', 'Stripe API Key') : t('vendor.onboarding.paypal_email', 'PayPal E-Mail')}
        </label>
        <input {...register('paymentKey')} className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder={provider === 'stripe' ? 'sk_live_...' : 'paypal@beispiel.de'} />
      </div>
      <p className="text-xs text-gray-400">{t('vendor.onboarding.payment_note', 'Sie können dies jederzeit in den Einstellungen ändern.')}</p>
    </div>
  );
}

/* ─── Step 5: Team Invite ─── */
function StepTeam({ control, register, t }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'teamEmails' });
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{t('vendor.onboarding.team_desc', 'Laden Sie Mitarbeiter ein, die Termine verwalten können.')}</p>
      {fields.map((field, idx) => (
        <div key={field.id} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register(`teamEmails.${idx}.email`)} type="email" className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none" placeholder="mitarbeiter@beispiel.de" />
          </div>
          <button type="button" onClick={() => remove(idx)} className="p-2.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({ email: '' })} className="w-full h-11 rounded-lg border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-500 hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-2">
        <Plus size={16} /> {t('vendor.onboarding.add_member', 'Mitarbeiter einladen')}
      </button>
      <p className="text-xs text-gray-400">{t('vendor.onboarding.team_skip_hint', 'Sie können Mitarbeiter auch später einladen.')}</p>
    </div>
  );
}

/* ─── Step 6: Go Live ─── */
function StepGoLive({ t, isSubmitting }) {
  return (
    <div className="text-center py-6 space-y-6">
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
        <Rocket size={36} className="text-success" />
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">{t('vendor.onboarding.golive_title', 'Alles bereit!')}</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">{t('vendor.onboarding.golive_desc', 'Ihr Profil ist eingerichtet. Starten Sie jetzt und empfangen Sie Ihre ersten Buchungen.')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
        <div className="bg-gray-50 rounded-lg p-3">
          <Check size={16} className="text-success mb-1" />
          <p className="text-xs font-semibold text-gray-700">{t('vendor.onboarding.golive_feat1', 'Marketplace')}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <Check size={16} className="text-success mb-1" />
          <p className="text-xs font-semibold text-gray-700">{t('vendor.onboarding.golive_feat2', 'Online-Buchung')}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <Check size={16} className="text-success mb-1" />
          <p className="text-xs font-semibold text-gray-700">{t('vendor.onboarding.golive_feat3', 'Kalender')}</p>
        </div>
      </div>
      {isSubmitting && (
        <div className="flex items-center justify-center gap-2 text-sm text-brand">
          <Loader2 size={16} className="animate-spin" /> {t('vendor.onboarding.activating', 'Wird aktiviert...')}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function VendorOnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusData, setStatusData] = useState(null);

  const { register, handleSubmit, control, formState: { errors }, reset, getValues, trigger } = useForm({
    defaultValues: {
      businessName: '', category: '', street: '', zip: '', city: '', phone: '', description: '',
      services: [{ name: '', duration: 30, price: 0 }],
      hours: DAYS.reduce((acc, d) => { acc[d] = { enabled: d !== 'sunday', start: '09:00', end: '18:00' }; return acc; }, {}),
      paymentProvider: 'stripe', paymentKey: '',
      teamEmails: [{ email: '' }],
    },
  });

  useEffect(() => {
    let cancelled = false;
    async function fetchStatus() {
      try {
        const { data } = await apiClient.get('/api/vendor/onboarding/status');
        if (cancelled) return;
        setStatusData(data);
        if (data.completed) {
          navigate('/portal/vendor', { replace: true });
          return;
        }
        if (data.step !== undefined) setStep(data.step);
        if (data.formData) reset(data.formData);
      } catch (err) {
        // First time — no data yet, fine
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchStatus();
    return () => { cancelled = true; };
  }, [navigate, reset]);

  const saveProgress = useCallback(async (currentStep, formData) => {
    try {
      await apiClient.post('/api/vendor/onboarding', { step: currentStep, formData, action: 'save' });
    } catch {
      // non-blocking
    }
  }, []);

  const handleNext = useCallback(async () => {
    // Validate current step fields
    let valid = true;
    if (step === 0) valid = await trigger(['businessName', 'category', 'street', 'zip', 'city']);
    if (step === 1) valid = await trigger('services');
    if (valid) {
      const data = getValues();
      const next = step + 1;
      setStep(next);
      saveProgress(next, data);
    }
  }, [step, trigger, getValues, saveProgress]);

  const handleSkip = useCallback(() => {
    const data = getValues();
    const next = step + 1;
    setStep(next);
    saveProgress(next, data);
  }, [step, getValues, saveProgress]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  const onSubmit = useCallback(async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.post('/api/vendor/onboarding', { step: 5, formData, action: 'complete' });
      navigate('/portal/vendor', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t('vendor.onboarding.submit_error', 'Fehler beim Speichern. Bitte versuchen Sie es erneut.'));
    } finally {
      setSubmitting(false);
    }
  }, [navigate, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand" />
      </div>
    );
  }

  const canSkip = step >= 1 && step <= 4; // steps 2-5 skippable

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-title-lg text-gray-900">{t('vendor.onboarding.title', 'Willkommen bei Bookando!')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('vendor.onboarding.subtitle', 'Richten Sie Ihren Account in wenigen Schritten ein.')}</p>
      </div>

      <TrialBanner t={t} trialEnd={statusData?.trial_end} />

      <ProgressBar current={step} total={STEPS.length} t={t} />

      {error && (
        <div className="mb-6 flex items-center gap-3 bg-danger/5 border border-danger/20 rounded-xl px-5 py-3">
          <AlertCircle size={18} className="text-danger flex-shrink-0" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {/* Step Label */}
      <div className="mb-5">
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">
          {t('vendor.onboarding.step_counter', 'Schritt {{current}} von {{total}}', { current: step + 1, total: STEPS.length })}
        </p>
        <h2 className="text-lg font-extrabold text-gray-900">{t(STEPS[step].labelKey, STEPS[step].fallback)}</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          {step === 0 && <StepBusiness register={register} errors={errors} t={t} />}
          {step === 1 && <StepServices control={control} register={register} errors={errors} t={t} />}
          {step === 2 && <StepHours register={register} watch={null} t={t} />}
          {step === 3 && <StepPayment register={register} t={t} />}
          {step === 4 && <StepTeam control={control} register={register} t={t} />}
          {step === 5 && <StepGoLive t={t} isSubmitting={submitting} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {step > 0 && (
              <button type="button" onClick={handleBack} className="h-11 px-5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
                <ChevronLeft size={16} /> {t('common.back', 'Zurück')}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {canSkip && (
              <button type="button" onClick={handleSkip} className="h-11 px-5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1.5">
                {t('common.skip', 'Überspringen')} <SkipForward size={14} />
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={handleNext} className="h-11 px-6 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand-hover transition-colors flex items-center gap-2">
                {t('common.next', 'Weiter')} <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="h-11 px-8 bg-success text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50">
                <Rocket size={16} /> {t('vendor.onboarding.go_live', 'Jetzt starten')}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
