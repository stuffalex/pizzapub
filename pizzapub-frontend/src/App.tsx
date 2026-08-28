import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { CardapioPage } from '@/features/cardapio/CardapioPage'
import { CheckoutPage } from '@/features/checkout/CheckoutPage'
import { ConfirmacaoPage } from '@/features/confirmacao/ConfirmacaoPage'
import { AcompanhamentoPage } from '@/features/acompanhamento/AcompanhamentoPage'
import { MeusPedidosPage } from '@/features/acompanhamento/MeusPedidosPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { AuthGuard } from '@/core/guards/auth.guard'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { PedidosPage } from '@/features/pedidos/PedidosPage'
import { ProdutosPage } from '@/features/produtos/ProdutosPage'
import { CategoriasPage } from '@/features/categorias/CategoriasPage'
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><CardapioPage /></Layout>} />
      <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
      <Route path="/confirmacao/:id" element={<Layout><ConfirmacaoPage /></Layout>} />
      <Route path="/acompanhar/:codigo" element={<Layout><AcompanhamentoPage /></Layout>} />
      <Route path="/meus-pedidos" element={<Layout><MeusPedidosPage /></Layout>} />
      
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />

      {/* Rotas protegidas de Admin */}
      <Route path="/admin" element={<AuthGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<PedidosPage />} />
          <Route path="produtos" element={<ProdutosPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
