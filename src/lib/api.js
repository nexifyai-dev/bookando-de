/**
 * REST-Service-Layer: kapselt alle API-Calls und gruppiert sie nach Domäne.
 * Halten die UI-Komponenten sauber und testbar.
 */
import apiClient from './apiClient';

export const ServicesApi = {
  list: () => apiClient.get('/api/vendor/services').then(r => r.data),
  create: (p) => apiClient.post('/api/vendor/services', p).then(r => r.data),
  update: (id, p) => apiClient.patch(`/api/vendor/services/${id}`, p).then(r => r.data),
  remove: (id) => apiClient.delete(`/api/vendor/services/${id}`).then(r => r.data),
};

export const ProductsApi = {
  list: () => apiClient.get('/api/vendor/products').then(r => r.data),
  create: (p) => apiClient.post('/api/vendor/products', p).then(r => r.data),
  update: (id, p) => apiClient.patch(`/api/vendor/products/${id}`, p).then(r => r.data),
  remove: (id) => apiClient.delete(`/api/vendor/products/${id}`).then(r => r.data),
};

export const PackagesApi = {
  list: () => apiClient.get('/api/vendor/packages').then(r => r.data),
  create: (p) => apiClient.post('/api/vendor/packages', p).then(r => r.data),
  update: (id, p) => apiClient.patch(`/api/vendor/packages/${id}`, p).then(r => r.data),
  remove: (id) => apiClient.delete(`/api/vendor/packages/${id}`).then(r => r.data),
};

export const VouchersApi = {
  list: () => apiClient.get('/api/vendor/vouchers').then(r => r.data),
  create: (p) => apiClient.post('/api/vendor/vouchers', p).then(r => r.data),
  update: (id, p) => apiClient.patch(`/api/vendor/vouchers/${id}`, p).then(r => r.data),
  remove: (id) => apiClient.delete(`/api/vendor/vouchers/${id}`).then(r => r.data),
};

export const LocationsApi = {
  list: () => apiClient.get('/api/vendor/locations').then(r => r.data),
  create: (p) => apiClient.post('/api/vendor/locations', p).then(r => r.data),
  update: (id, p) => apiClient.patch(`/api/vendor/locations/${id}`, p).then(r => r.data),
  remove: (id) => apiClient.delete(`/api/vendor/locations/${id}`).then(r => r.data),
};

export const EmployeesApi = {
  list: () => apiClient.get('/api/vendor/employees').then(r => r.data),
  create: (p) => apiClient.post('/api/vendor/employees', p).then(r => r.data),
  update: (id, p) => apiClient.patch(`/api/vendor/employees/${id}`, p).then(r => r.data),
  remove: (id) => apiClient.delete(`/api/vendor/employees/${id}`).then(r => r.data),
};

export const ResourcesApi = {
  list: () => apiClient.get('/api/vendor/resources').then(r => r.data),
  create: (p) => apiClient.post('/api/vendor/resources', p).then(r => r.data),
  update: (id, p) => apiClient.patch(`/api/vendor/resources/${id}`, p).then(r => r.data),
  remove: (id) => apiClient.delete(`/api/vendor/resources/${id}`).then(r => r.data),
};

export const WorkingHoursApi = {
  get: () => apiClient.get('/api/vendor/working-hours').then(r => r.data),
  set: (p) => apiClient.put('/api/vendor/working-hours', p).then(r => r.data),
};

export const VendorBookingsApi = {
  list: (status) => apiClient.get('/api/vendor/bookings', { params: status ? { status_filter: status } : {} }).then(r => r.data),
  update: (id, p) => apiClient.patch(`/api/vendor/bookings/${id}`, p).then(r => r.data),
};

export const CustomerBookingsApi = {
  list: () => apiClient.get('/api/customer/bookings').then(r => r.data),
  cancel: (id) => apiClient.delete(`/api/customer/bookings/${id}`).then(r => r.data),
  create: (p) => apiClient.post('/api/bookings', p).then(r => r.data),
  reschedule: (id, start_at) => apiClient.patch(`/api/customer/bookings/${id}/reschedule`, { start_at }).then(r => r.data),
  // Recurring (Customer-Subscriptions)
  createRecurring: (p) => apiClient.post('/api/bookings/recurring', p).then(r => r.data),
  listRecurring: () => apiClient.get('/api/customer/recurring-bookings').then(r => r.data),
  cancelRecurring: (id) => apiClient.delete(`/api/customer/recurring-bookings/${id}`).then(r => r.data),
};

