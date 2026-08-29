Aqui está o **Guia Padrão Definitivo** de configuração e deploy do ecossistema PizzaPub (Supabase + Render + Vercel + Local).

---

## 🗄️ 1. Supabase (Banco de Dados PostgreSQL)

### Onde obter as informações no painel do Supabase:
1. Acesse **Project Settings** -> **Database**.
2. Role até a seção **Connection Pooling** (Supavisor):
   - **Mode**: Escolha **Session** (porta `5432`).
   - **Host**: Ex: `aws-0-us-east-2.pooler.supabase.com` *(conforme sua região)*.
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres.[PROJECT_REF]` *(sempre contém o ID do projeto após o ponto)*.
   - **Password**: Sua senha definida na criação do projeto.

> [!IMPORTANT]
> **Por que usar o Pooler e NÃO a conexão direta?**
> A conexão direta (`db.[PROJECT_REF].supabase.co`) possui apenas endereço **IPv6**, o que faz o Render e provedores em IPv4 falharem com `Network is unreachable`. O Pooler provê endereço **IPv4**.

---

## ☁️ 2. Render (Backend Spring Boot)

### Configurações do Web Service:
- **Environment**: `Docker`
- **Region**: Oregon (US West) ou Ohio (US East)
- **Branch**: `main`
- **Health Check Path**: `/health` (em *Settings* -> *Health Check Path*)
- **Auto-Deploy**: `Yes`

### Variáveis de Ambiente no Render (*Environment Tab*):

| Nome da Variável | Exemplo de Valor | Descrição |
| :--- | :--- | :--- |
| `DB_URL` | `jdbc:postgresql://aws-0-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require` | URL JDBC com protocolo e SSL |
| `DB_USER` | `postgres.srenitgjtunqxllbrfiq` | Usuário com o sufixo do projeto |
| `DB_PASSWORD` | `SuaSenhaForte123` | Senha do banco Supabase |
| `SUPABASE_URL` | `https://srenitgjtunqxllbrfiq.supabase.co` | URL da API REST/Storage do Supabase |
| `SUPABASE_KEY` | `eyJhbGciOi...` | Chave `anon` do Supabase |
| `PORT` | `8080` | Porta padrão exposta no Dockerfile |

---

## 🔺 3. Vercel (Frontend React + Vite)

### Configurações do Projeto na Vercel:
- **Framework Preset**: `Vite`
- **Root Directory**: `pizzapub-frontend` *(essencial marcar este diretório)*
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Variáveis de Ambiente na Vercel (*Settings -> Environment Variables*):

| Nome da Variável | Valor | Ambientes |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://pizzapub.onrender.com` | Production, Preview, Development |

---

## 💻 4. Ambientes e Arquivos `.env`

### A. Para Desenvolvimento Local (Raiz do Projeto: `.env`)
Crie o arquivo [`.env`](file:///d:/PROJETOS/pizzapub/.env) na raiz com:

```dotenv
# Banco de Dados Supabase (via IPv4 Pooler)
DB_URL=jdbc:postgresql://aws-0-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require
DB_USER=postgres.srenitgjtunqxllbrfiq
DB_PASSWORD=put@qu3Pariu

# Integração Supabase (Auth / Storage)
SUPABASE_URL=https://srenitgjtunqxllbrfiq.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_URL=https://srenitgjtunqxllbrfiq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_JJVNwCFRcmmsGkjkBSozKg_KAoSdDmT
```

### B. Para o Frontend Local (`pizzapub-frontend/.env`)
Crie o arquivo em `pizzapub-frontend/.env`:

```dotenv
# Conecta no backend local durante o desenvolvimento
VITE_API_URL=http://localhost:8080
```

---

## ⚙️ 5. Configurações Críticas no Código Já Aplicadas

### 1. `application.yaml` (Backend)
```yaml
spring:
  config:
    import: optional:dotenv:.env
  datasource:
    url: ${DB_URL}
    driverClassName: org.postgresql.Driver
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 5      # 👈 Essencial para não estourar o limite de 15 do Supabase
      minimum-idle: 2
      idle-timeout: 30000
      max-lifetime: 60000
      connection-timeout: 20000
  flyway:
    enabled: true
    baseline-on-migrate: true
    validate-on-migrate: false # 👈 Evita erro de checksum por quebra de linha Windows/Linux
```

### 2. `SecurityConfig.java` (CORS e Rotas Públicas)
```java
// Rotas públicas de monitoramento e clientes
.requestMatchers("/health", "/api/health", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
.requestMatchers(HttpMethod.POST, "/api/pedidos").permitAll()
.requestMatchers(HttpMethod.GET, "/api/pedidos/rastreio/**", "/api/pedidos/cliente/**").permitAll()

// CORS dinâmico para aceitar requisições da Vercel e Localhost
config.setAllowedOriginPatterns(List.of(
    "http://localhost:*",
    "https://*.vercel.app",
    "https://*.onrender.com"
));
```

### 3. `api.ts` (Frontend)
- Normalização de baseURL (remove `/api` ou `/` duplicados no final da URL).
- Interceptor 401 que só desloga se o usuário estiver em rotas administrativas (`/admin/*`).

---

## 📋 Checklist Rápido de Deploy

1. **Alterou código?** 
   `git add .` -> `git commit -m "..."` -> `git push origin feat/ajustes-front` (ou `main`).
2. **Atualizou variáveis no Render?** 
   Clique em *Manual Deploy -> Clear build cache & deploy*.
3. **Atualizou variáveis na Vercel?** 
   Vá em *Deployments -> ... -> Redeploy*.