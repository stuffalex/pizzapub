export interface ItemPedidoSabor {
  id: number
  nome: string
  preco: number
}

export interface ItemPedido {
  id: number
  sabores: ItemPedidoSabor[]
  quantidade: number
  observacao: string | null
  precoUnitario: number
  variacao: string | null
}

export interface Cliente {
  id: number
  nome: string
  cpf: string
  telefone: string | null
  email: string | null
}

export interface Endereco {
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  cidade: string
  uf: string
  cep: string | null
}

export type StatusPedido = 'RECEBIDO' | 'PREPARANDO' | 'A_CAMINHO' | 'ENTREGUE' | 'CANCELADO'

export interface PedidoResponse {
  id: number
  codigoRastreio: string
  status: StatusPedido
  cliente: Cliente
  enderecoEntrega: string
  itens: ItemPedido[]
  observacao: string | null
  valorTotal: number
  dataCriacao: string
}

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
