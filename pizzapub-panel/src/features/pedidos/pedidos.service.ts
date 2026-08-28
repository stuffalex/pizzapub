import api from '@/core/api/api'
import { PedidoResponse, StatusPedido } from '@/types/pedido'

export const pedidosService = {
  async listarPedidos(): Promise<PedidoResponse[]> {
    const { data } = await api.get<PedidoResponse[]>('/api/pedidos')
    return data
  },

  async buscarPedido(id: number): Promise<PedidoResponse> {
    const { data } = await api.get<PedidoResponse>(`/api/pedidos/${id}`)
    return data
  },

  async atualizarStatus(id: number, status: StatusPedido): Promise<PedidoResponse> {
    const { data } = await api.patch<PedidoResponse>(`/api/pedidos/${id}/status`, { status })
    return data
  }
}

