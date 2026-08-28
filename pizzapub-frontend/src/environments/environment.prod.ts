// ============================================================
// Environments — Produção
// ============================================================
export const environment = {
  production: true,
  apiUrl: import.meta.env.VITE_API_URL as string,

  // M5 — Supabase (preencher com as chaves do projeto Supabase)
  // supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  // supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  // ⛔ NUNCA colocar service_role_key aqui — apenas no backend Spring Boot
}
