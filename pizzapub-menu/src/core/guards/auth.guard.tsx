import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { authService } from '@/core/auth/auth.service'

export function AuthGuard() {
  const isAuthenticated = authService.isAuthenticated()
  const location = useLocation()

  if (!isAuthenticated) {
    // Redirecionar para o login salvando a rota de origem
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
