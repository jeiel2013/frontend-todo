/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = 'http://localhost:3000';

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const mergedHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...(options.headers ? (options.headers as Record<string, string>) : {}),
    };

    const config: RequestInit = {
      ...options,
      headers: mergedHeaders,
    };

    console.log('🌐 API Request:', {
      url,
      method: config.method,
      headers: config.headers,
    });

    try {
      const response = await fetch(url, config);

      // Se 401, token expirou - fazer logout
      if (response.status === 401) {
        console.warn('🚨 Token expirado, fazendo logout...');
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Token expirado');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('❌ Erro na API:', error);
      throw error;
    }
  }

  // Métodos convenientes
  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Métodos específicos para Auth
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { name: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Métodos para Todos
  async getTodos() {
    return this.get('/todos');
  }

  async createTodo(todo: { title: string }) {
    return this.post('/todos', todo);
  }

  async updateTodo(id: number, todo: { title?: string; completed?: boolean }) {
    return this.patch(`/todos/${id}`, todo);
  }

  async deleteTodo(id: number) {
    return this.delete(`/todos/${id}`);
  }

  async getProfile() {
    return this.get('/todos/profile');
  }
}

export const api = new ApiClient();