export const PublicApi = {
  vendor: (id) => apiClient.get(`/api/public/vendors/${id}`).then(r => r.data),
  vendorServices: (id) => apiClient.get(`/api/public/vendors/${id}/services`).then(r => r.data),
  service: (id) => apiClient.get(`/api/public/services/${id}`).then(r => r.data),
  slots: (id, days = 14) => apiClient.get(`/api/public/services/${id}/slots`, { params: { days } }).then(r => r.data),
};

export const NotificationsApi = {
  list: () => apiClient.get('/api/notifications').then(r => r.data),
  unreadCount: () => apiClient.get('/api/notifications/unread-count').then(r => r.data),
  markRead: (id) => apiClient.patch(`/api/notifications/${id}/read`).then(r => r.data),
  markAllRead: () => apiClient.patch('/api/notifications/read-all').then(r => r.data),
};

export const MarketplaceApi = {
  vendors: (params = {}) => apiClient.get('/api/public/marketplace/vendors', { params }).then(r => r.data),
  services: (params = {}) => apiClient.get('/api/public/marketplace/services', { params }).then(r => r.data),
  countries: () => apiClient.get('/api/public/marketplace/countries').then(r => r.data),
};

/** Öffentliche Vendor-Detail-API */
export const VendorDetailApi = {
  /** Einzelnen Vendor abrufen */
  get: (vendorId) => apiClient.get(`/api/marketplace/${vendorId}`).then(r => r.data),
  /** Services eines Vendors abrufen */
  services: (vendorId) => apiClient.get(`/api/marketplace/${vendorId}/services`).then(r => r.data),
  /** Bewertungen eines Vendors abrufen */
  reviews: (vendorId) => apiClient.get(`/api/marketplace/${vendorId}/reviews`).then(r => r.data),
};

/** Verfügbare Zeitslots abrufen */
export const BookingSlotsApi = {
  available: (params) => apiClient.post('/api/bookings/slots', params).then(r => r.data),
};

export const VerifyEmailApi = {
  request: () => apiClient.post('/api/auth/verify-email/request').then(r => r.data),
  confirm: (token) => apiClient.post('/api/auth/verify-email/confirm', { token }).then(r => r.data),
};

export const PrivacyApi = {
  // DSGVO Datenexport: Liefert JSON-Blob als Download (axios responseType='blob')
  exportData: () => apiClient.get('/api/users/me/data-export', { responseType: 'blob' }).then(r => r),
  requestDeletion: () => apiClient.post('/api/users/me/delete-request').then(r => r.data),
  cancelDeletion: () => apiClient.post('/api/users/me/delete-cancel').then(r => r.data),
};

export const TwoFactorApi = {
  status: () => apiClient.get('/api/auth/2fa/status').then(r => r.data),
  setup: () => apiClient.post('/api/auth/2fa/setup').then(r => r.data),
  enable: (code) => apiClient.post('/api/auth/2fa/enable', { code }).then(r => r.data),
  disable: (password, code) => apiClient.post('/api/auth/2fa/disable', { password, code }).then(r => r.data),
  regenerateBackup: (password, code) => apiClient.post('/api/auth/2fa/regenerate-backup-codes', { password, code }).then(r => r.data),
};

export const EmployeeAccountsApi = {
  list: () => apiClient.get('/api/vendor/employee-accounts').then(r => r.data),
  invite: (payload) => apiClient.post('/api/vendor/employee-accounts', payload).then(r => r.data),
  update: (id, payload) => apiClient.patch(`/api/vendor/employee-accounts/${id}`, payload).then(r => r.data),
  revoke: (id) => apiClient.delete(`/api/vendor/employee-accounts/${id}`).then(r => r.data),
  setupAccount: (token, password) => apiClient.post('/api/auth/employee-setup', { token, password }).then(r => r.data),
};

export const UploadsApi = {
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return apiClient.post('/api/uploads/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
  },
};

export const CheckoutApi = {
  createSession: (payload) => apiClient.post('/api/checkout/session', payload).then(r => r.data),
  status: (sessionId) => apiClient.get(`/api/checkout/status/${sessionId}`).then(r => r.data),
  myOrders: () => apiClient.get('/api/orders/me').then(r => r.data),
  order: (id) => apiClient.get(`/api/orders/${id}`).then(r => r.data),
};

