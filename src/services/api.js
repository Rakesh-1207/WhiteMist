const API_BASE_URL = 'http://localhost:5000/api/v1';

const isNetworkOffline = (err) => {
  if (!err || !err.message) return true;
  const msg = err.message.toLowerCase();
  return (
    msg.includes('failed to fetch') ||
    msg.includes('fetch failed') ||
    msg.includes('networkerror') ||
    msg.includes('unable to connect') ||
    msg.includes('econnrefused') ||
    msg.includes('eacces') ||
    msg.includes('enotfound')
  );
};

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products${query ? `?${query}` : ''}`);
    const data = await res.json();
    return data.data || [];
  },

  async getProductByIdOrSlug(idOrSlug) {
    const res = await fetch(`${API_BASE_URL}/products/${idOrSlug}`);
    const data = await res.json();
    return data.data?.product || null;
  },

  async getSuperSaverBundle() {
    const res = await fetch(`${API_BASE_URL}/products/bundle/super-saver`);
    const data = await res.json();
    return data.data?.bundle || null;
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    const data = await res.json();
    return data.data?.categories || [];
  },

  // Customer Reviews
  async getReviews(productId = null) {
    const url = productId ? `${API_BASE_URL}/reviews?productId=${productId}` : `${API_BASE_URL}/reviews`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data?.reviews || [];
  },

  async submitReview(reviewData) {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    return res.json();
  },

  // Promo Codes
  async getPromoCodes() {
    const res = await fetch(`${API_BASE_URL}/promo`);
    const data = await res.json();
    return data.data?.promos || [];
  },

  async validatePromoCode(code, subtotal) {
    const res = await fetch(`${API_BASE_URL}/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Invalid coupon code');
    }
    return data.data;
  },

  // Authentication
  async login({ email, password }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password credentials');
      }
      return data.data; // { user, tokens: { accessToken, refreshToken } }
    } catch (err) {
      if (!isNetworkOffline(err)) {
        throw err;
      }

      // Offline / Local Simulation Fallback
      const normalizedEmail = (email || '').trim().toLowerCase();
      const demoUsers = [
        { id: 5, email: 'customer@example.com', full_name: 'Rahul Verma', phone: '+91 9988776655', role_name: 'CUSTOMER' },
        { id: 1, email: 'admin@whitemist.com', full_name: 'Super Admin', phone: '+91 9876543210', role_name: 'SUPER_ADMIN' },
      ];

      let localRegistered = [];
      try {
        localRegistered = JSON.parse(localStorage.getItem('wm_registered_users') || '[]');
      } catch {
        localRegistered = [];
      }

      const allUsers = [...localRegistered, ...demoUsers];
      const found = allUsers.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!found) {
        throw new Error('Invalid email or password credentials');
      }

      if (found.password && found.password !== password) {
        throw new Error('Invalid email or password credentials');
      }
      if (!found.password && password !== 'Password123!') {
        throw new Error('Invalid email or password credentials');
      }

      const safeUser = {
        id: found.id,
        email: found.email,
        full_name: found.full_name,
        phone: found.phone || null,
        role_name: found.role_name || 'CUSTOMER',
      };

      return {
        user: safeUser,
        tokens: {
          accessToken: 'wm_secure_jwt_' + btoa(found.email + '_' + Date.now()),
          refreshToken: 'wm_refresh_jwt_' + Date.now(),
        }
      };
    }
  },

  async register({ email, password, full_name, phone }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      return data.data; // { user, tokens: { accessToken, refreshToken } }
    } catch (err) {
      if (!isNetworkOffline(err)) {
        throw err;
      }

      // Offline / Local Simulation Registration
      const normalizedEmail = (email || '').trim().toLowerCase();
      let localRegistered = [];
      try {
        localRegistered = JSON.parse(localStorage.getItem('wm_registered_users') || '[]');
      } catch {
        localRegistered = [];
      }

      if (normalizedEmail === 'customer@example.com' || normalizedEmail === 'admin@whitemist.com' || localRegistered.some(u => u.email.toLowerCase() === normalizedEmail)) {
        throw new Error('An account with this email address already exists');
      }

      const newUser = {
        id: Date.now(),
        email: normalizedEmail,
        full_name: (full_name || '').trim(),
        phone: (phone || '').trim() || null,
        role_name: 'CUSTOMER',
        password: password,
      };

      localRegistered.push(newUser);
      localStorage.setItem('wm_registered_users', JSON.stringify(localRegistered));

      const safeUser = { ...newUser };
      delete safeUser.password;

      return {
        user: safeUser,
        tokens: {
          accessToken: 'wm_secure_jwt_' + btoa(safeUser.email + '_' + Date.now()),
          refreshToken: 'wm_refresh_jwt_' + Date.now(),
        }
      };
    }
  },

  async googleAuth(payload) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Google authentication failed');
      }
      return data.data; // { user, tokens: { accessToken, refreshToken } }
    } catch (err) {
      if (!isNetworkOffline(err)) {
        throw err;
      }

      // Offline / Local Simulation Google Auth Fallback
      const normalizedEmail = (payload.email || 'google.user@whitemist.com').trim().toLowerCase();
      let localRegistered = [];
      try {
        localRegistered = JSON.parse(localStorage.getItem('wm_registered_users') || '[]');
      } catch {
        localRegistered = [];
      }

      let existing = localRegistered.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!existing) {
        existing = {
          id: Date.now(),
          email: normalizedEmail,
          full_name: payload.full_name || 'Google User',
          phone: payload.phone || null,
          role_name: 'CUSTOMER',
          avatar_url: payload.avatar_url || null,
          auth_provider: 'google',
        };
        localRegistered.push(existing);
        localStorage.setItem('wm_registered_users', JSON.stringify(localRegistered));
      }

      const safeUser = {
        id: existing.id,
        email: existing.email,
        full_name: existing.full_name,
        phone: existing.phone || null,
        role_name: existing.role_name || 'CUSTOMER',
        avatar_url: existing.avatar_url || payload.avatar_url || null,
        auth_provider: 'google',
      };

      return {
        user: safeUser,
        tokens: {
          accessToken: 'wm_google_jwt_' + btoa(safeUser.email + '_' + Date.now()),
          refreshToken: 'wm_google_refresh_' + Date.now(),
        }
      };
    }
  },

  async getMe(token) {
    if (!token) return null;
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Session expired');
    }
    return data.data?.user;
  },

  async updateProfile(profileData, token) {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data.data?.user;
  },

  async getAddresses(token) {
    if (!token) return [];
    try {
      const res = await fetch(`${API_BASE_URL}/users/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      return data.data?.addresses || [];
    } catch {
      return [];
    }
  },

  async addAddress(addressData, token) {
    const res = await fetch(`${API_BASE_URL}/users/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(addressData),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to save address');
    }
    return data.data?.addresses || [];
  },

  async deleteAddress(addressId, token) {
    const res = await fetch(`${API_BASE_URL}/users/addresses/${addressId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data.data?.addresses || [];
  },

  // Orders
  async getMyOrders(token) {
    if (!token) return [];
    const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch customer orders');
    }
    return data.data?.orders || [];
  },

  async createOrder(orderPayload, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to place order in database');
    }
    return data.data?.order;
  },

  // Newsletter
  async subscribeNewsletter(email) {
    const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // Commercial Quotes
  async submitQuote(quotePayload) {
    const res = await fetch(`${API_BASE_URL}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotePayload),
    });
    return res.json();
  },

  // Service Booking
  async submitService(servicePayload) {
    const res = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servicePayload),
    });
    return res.json();
  },

  // Warranty
  async verifyWarranty(serialNumber) {
    const res = await fetch(`${API_BASE_URL}/warranties/verify/${encodeURIComponent(serialNumber)}`);
    return res.json();
  },

  // Health
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  }
};
