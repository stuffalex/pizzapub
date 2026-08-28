# core/supabase — Reservado para M5

Este diretório será o ponto central de integração com o Supabase JS SDK.

## O que fazer no M5

### 1. Instalar o SDK
```bash
npm install @supabase/supabase-js
```

### 2. Criar o SupabaseService (`supabase.service.ts`)
```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../../environments/environment'

const supabase: SupabaseClient = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey
)

export default supabase
```

### 3. Migrar o AuthService
- Substituir `POST /api/auth/login` por `supabase.auth.signInWithPassword()`
- O JWT do Supabase Auth será enviado no header `Authorization: Bearer <token>`
- O Spring Boot continuará validando via Spring Security (configurado no `supabase.md`)

### 4. Ativar o AuthInterceptor com o novo token
- `auth.store.ts` já tem o campo `session` preparado para `Session` do Supabase
- Apenas trocar `localStorage.getItem('token')` por `session.access_token`

### 5. Gerar tipos TypeScript
```bash
supabase gen types typescript --project-id [SEU-PROJECT-REF] > src/types/database.types.ts
```

### Referência completa
Consulte `docs/supabase.md` no repositório do backend para a configuração detalhada.
