import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  // M5: session: import('@supabase/supabase-js').Session | null
  setToken: (token: string | null) => void
  clear: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clear: () => set({ token: null }),
      logout: () => set({ token: null }),
    }),
    { name: 'pizzapub_auth' }
  )
)
