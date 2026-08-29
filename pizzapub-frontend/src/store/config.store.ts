import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConfigState {
  nomeEmpresa: string
  slogan: string
  telefone: string
  endereco: string
  logoUrl: string | null
  setNomeEmpresa: (nome: string) => void
  setSlogan: (slogan: string) => void
  setTelefone: (tel: string) => void
  setEndereco: (end: string) => void
  setLogoUrl: (url: string | null) => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      nomeEmpresa: 'PizzaPub',
      slogan: 'Pizzas artesanais e bar',
      telefone: '(11) 3333-4444',
      endereco: 'Rua das Pizzas, 123 - Centro',
      logoUrl: null,
      setNomeEmpresa: (nome) => set({ nomeEmpresa: nome }),
      setSlogan: (slogan) => set({ slogan }),
      setTelefone: (telefone) => set({ telefone }),
      setEndereco: (endereco) => set({ endereco }),
      setLogoUrl: (logoUrl) => set({ logoUrl }),
    }),
    {
      name: '@pizzapub/empresa-config',
    }
  )
)
