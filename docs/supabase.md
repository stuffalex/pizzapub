# Integração Supabase - AgroControl (GerFarm)
**Plano: Free Tier (R$ 0/mês) | Fonte: supabase.com/docs**

---

## 1. O Que é o Supabase

O Supabase é uma plataforma **Backend-as-a-Service (BaaS) open-source** construída sobre PostgreSQL. No AgroControl, funciona como o banco de dados em nuvem e provedor de serviços de autenticação, storage, realtime e funções serverless — tudo integrado e gerenciado, sem servidor para manter.

> O Spring Boot se conecta ao Supabase **exatamente como a qualquer PostgreSQL** — via JDBC na porta 5432.

---

## 2. Recursos do Free Tier Utilizados

| Recurso | Limite Gratuito | Uso no AgroControl |
|---|---|---|
| **PostgreSQL (Banco)** | 500 MB | ✅ Banco principal de todos os dados |
| **Requisições à API** | Ilimitadas | ✅ Todas as chamadas da API Spring Boot |
| **Usuários Ativos (Auth)** | 50.000 MAU | ✅ Usuários da fazenda (estimativa: < 20) |
| **File Storage** | 1 GB | ✅ Fotos de animais, relatórios PDF/Excel |
| **Egress (Tráfego)** | 5 GB/mês | ✅ Suficiente para uso interno da fazenda |
| **Realtime (WebSockets)** | 200 conexões simultâneas | ✅ Dashboard com atualizações ao vivo |
| **Edge Functions** | 500K invocações/mês | ✅ Alertas automáticos, tarefas agendadas |
| **Projetos Ativos** | 2 projetos | ✅ 1 produção + 1 desenvolvimento |
| **Row Level Security (RLS)** | Ilimitado | ✅ Segurança em nível de linha |
| **PostgREST (API REST auto)** | Incluído | ✅ API gerada automaticamente do schema |
| **Dashboard Visual** | Incluído | ✅ Administração visual do banco |

> ⚠️ **Atenção Free Tier:** Projetos são **pausados após 7 dias de inatividade**. Durante desenvolvimento ativo, isso não é problema. Para produção, considere o plano Pro ($25/mês) quando necessário.

---

## 3. Arquitetura com Supabase

```
╔══════════════════════════════════════════════════════════════╗
║              SUPABASE CLOUD (Free Tier)                      ║
║                                                              ║
║  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐  ║
║  │  PostgreSQL    │  │ Supabase     │  │ Supabase        │  ║
║  │  (Banco Dados) │  │ Auth (JWT)   │  │ Storage (1 GB)  │  ║
║  └───────┬────────┘  └──────┬───────┘  └────────┬────────┘  ║
║          │                  │                   │           ║
║  ┌───────┴──────────────────┴───────────────────┴────────┐  ║
║  │     Supabase Realtime (WebSockets) + Edge Functions    ║  ║
║  └────────────────────────────────────────────────────────┘  ║
╚═══════════════════════════════╤══════════════════════════════╝
                                │
              ┌─────────────────┼─────────────────┐
              │ JDBC porta 5432 │ HTTPS + WS       │
              ▼                 ▼                  ▼
  ┌────────────────────┐  ┌─────────────────────────────────┐
  │ Spring Boot API    │  │ Angular SPA                     │
  │ Java 25            │  │ + @supabase/supabase-js         │
  │ + Spring Security  │  │   (Auth, Realtime, Storage)     │
  │ + JPA / Hibernate  │  └─────────────────────────────────┘
  └────────────────────┘
```

---

## 4. Conexão Spring Boot → Supabase PostgreSQL

> [!CAUTION]
> **ERRO CRÍTICO A EVITAR — PORTA ERRADA:**
> O Supabase oferece dois poolers de conexão: **Transaction Pooler (porta 6543)** e **Session Pooler (porta 5432)**.
> O Hibernate/JPA usa **Prepared Statements** que são **incompatíveis com o Transaction Pooler (porta 6543)**.
> Usar a porta 6543 com Spring Boot causará erros fatais como: `prepared statement "S_1" does not exist`.
> **Spring Boot DEVE sempre usar a porta 5432.**

### Modos de Conexão

| Modo | Porta | Prepared Statements | Indicado Para |
|---|:---:|:---:|---|
| **Conexão Direta** | `5432` | ✅ Sim | Spring Boot (JPA) em redes IPv6 |
| **Session Pooler** | `5432` | ✅ Sim | **Spring Boot (JPA) em redes IPv4** ← Usar este |
| **Transaction Pooler** | `6543` | ❌ NÃO | Serverless / Edge Functions |

### `application.properties` — Configuração Correta

