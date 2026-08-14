import api from '@/core/api/api'
import { PedidoResponse } from '@/types/pedido'

export const pedidosService = {
  async listarPedidos(): Promise<PedidoResponse[]> {
    const { data } = await api.get<PedidoResponse[]>('/api/pedidos')
    return data
  },

  async buscarPedido(id: number): Promise<PedidoResponse> {
    const { data } = await api.get<PedidoResponse>(`/api/pedidos/${id}`)
    return data
  },
  
  // A ser implementado no backend futuramente:
  // async atualizarStatus(id: number, status: string): Promise<void> {
  //   await api.put(`/api/pedidos/${id}/status`, { status })
  // }
}
