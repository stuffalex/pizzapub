import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { CardapioPage } from '@/features/cardapio/CardapioPage'
import { CheckoutPage } from '@/features/checkout/CheckoutPage'
import { ConfirmacaoPage } from '@/features/confirmacao/ConfirmacaoPage'
import { AcompanhamentoPage } from '@/features/acompanhamento/AcompanhamentoPage'
import { MeusPedidosPage } from '@/features/acompanhamento/MeusPedidosPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { AuthGuard } from '@/core/guards/auth.guard'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><CardapioPage /></Layout>} />
      <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
      <Route path="/confirmacao/:id" element={<Layout><ConfirmacaoPage /></Layout>} />
      <Route path="/acompanhar/:codigo" element={<Layout><AcompanhamentoPage /></Layout>} />
      <Route path="/meus-pedidos" element={<Layout><MeusPedidosPage /></Layout>} />
      
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />

      {/* Exemplo de rotas protegidas (M4 / painel interno pode ficar aqui ou em outro app) */}
      <Route element={<AuthGuard />}>
        {/* <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} /> */}
      </Route>
    </Routes>
  )
}
