import api from '@/core/api/api'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  tipo: string
}

const TOKEN_KEY = 'pizzapub_token'
const USER_KEY = 'pizzapub_user'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/api/auth/login', credentials)
    localStorage.setItem(TOKEN_KEY, data.token)
    return data
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}
