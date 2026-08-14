import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { LoginPage } from '@/features/auth/LoginPage'
import { AuthGuard } from '@/core/guards/auth.guard'
import { PedidosPage } from '@/features/pedidos/PedidosPage'
import { ProdutosPage } from '@/features/produtos/ProdutosPage'
import { CategoriasPage } from '@/features/categorias/CategoriasPage'

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rotas Protegidas */}
      <Route path="/" element={<AuthGuard />}>
        <Route element={<Layout />}>
          <Route index element={<PedidosPage />} />
          <Route path="produtos" element={<ProdutosPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
