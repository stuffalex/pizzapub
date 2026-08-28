import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CarrinhoItem } from '@/types/pedido'

interface CartState {
  items: CarrinhoItem[]
  addItem: (item: CarrinhoItem) => void
  removeItem: (id: string) => void
  updateQuantidade: (id: string, quantidade: number) => void
  clear: () => void
  total: () => number
  totalItens: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantidade: (id, quantidade) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantidade } : i
          ),
        })),

      clear: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (acc, item) => acc + item.precoUnitario * item.quantidade,
          0
        ),

      totalItens: () =>
        get().items.reduce((acc, item) => acc + item.quantidade, 0),
    }),
    { name: 'pizzapub_cart' }
  )
)
