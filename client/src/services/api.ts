const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(name: string, email: string, password: string, referralCode?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, referralCode })
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Quiz endpoints
  async getQuizzes(category?: string) {
    const params = category ? `?category=${category}` : '';
    return this.request(`/quiz${params}`);
  }

  async getQuiz(id: string) {
    return this.request(`/quiz/${id}`);
  }

  async joinQuiz(id: string) {
    return this.request(`/quiz/${id}/join`, {
      method: 'POST'
    });
  }

  async submitQuiz(id: string, answers: number[]) {
    return this.request(`/quiz/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(name: string, avatar?: string) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, avatar })
    });
  }

  async deposit(amount: number) {
    return this.request('/user/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  }

  async getTransactions() {
    return this.request('/user/transactions');
  }
}

export const apiService = new ApiService();