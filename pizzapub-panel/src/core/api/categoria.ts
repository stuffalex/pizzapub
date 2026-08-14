import api from './api'

export interface Categoria {
  id: number
  nome: string
}

export interface CadastroCategoriaDTO {
  nome: string
}

export const categoriaService = {
  async listarTodos(): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>('/api/categorias')
    return response.data
  },
  
  async criar(data: CadastroCategoriaDTO): Promise<Categoria> {
    const response = await api.post<Categoria>('/api/categorias', data)
    return response.data
  },
  
  async deletar(id: number): Promise<void> {
    await api.delete(`/api/categorias/${id}`)
  }
}
