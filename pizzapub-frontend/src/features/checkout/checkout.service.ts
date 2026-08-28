import api from '@/core/api/api'
import type { PedidoDTO, PedidoResponse } from '@/types/pedido'

export const checkoutService = {
  async criarPedido(pedido: PedidoDTO): Promise<PedidoResponse> {
    const { data } = await api.post<PedidoResponse>('/api/pedidos', pedido)
    return data
  },
}
