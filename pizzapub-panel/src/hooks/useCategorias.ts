import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriaService } from '@/core/api/categoria'

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: categoriaService.listarTodos
  })
}

export function useCriarCategoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoriaService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    }
  })
}

export function useDeletarCategoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: categoriaService.deletar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
    }
  })
}
