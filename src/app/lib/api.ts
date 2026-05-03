const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const sanitizeInput = (input: unknown): string => {
  if (typeof input === 'string') {
    return input.replace(/[<>'"&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#x27;',
        '"': '&quot;',
        '&': '&amp;',
      };
      return entities[char] || char;
    });
  }
  return '';
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

class ApiService {
  token: string | null;
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
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

  clearAuth() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async request(endpoint: string, options: RequestInit & { skipSanitize?: boolean } = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let body = options.body;
    if (body && typeof body === 'object' && !options.skipSanitize) {
      const sanitizedBody: Record<string, unknown> = {};
      const rawBody = JSON.parse(body as unknown as string);
      for (const [key, value] of Object.entries(rawBody)) {
        if (typeof value === 'string') {
          sanitizedBody[key] = sanitizeInput(value);
        } else {
          sanitizedBody[key] = value;
        }
      }
      body = JSON.stringify(sanitizedBody);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      body,
    });

    if (response.status === 401) {
      this.clearAuth();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async signup(email: string, password: string, name: string) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 8 characters');
    }
    const sanitizedName = sanitizeInput(name);
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name: sanitizedName }),
    });
  }

  async login(email: string, password: string) {
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async getClients(search: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', sanitizeInput(search));
    return this.request(`/clients?${params}`, { skipSanitize: true });
  }

  async createClient(data: Record<string, unknown>) {
    const sanitizedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitizedData[key] = sanitizeInput(value);
      } else {
        sanitizedData[key] = value;
      }
    }
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async updateClient(id: string, data: Record<string, unknown>) {
    const sanitizedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitizedData[key] = sanitizeInput(value);
      } else {
        sanitizedData[key] = value;
      }
    }
    return this.request(`/clients/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(sanitizedData),
    });
  }

  async deleteClient(id: string) {
    return this.request(`/clients/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  async getInvoices(filters: Record<string, string> = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, sanitizeInput(value));
    });
    return this.request(`/invoices?${params}`, { skipSanitize: true });
  }

  async getInvoice(id: string) {
    return this.request(`/invoices/${encodeURIComponent(id)}`);
  }

  async createInvoice(data: Record<string, unknown>) {
    const sanitizedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitizedData[key] = sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitizedData[key] = value.map((item) => 
          typeof item === 'string' ? sanitizeInput(item) : item
        );
      } else {
        sanitizedData[key] = value;
      }
    }
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async updateInvoice(id: string, data: Record<string, unknown>) {
    const sanitizedData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitizedData[key] = sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitizedData[key] = value.map((item) => 
          typeof item === 'string' ? sanitizeInput(item) : item
        );
      } else {
        sanitizedData[key] = value;
      }
    }
    return this.request(`/invoices/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(sanitizedData),
    });
  }

  async deleteInvoice(id: string) {
    return this.request(`/invoices/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  async sendInvoice(id: string) {
    return this.request(`/invoices/${encodeURIComponent(id)}/send`, {
      method: 'POST',
    });
  }

  async markInvoicePaid(id: string) {
    return this.request(`/invoices/${encodeURIComponent(id)}/mark-paid`, {
      method: 'POST',
    });
  }

  async initializePayment(invoiceId: string, email: string) {
    return this.request('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify({ 
        invoiceId: encodeURIComponent(invoiceId),
        email: sanitizeInput(email),
      }),
    });
  }

  async verifyPayment(reference: string) {
    return this.request(`/payments/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
    });
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('user');
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setUser(user: Record<string, unknown>) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export const api = new ApiService();
export default api;