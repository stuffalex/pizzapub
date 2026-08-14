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

export interface PedidoResponse {
  id: number
  cliente: Cliente
  enderecoEntrega: string // formatado ou objeto dependendo do backend. O backend retorna string?
  itens: ItemPedido[]
  observacao: string | null
  valorTotal: number
  dataCriacao: string
  // backend: adicionar STATUS depois
}
