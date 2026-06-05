/**
 * Axios-Client für Bookando-Portal.
 * - Bearer-Token-Auth (Tokens in localStorage)
 * - Automatischer 401-Refresh mit Refresh-Token-Rotation
 * - Bei Refresh-Fehler: Tokens entfernt + Redirect zu /auth/login
 */
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;
export const TOKEN_KEYS = {
  access: 'bk_access_token',
  refresh: 'bk_refresh_token',
};

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEYS.access);
}
export function getRefreshToken() {
  return localStorage.getItem(TOKEN_KEYS.refresh);
}
export function setTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem(TOKEN_KEYS.access, access_token);
  if (refresh_token) localStorage.setItem(TOKEN_KEYS.refresh, refresh_token);
}
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEYS.access);
  localStorage.removeItem(TOKEN_KEYS.refresh);
}

const apiClient = axios.create({
  baseURL: API,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Sprache mitsenden für serverseitiges i18n
  try {
    const lang = localStorage.getItem('i18nextLng') || 'de';
    config.headers['X-Lang'] = lang.split('-')[0];
  } catch {}
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

function processQueue(error, token = null) {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config || {};
    const status = err.response?.status;
    const url = original.url || '';

    if (status === 401 && !original._retry && !url.includes('/api/auth/login') && !url.includes('/api/auth/register') && !url.includes('/api/auth/refresh')) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              original.headers = original.headers || {};
              original.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post(`${API}/api/auth/refresh`, { refresh_token: refreshToken });
        setTokens({ access_token: data.access_token, refresh_token: data.refresh_token });
        processQueue(null, data.access_token);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearTokens();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default apiClient;
