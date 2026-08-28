// ============================================================
// Environments — Dev
// ============================================================
export const environment = {
  production: false,
  apiUrl: import.meta.env.VITE_API_URL as string ?? 'http://localhost:8080',

  // M5 — Supabase (descomentar e preencher ao integrar)
  // supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  // supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  // ⛔ NUNCA colocar service_role_key aqui — apenas no backend Spring Boot
}