```properties
# ============================================================
# CONEXÃO SUPABASE - Spring Boot / JPA / Hibernate
# SEMPRE usar porta 5432 (Session Pooler ou Direto)
# ============================================================

spring.datasource.url=jdbc:postgresql://db.[SEU-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
spring.datasource.username=postgres
spring.datasource.password=${SUPABASE_DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Flyway (migrações versionadas)
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# HikariCP — Pool de conexões
# Free tier suporta ~20 conexões simultâneas
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000
```

> ⚠️ **Senhas com caracteres especiais:** Faça percent-encoding. Exemplo: `#` → `%23`, `@` → `%40`.

### Variáveis de Ambiente (nunca comitar senhas)

```bash
# .env (ignorado pelo .gitignore)
SUPABASE_URL=https://[SEU-PROJECT-REF].supabase.co
SUPABASE_DB_PASSWORD=SuaSenhaSegura
SUPABASE_ANON_KEY=[anon-public-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]  # ← NUNCA expor no frontend
SUPABASE_JWT_SECRET=[jwt-secret]
```

### `pom.xml` — Dependências

```xml
<!-- PostgreSQL JDBC Driver -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Flyway para migrações versionadas -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>

<!-- AWS SDK para S3 (usado para Supabase Storage - API compatível) -->
<dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>
    <version>2.20.0</version>
</dependency>

<!-- Spring Security + OAuth2 Resource Server (JWT do Supabase) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
</dependency>
```

---

## 5. Autenticação — Supabase Auth (substitui Keycloak)

Com a adoção do Supabase, o **Supabase Auth substitui o Keycloak**, simplificando a infraestrutura: sem container Docker adicional, sem servidor para manter, zero custo.

### Como Funciona

1. Angular usa `@supabase/supabase-js` para autenticar o usuário (email/senha ou OAuth)
2. Supabase Auth devolve um **JWT assinado com HMAC-SHA256**
3. Angular envia o JWT no header `Authorization: Bearer <token>` em cada requisição ao Spring Boot
4. Spring Boot valida a assinatura do JWT usando o **JWT Secret do projeto Supabase**

### `SecurityConfig.java`

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${supabase.jwt.secret}")
    private String jwtSecret;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.decoder(jwtDecoder()))
            );
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKey secretKey = new SecretKeySpec(
            jwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(secretKey).build();
    }
}
```

### Perfis de Acesso via JWT Claims

```sql
-- SQL no Supabase Dashboard (SQL Editor)
-- Trigger: ao criar usuário, insere perfil padrão OPERADOR

CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    role TEXT DEFAULT 'OPERADOR' CHECK (role IN ('ADMIN', 'OPERADOR', 'VIEWER'))
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'OPERADOR');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Angular — Auth Service

```typescript
// core/auth/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;
  public session = signal<Session | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    // Escuta mudanças de sessão reativas
    this.supabase.auth.onAuthStateChange((_, session) => {
      this.session.set(session);
    });
  }

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  getAccessToken(): string | null {
    return this.session()?.access_token ?? null;
  }
}
```

### Angular — Route Guard

```typescript
// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.session()) return true;

  router.navigate(['/login']);
  return false;
};
```

### Angular — HTTP Interceptor (envia JWT automaticamente)

```typescript
// core/http/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
```

---

## 6. Row Level Security (RLS) — Segurança no Banco

O RLS define políticas de acesso diretamente no PostgreSQL. Mesmo com a `anon_key` exposta no Angular, o usuário só acessa o que as políticas permitem.

> ⚠️ **RLS não é habilitado automaticamente em tabelas criadas por SQL.** É obrigatório executar `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` manualmente.

```sql
-- Habilitar RLS em todas as tabelas do AgroControl
ALTER TABLE tb_animal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_lote_engorda ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_safra ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_item_estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_colheita ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_movimentacao_estoque ENABLE ROW LEVEL SECURITY;

-- Política: apenas usuários autenticados podem LER animais
CREATE POLICY "animais_select_autenticados"
ON tb_animal FOR SELECT
USING (auth.role() = 'authenticated');

-- Política: apenas ADMIN pode DELETAR animais
CREATE POLICY "animais_delete_admin"
ON tb_animal FOR DELETE
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
);

-- Política: ADMIN e OPERADOR podem INSERIR e ATUALIZAR
CREATE POLICY "animais_write_operador"
ON tb_animal FOR ALL
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('ADMIN', 'OPERADOR')
);
```

---

## 7. Storage — Armazenamento de Arquivos

### Buckets a Criar

| Bucket | Conteúdo | Tamanho Máx. (Free) | Acesso |
|---|---|---|---|
| `animais-fotos` | Fotos dos animais (JPEG/PNG) | 50 MB/arquivo | Privado |
| `relatorios` | Relatórios exportados (PDF/Excel) | 50 MB/arquivo | Privado |
| `documentos` | Notas fiscais, laudos veterinários | 50 MB/arquivo | Privado |

