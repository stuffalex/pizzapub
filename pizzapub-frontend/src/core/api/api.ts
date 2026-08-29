import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const cleanBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')

const api = axios.create({
  baseURL: cleanBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptador para injetar o token JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptador para lidar com token expirado (401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Apenas desloga e redireciona se estiver navegando em rotas protegidas de /admin
      const isProtectedAdminRoute = window.location.pathname.startsWith('/admin')
      if (isProtectedAdminRoute && error.config?.url !== '/api/auth/login') {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
