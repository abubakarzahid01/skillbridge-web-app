// js/api.js — SkillBridge API connector
// Change this one URL when you deploy the backend to Render
const API_BASE = 'http://localhost:5000';

// ── Token helpers ─────────────────────────────────────────────────
const Auth = {
  getToken()         { return localStorage.getItem('sb_token'); },
  setToken(t)        { localStorage.setItem('sb_token', t); },
  removeToken()      { localStorage.removeItem('sb_token'); },
  getUser()          { try { return JSON.parse(localStorage.getItem('sb_user') || 'null'); } catch { return null; } },
  setUser(u)         { localStorage.setItem('sb_user', JSON.stringify(u)); },
  removeUser()       { localStorage.removeItem('sb_user'); },
  isLoggedIn()       { return !!this.getToken(); },
  logout() {
    this.removeToken();
    this.removeUser();
    localStorage.removeItem('sb_purchases');
    window.location.href = 'login.html';
  }
};

// ── Base fetch wrapper ────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API_BASE + path, { ...options, headers });
  const data = await res.json().catch(() => ({ success: false, message: 'Invalid server response' }));

  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }
  return data;
}

// ── Auth API ──────────────────────────────────────────────────────
const AuthAPI = {
  async signup(name, email, password) {
    const data = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    Auth.setToken(data.token);
    Auth.setUser(data.user);
    return data;
  },

  async login(email, password) {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    Auth.setToken(data.token);
    Auth.setUser(data.user);
    return data;
  },

  async getMe() {
    return apiFetch('/api/auth/me');
  },

  loginWithGoogle() {
    window.location.href = `${API_BASE}/api/auth/google`;
  }
};

// ── Students API ──────────────────────────────────────────────────
const StudentsAPI = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    const qs = params.toString() ? '?' + params.toString() : '';
    return apiFetch('/api/students' + qs);
  },

  async getById(id) {
    return apiFetch(`/api/students/${id}`);
  }
};

// ── Guides API ────────────────────────────────────────────────────
const GuidesAPI = {
  async getAll() {
    return apiFetch('/api/guides');
  },

  async purchase(key) {
    return apiFetch(`/api/guides/${key}/purchase`, { method: 'POST' });
  },

  async getMyPurchases() {
    return apiFetch('/api/guides/my-purchases');
  },

  async checkAccess(key) {
    return apiFetch(`/api/guides/${key}/access`);
  }
};

// ── Hire API ──────────────────────────────────────────────────────
const HireAPI = {
  async submit(formData) {
    return apiFetch('/api/hire', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
  }
};

// ── Dashboard API ─────────────────────────────────────────────────
const DashboardAPI = {
  async get() {
    return apiFetch('/api/dashboard');
  }
};

// ── User/Profile API ──────────────────────────────────────────────
const UserAPI = {
  async getProfile() {
    return apiFetch('/api/users/profile');
  },

  async updateProfile(updates) {
    return apiFetch('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async updatePassword(currentPassword, newPassword) {
    return apiFetch('/api/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
};

// Expose globally
window.SB = { Auth, AuthAPI, StudentsAPI, GuidesAPI, HireAPI, DashboardAPI, UserAPI };