### Spring Boot — Integração via AWS S3 SDK (API Compatível)

```java
// shared/storage/SupabaseStorageConfig.java
@Configuration
public class SupabaseStorageConfig {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
            .endpointOverride(URI.create(supabaseUrl + "/storage/v1/s3"))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create("anystring", serviceRoleKey)
            ))
            .region(Region.US_EAST_1) // valor dummy obrigatório
            .build();
    }
}

// shared/storage/StorageService.java
@Service
@RequiredArgsConstructor
public class StorageService {

    private final S3Client s3Client;

    public String uploadFoto(MultipartFile file, String bucket, String path) {
        s3Client.putObject(
            PutObjectRequest.builder()
                .bucket(bucket)
                .key(path)
                .contentType(file.getContentType())
                .build(),
            RequestBody.fromBytes(file.getBytes())
        );
        return path;
    }

    public String gerarUrlPresignada(String bucket, String path) {
        S3Presigner presigner = S3Presigner.builder()
            .endpointOverride(URI.create(/* supabase url */))
            .build();

        PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(r -> r
            .signatureDuration(Duration.ofHours(1))
            .getObjectRequest(g -> g.bucket(bucket).key(path))
        );
        return presignedRequest.url().toString();
    }
}
```

### Angular — Upload Direto no Browser

```typescript
// features/animal/services/animal-foto.service.ts
@Injectable({ providedIn: 'root' })
export class AnimalFotoService {

  constructor(private supabase: SupabaseService) {}

  async uploadFoto(file: File, animalId: string): Promise<string> {
    const path = `${animalId}/${Date.now()}-${file.name}`;

    const { error } = await this.supabase.client
      .storage
      .from('animais-fotos')
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data } = this.supabase.client
      .storage
      .from('animais-fotos')
      .getPublicUrl(path);

    return data.publicUrl;
  }
}
```

---

## 8. Realtime — Dashboard com Atualizações ao Vivo

O Supabase Realtime usa **WebSockets** para notificar o Angular quando dados mudam no banco.

> ⚠️ **Importante:** Sempre chamar `supabase.removeChannel(channel)` no `ngOnDestroy()` para evitar vazamento de memória e conexões abertas desnecessariamente.

### Casos de Uso no AgroControl

| Feature | Tabela Escutada | Evento |
|---|---|---|
| Saldo de estoque ao vivo | `tb_item_estoque` | UPDATE |
| Alertas de desmame automáticos | `tb_animal` | UPDATE (status) |
| Lotes finalizados no dashboard | `tb_lote_engorda` | UPDATE |
| Movimentações em tempo real | `tb_movimentacao_estoque` | INSERT |

### Angular — Realtime Service

```typescript
// features/estoque/services/estoque-realtime.service.ts
import { Injectable, signal, OnDestroy } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseService } from '../../../core/supabase/supabase.service';

@Injectable()
export class EstoqueRealtimeService implements OnDestroy {

  public estoqueAtualizado = signal<any | null>(null);
  private channel!: RealtimeChannel;

  constructor(private supabase: SupabaseService) {
    this.channel = this.supabase.client
      .channel('estoque-ao-vivo')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tb_item_estoque' },
        (payload) => this.estoqueAtualizado.set(payload.new)
      )
      .subscribe();
  }

  ngOnDestroy() {
    // OBRIGATÓRIO: evita vazamento de conexões
    this.supabase.client.removeChannel(this.channel);
  }
}
```

---

## 9. Edge Functions — Alertas Automáticos Serverless

Edge Functions rodam em **Deno** (TypeScript) e são invocadas via HTTP. São usadas para lógica leve fora do Spring Boot.

### Funções Planejadas para o AgroControl

| Função | Trigger | O Que Faz |
|---|---|---|
| `alerta-desmame` | Cron diário (00:00h) | Busca animais com desmame nos próximos 15 dias e envia e-mail |
| `alerta-estoque-baixo` | Webhook após INSERT em movimentacao | Verifica saldo e notifica se abaixo do mínimo |
| `relatorio-mensal` | Cron dia 1 de cada mês | Gera resumo mensal e salva no Storage |

### Exemplo — Alerta de Estoque Baixo

```typescript
// supabase/functions/alerta-estoque-baixo/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: itens } = await supabase
    .from('tb_item_estoque')
    .select('nome, quantidade_atual, quantidade_minima_alerta')
    .lt('quantidade_atual', supabase.raw('quantidade_minima_alerta'));

  if (itens && itens.length > 0) {
    console.log(`⚠️ ${itens.length} itens com estoque abaixo do mínimo:`, itens);
    // Aqui: enviar e-mail via Resend.com ou similar
  }

  return new Response(JSON.stringify({ alertas: itens?.length ?? 0 }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### Deploy da Edge Function

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login e link ao projeto
supabase login
supabase link --project-ref [SEU-PROJECT-REF]

# Deploy
supabase functions deploy alerta-estoque-baixo
```

