export function formatDate(value) {
  if (value === undefined || value === null) return '\u2013';
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return String(value);
  }
}

export function formatAmount(amount, currency = 'EUR') {
  if (amount === undefined || amount === null) return '\u2013';
  try {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(amount);
  } catch {
    return String(amount);
  }
}

export function formatTime(value) {
  if (value === undefined || value === null) return '\u2013';
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return String(value);
  }
}

export function formatDateTime(value) {
  if (value === undefined || value === null) return '\u2013';
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return String(value);
  }
}

export function getStatusStyle(status) {
  const map = {
    pending: { bg: 'rgba(74,144,201,0.12)', text: 'var(--color-primary-light)' },
    confirmed: { bg: 'rgba(196,155,62,0.12)', text: 'var(--color-accent)' },
    completed: { bg: 'rgba(74,222,128,0.12)', text: 'var(--color-success)' },
    cancelled: { bg: 'rgba(220,38,38,0.1)', text: 'var(--color-danger)' },
  };
  return map[status] || map.pending;
}

export function initials(name, email) {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return '\u2013';
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
