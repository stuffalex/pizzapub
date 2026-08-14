import api from '@/core/api/api'
import { Produto } from '@/types/produto'

export interface CadastroProduto {
  nome: string
  descricao: string
  preco: number
}

export const produtosService = {
  async listarProdutos(): Promise<Produto[]> {
    const { data } = await api.get<Produto[]>('/api/produtos')
    return data
  },

  async cadastrarProduto(produto: CadastroProduto): Promise<Produto> {
    const { data } = await api.post<Produto>('/api/produtos', produto)
    return data
  },

  async removerProduto(id: number): Promise<void> {
    await api.delete(`/api/produtos/${id}`)
  },

  async uploadImagem(id: number, file: File): Promise<{urlImagem: string}> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post<{urlImagem: string}>(`/api/produtos/${id}/imagem`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  }
}