export const ReviewsApi = {
  publicForVendor: (vendorId) => apiClient.get(`/api/public/vendors/${vendorId}/reviews`).then(r => r.data),
  ratingForVendor: (vendorId) => apiClient.get(`/api/public/vendors/${vendorId}/rating`).then(r => r.data),
  create: (payload) => apiClient.post('/api/reviews', payload).then(r => r.data),
  vendorList: () => apiClient.get('/api/vendor/reviews').then(r => r.data),
  respond: (id, response) => apiClient.post(`/api/vendor/reviews/${id}/respond`, { response }).then(r => r.data),
  // Moderation
  vendorHide: (id, reason) => apiClient.patch(`/api/vendor/reviews/${id}/hide`, { reason }).then(r => r.data),
  vendorUnhide: (id) => apiClient.patch(`/api/vendor/reviews/${id}/unhide`).then(r => r.data),
  flag: (id, reason) => apiClient.post(`/api/reviews/${id}/flag`, { reason }).then(r => r.data),
  // Admin
  adminList: (params = {}) => apiClient.get('/api/admin/reviews', { params }).then(r => r.data),
  adminHide: (id, reason) => apiClient.patch(`/api/admin/reviews/${id}/hide`, { reason }).then(r => r.data),
  adminUnhide: (id) => apiClient.patch(`/api/admin/reviews/${id}/unhide`).then(r => r.data),
};

export const AuditApi = {
  list: (params = {}) => apiClient.get('/api/admin/audit/logs', { params }).then(r => r.data),
};

export const InvoiceApi = {
  download: async (orderId) => {
    const r = await apiClient.get(`/api/orders/${orderId}/invoice`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([r.data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `rechnung-${orderId.slice(0, 8)}.pdf`;
    document.body.appendChild(a); a.click(); a.remove();
    window.URL.revokeObjectURL(url);
  },
};

export const CustomerVouchersApi = {
  list: () => apiClient.get('/api/customer/vouchers').then(r => r.data),
  redeem: (code) => apiClient.post('/api/customer/vouchers/redeem', { code }).then(r => r.data),
};

export const FranchiseApi = {
  // Admin
  list: () => apiClient.get('/api/franchise').then(r => r.data),
  create: (payload) => apiClient.post('/api/franchise', payload).then(r => r.data),
  // Franchiser
  me: () => apiClient.get('/api/franchise/me').then(r => r.data),
  meReports: (days = 30) => apiClient.get('/api/franchise/me/reports', { params: { days } }).then(r => r.data),
  // Both (RBAC server-side)
  update: (id, payload) => apiClient.patch(`/api/franchise/${id}`, payload).then(r => r.data),
  vendors: (id) => apiClient.get(`/api/franchise/${id}/vendors`).then(r => r.data),
  attachVendor: (id, vendorId) => apiClient.post(`/api/franchise/${id}/vendors/${vendorId}/attach`).then(r => r.data),
  detachVendor: (id, vendorId) => apiClient.delete(`/api/franchise/${id}/vendors/${vendorId}`).then(r => r.data),
  reports: (id, days = 30) => apiClient.get(`/api/franchise/${id}/reports`, { params: { days } }).then(r => r.data),
};

export const BrandingApi = {
  get: () => apiClient.get('/api/vendor/branding').then(r => r.data),
  update: (payload) => apiClient.patch('/api/vendor/branding', payload).then(r => r.data),
  publicForVendor: (vendorId) => apiClient.get(`/api/public/vendor/${vendorId}/branding`).then(r => r.data),
  // Domains
  listDomains: () => apiClient.get('/api/vendor/domains').then(r => r.data),
  addDomain: (domain) => apiClient.post('/api/vendor/domains', { domain }).then(r => r.data),
  deleteDomain: (id) => apiClient.delete(`/api/vendor/domains/${id}`).then(r => r.data),
};

export const ReportsApi = {
  vendor: () => apiClient.get('/api/reports/vendor').then(r => r.data),
  admin: () => apiClient.get('/api/reports/admin').then(r => r.data),
  // CSV Downloads – speichern Blob als Datei
  downloadVendorCsv: async (days = 30) => {
    const r = await apiClient.get('/api/reports/vendor/csv', { params: { days }, responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([r.data], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    a.download = `buchungen_vendor_${ts}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    window.URL.revokeObjectURL(url);
  },
  downloadFranchiseCsv: async (days = 30) => {
    const r = await apiClient.get('/api/reports/franchise/csv', { params: { days }, responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([r.data], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    a.download = `buchungen_franchise_${ts}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    window.URL.revokeObjectURL(url);
  },
};

export const PlansApi = {
  publicList: () => apiClient.get('/api/public/plans').then(r => r.data),
  mySubscription: () => apiClient.get('/api/me/subscription').then(r => r.data),
  selectPlan: (tier, billing_period = 'monthly') => apiClient.post('/api/me/subscription/select', { tier, billing_period }).then(r => r.data),
  cancel: () => apiClient.post('/api/me/subscription/cancel').then(r => r.data),
};