---

## 10. Supabase JS SDK no Angular — Configuração Central

### Instalação

```bash
npm install @supabase/supabase-js
```

### `environment.ts`

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  supabaseUrl: 'https://[SEU-PROJECT-REF].supabase.co',
  supabaseAnonKey: '[SUA-ANON-KEY]'
  // ⛔ NUNCA colocar service_role_key aqui — apenas no backend Spring Boot
};
```

### Service Central (`core/supabase/supabase.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private _client: SupabaseClient;

  constructor() {
    this._client = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  get client(): SupabaseClient {
    return this._client;
  }
}
```

### Gerar Tipos TypeScript do Schema (Supabase CLI)

```bash
# Gera tipos TypeScript automaticamente a partir do schema do banco
supabase gen types typescript --project-id [SEU-PROJECT-REF] > src/app/core/types/database.types.ts
```

Isso cria um arquivo com tipagem forte de todas as tabelas:

```typescript
// uso no service (com tipagem completa)
const { data } = await supabase
  .from('tb_animal')    // ← autocompletar com nome das colunas
  .select('id, identificador, status');
```

---

## 11. Configuração do Projeto no Supabase (Passo a Passo)

### Passo 1 — Criar o Projeto
1. Acesse [supabase.com](https://supabase.com) → **New Project**
2. Nome: `agrocontrol-prod`
3. Região: **South America (São Paulo)** — menor latência para o Brasil
4. Senha do banco: gere forte e salve no gerenciador de senhas

### Passo 2 — Executar o DDL
1. Painel → **SQL Editor → New Query**
2. Cole e execute os scripts de `estrutura_dados.md`
3. Execute o SQL de RLS da seção 6

### Passo 3 — Coletar as Chaves
1. Painel → **Project Settings → API**
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY` (frontend)
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (backend Spring Boot apenas)
2. Painel → **Project Settings → Database → Connection String (JDBC)**
   - Copiar a URL com **porta 5432** → `SUPABASE_DB_URL`
3. Painel → **Project Settings → JWT Settings**
   - `JWT Secret` → `SUPABASE_JWT_SECRET` (Spring Boot Security)

### Passo 4 — Configurar Auth
1. **Authentication → Providers → Email** (já habilitado)
2. Desabilitar "Confirm email" durante desenvolvimento
3. Criar a trigger de `user_profiles` (SQL da seção 5)

### Passo 5 — Criar Buckets de Storage
1. **Storage → New Bucket**
2. Criar: `animais-fotos` (privado), `relatorios` (privado), `documentos` (privado)

### Passo 6 — Desenvolvimento Local com Supabase CLI
```bash
# Instalar CLI
npm install -g supabase

# Inicializar projeto local (roda tudo via Docker)
supabase init
supabase start

# Rodar migrações localmente
supabase migration new nome_da_migracao
supabase db push

# Parar ambiente local
supabase stop
```

---

## 12. Comparativo: Keycloak (antes) vs Supabase Auth (agora)

| Aspecto | Keycloak (abandonado) | Supabase Auth (adotado) |
|---|---|---|
| Hosting | Container Docker local | Gerenciado pela Supabase (nuvem) |
| Manutenção | Alta (updates, backup, config) | **Zero** |
| Custo | Infra local (energia, hardware) | Gratuito no free tier |
| Configuração inicial | Complexa (Realm, Clients, Flows) | Dashboard visual simples |
| OAuth2 / OIDC | ✅ Completo | ✅ Completo |
| JWT | ✅ Emite e valida | ✅ Emite e valida |
| Roles | Via Realm e Clients | Via `user_metadata` + RLS |
| Mobile (PKCE) | ✅ Suportado | ✅ Nativo |
| MFA | ✅ Suportado | ✅ Nativo (TOTP, SMS) |
| Providers sociais | Via config manual | Google, GitHub, Apple etc. prontos |

---

## 13. Estimativa de Uso — Free Tier

| Item | Estimativa (1 ano) | % do Free Tier |
|---|---|---|
| Banco de dados (dados da fazenda) | ~50–80 MB | 10–16% |
| Storage (fotos + relatórios) | ~200–500 MB | 20–50% |
| Egress (uso interno da fazenda) | < 1 GB/mês | 20% |
| Auth (usuários da fazenda) | < 20 usuários | 0.04% |
| Edge Functions (alertas diários) | ~30/mês | 0.006% |

> ✅ O AgroControl operará confortavelmente dentro do free tier por vários anos de operação.
