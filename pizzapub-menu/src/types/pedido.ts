export interface ItemPedidoDTO {
  tipo: string
  produtoIds: number[]
  quantidade: number
  observacao?: string
}

export interface PedidoDTO {
  cpfCliente: string
  enderecoEntrega?: string
  observacao?: string
  itens: ItemPedidoDTO[]
}

export interface PedidoResponse {
  id: number
  clienteId: number
  itens: ItemPedidoResponse[]
  total: number
}

export interface ItemPedidoResponse {
  id: number
  quantidade: number
  precoUnitario: number
  observacao?: string
  sabores: string[]
}

export interface CarrinhoItem {
  id: string // uuid local
  sabores: import('./produto').Produto[]
  quantidade: number
  observacao: string
  precoUnitario: number // max dos sabores
}
