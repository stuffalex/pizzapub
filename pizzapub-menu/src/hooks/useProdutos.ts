import { useQuery } from '@tanstack/react-query'
import api from '@/core/api/api'
import type { Produto } from '@/types/produto'

export function useProdutos() {
  return useQuery<Produto[]>({
    queryKey: ['produtos'],
    queryFn: async () => {
      const { data } = await api.get<Produto[]>('/api/produtos')
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 min
  })
}
