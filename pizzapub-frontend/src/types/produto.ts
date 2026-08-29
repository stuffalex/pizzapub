export interface Variacao {
  id: number
  nome: string
  preco: number
  disponivel: boolean
}

export interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  urlImagem: string | null
  disponivel?: boolean
  variacoes?: Variacao[]
  categoria?: {
    id: number
    nome: string
    ordem?: number
  }
}
