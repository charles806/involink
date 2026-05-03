const API_BASE_URL = 'http://localhost:3002/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async signup(email, password, name) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async getClients(search) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    return this.request(`/clients?${params}`);
  }

  async createClient(data) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClient(id, data) {
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClient(id) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  async getInvoices(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return this.request(`/invoices?${params}`);
  }

  async getInvoice(id) {
    return this.request(`/invoices/${id}`);
  }

  async createInvoice(data) {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInvoice(id, data) {
    return this.request(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInvoice(id) {
    return this.request(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  async sendInvoice(id) {
    return this.request(`/invoices/${id}/send`, {
      method: 'POST',
    });
  }

  async markInvoicePaid(id) {
    return this.request(`/invoices/${id}/mark-paid`, {
      method: 'POST',
    });
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('user');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export const api = new ApiService();
export default api;