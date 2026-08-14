import api from '@/core/api/api'

export interface LoginRequest {
  email: string
  senha?: string // opcional no frontend
  password?: string
}

export interface LoginResponse {
  token: string
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    // Garantindo que envia 'senha' como o backend espera
    const payload = {
      email: data.email,
      senha: data.password || data.senha
    }
    const response = await api.post<LoginResponse>('/api/auth/login', payload)
    return response.data
  },
}
