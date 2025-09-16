// src/lib/http.js
import axios from 'axios';

// Read once from Vite env; use .env(.development/.production) with VITE_API_URL
const BASE_URL = import.meta.env.VITE_API_URL;

const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,                  // send cookies for httpOnly auth
  headers: { 'Content-Type': 'application/json' },
});

// Keep boundary for FormData
http.interceptors.request.use((cfg) => {
  if (typeof FormData !== 'undefined' && cfg.data instanceof FormData) {
    if (cfg.headers) {
      delete cfg.headers['Content-Type'];
      delete cfg.headers['content-type'];
    }
  }
  return cfg;
});

// Optional: exclude some paths from redirect handling (e.g., login/forgot)
const SKIP_401_REDIRECT = [
  '/api/auth/login/employee',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

// Simple in-memory guard to avoid duplicate redirects
let redirecting = false;

http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const original = err?.config || {};
    const path = (original?.url || '')?.toString();

    if (status === 401 && !SKIP_401_REDIRECT.some(p => path.includes(p))) {
      // Normalize first so callers get a consistent error even if we redirect
      const norm = {
        message: err?.response?.data?.message || err?.message || 'Unauthorized',
        status,
        data: err?.response?.data,
      };

      // Clear any client cache/session if used
      try { localStorage.removeItem('user'); } catch {}

      // Dispatch a global event so the app can navigate to /login (see wiring below)
      if (!redirecting) {
        redirecting = true;
        window.dispatchEvent(new CustomEvent('app:unauthorized'));
        // Reset flag on next tick so subsequent 401s can signal again if needed
        setTimeout(() => { redirecting = false; }, 0);
      }

      return Promise.reject(norm);
    }

    const message = err?.response?.data?.message || err?.message || 'Request failed';
    return Promise.reject({ message, status, data: err?.response?.data });
  }
);

export default http;
