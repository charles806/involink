const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const sanitizeInput = (input: unknown): string => {
  if (typeof input === 'string') {
    return input.replace(/[&<>'"]/g, (char) => {
      const entities: Record<string, string> = {
        '&': '&amp;', // MUST be first to prevent double encoding
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#x27;',
        '"': '&quot;',
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

  async request(endpoint: string, options: RequestInit & { skipSanitize?: boolean, timeout?: number } = {}, retries = 1) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    const token = this.getToken();
    if (token && !options.headers?.['No-Auth']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Remove custom internal headers
    if (headers['No-Auth']) delete headers['No-Auth'];

    let body = options.body;
    if (body && typeof body === 'string' && !options.skipSanitize) {
      try {
        const rawBody = JSON.parse(body);
        
        // Function to recursively sanitize objects and arrays
        const sanitizeDeep = (obj: any): any => {
          if (typeof obj === 'string') return sanitizeInput(obj);
          if (Array.isArray(obj)) return obj.map(sanitizeDeep);
          if (obj !== null && typeof obj === 'object') {
            const sanitizedObj: Record<string, any> = {};
            for (const [key, value] of Object.entries(obj)) {
              sanitizedObj[key] = sanitizeDeep(value);
            }
            return sanitizedObj;
          }
          return obj;
        };

        const sanitizedBody = sanitizeDeep(rawBody);
        body = JSON.stringify(sanitizedBody);
      } catch (e) {
        // If not JSON, leave as is
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000); // 30s default timeout

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        body,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.status === 401) {
        this.clearAuth();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.error || errorMessage;
        } catch (e) {
          // If response is not JSON
        }
        throw new Error(errorMessage);
      }

      // Check if response has content before parsing
      const text = await response.text();
      if (!text) return {};
      
      return JSON.parse(text);
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection.');
      }
      
      // Handle network errors (Failed to fetch)
      if (error.message === 'Failed to fetch' && retries > 0) {
        console.warn(`Network request failed, retrying... (${retries} left)`);
        return this.request(endpoint, options, retries - 1);
      }
      
      // Re-throw if it's already an Error with our message
      if (error instanceof Error) throw error;
      
      throw new Error(error.message || 'An unexpected network error occurred');
    }
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

  async updateProfile(data: Record<string, unknown>) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getClients(search: string = "") {
    const params = new URLSearchParams();
    if (search) params.append('search', sanitizeInput(search));
    return this.request(`/clients?${params}`, { skipSanitize: true });
  }

  async createClient(data: Record<string, unknown>) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClient(id: string, data: Record<string, unknown>) {
    return this.request(`/clients/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
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
  
  async getPublicInvoice(id: string) {
    return this.request(`/invoices/${encodeURIComponent(id)}/public`, {
      headers: { 'No-Auth': 'true' }
    });
  }

  async createInvoice(data: Record<string, unknown>) {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInvoice(id: string, data: Record<string, unknown>) {
    return this.request(`/invoices/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
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
        invoiceId: invoiceId, // don't URI encode inside JSON body
        email: email,
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