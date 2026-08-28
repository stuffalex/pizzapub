import axios from 'axios'
import { environment } from '@/environments/environment'

const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de request — injeta Bearer token se disponível
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pizzapub_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de response — trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pizzapub_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
