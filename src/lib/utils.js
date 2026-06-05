export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(value, locale = 'de-DE', opts = { year: 'numeric', month: 'short', day: '2-digit' }) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString(locale, opts);
  } catch {
    return String(value);
  }
}

export function formatDateTime(value, locale = 'de-DE') {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString(locale, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(value);
  }
}

export function initials(name, email) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return '–';
}

export function landingForRole(role) {
  if (!role) return '/auth/login';
  if (['admin', 'super_admin'].includes(role)) return '/admin';
  if (role === 'vendor') return '/vendor';
  if (role === 'employee') return '/vendor';
  if (role === 'franchiser') return '/franchise';
  return '/portal';
}

export const ROLE_LABELS = {
  customer: 'layout.role_customer',
  vendor: 'layout.role_vendor',
  employee: 'layout.role_employee',
  franchiser: 'layout.role_franchiser',
  admin: 'layout.role_admin',
  super_admin: 'layout.role_super_admin',
};
