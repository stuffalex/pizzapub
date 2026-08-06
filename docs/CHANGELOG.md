# 📋 Changelog — PizzaPub

> Todas as mudanças notáveis neste projeto são documentadas aqui.
> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [Não lançado]

### Próximo (M4 e M5)
- Painel de Pedidos — frontend React interno (M4)
- Integração Supabase — Produção (M5)

---

## [0.3.0] — 2026-08-05

### ✅ Adicionado — M3 · Cardápio Online (Frontend)
- Projeto Vite + React + TypeScript em `pizzapub-menu`
- Design System responsivo (paleta quente, tipografia Outfit/Inter, CSS Modules)
- Integração Axios com API Spring Boot (baseURL configurada via variáveis de ambiente)
- **Componentes globais**: Layout, Header (com ícone animado do carrinho), Footer, Modal, Skeleton Loaders
- **Store Zustand**:
  - `useCartStore`: persistência no `localStorage` e lógica de subtotal
  - `useAuthStore`: preparado para M5 (sessão Supabase)
- **Feature Cardápio (`/`)**:
  - Grid de pizzas (consumindo `GET /api/produtos` via React Query)
  - Filtro por nome
  - Modal de detalhes com seletor de "meio a meio" e observações
- **Feature Carrinho**: Drawer lateral animado para gerenciar itens
- **Feature Checkout (`/checkout`)**:
  - Formulário com máscaras (CPF e telefone)
  - Validação frontend e envio via `POST /api/pedidos`
  - Resumo fixo na lateral
- **Feature Confirmação (`/confirmacao`)**: Tela de sucesso pós-pedido
- **Auth do cliente**: Tela de login restrito (`/login`)
- **Preparação M5**: Types de banco de dados vazios, variáveis Supabase comentadas no environment e README dedicado.

---

## [0.2.0] — 2026-08-05

### ✅ Adicionado — M2 · Autenticação & Segurança
- **Spring Security 7** integrado com política stateless (JWT)
- Entidade `Usuario` implementando `UserDetails` (tabela `tb_usuario`)
- Enum `PerfilUsuario`: `CLIENTE`, `ATENDENTE`, `ADMIN`
- `JwtService` — geração e validação de tokens (jjwt 0.12.6, HS256, 24h)
- `AuthService` — fluxos de login e registro com BCryptPasswordEncoder
- `JwtAuthenticationFilter` — filtro `OncePerRequestFilter` que valida Bearer tokens
- `SecurityConfig` — `SecurityFilterChain` com regras completas de autorização por perfil
- `POST /api/auth/login` — público, retorna JWT
- `POST /api/auth/register` — restrito a `ADMIN`
- `DataInitializer` — cria `admin@pizzapub.com / admin123` na inicialização
- Botão **Authorize** no Swagger UI (Bearer JWT via `OpenApiConfig`)

### 🔒 Matriz de Autorização
| Endpoint | Acesso |
|---|---|
| `GET /api/produtos/**` | Público |
| `POST /api/auth/login` | Público |
| `GET /swagger-ui/**`, `/v3/api-docs/**`, `/h2-console/**` | Público |
| `POST /api/pedidos` | CLIENTE, ATENDENTE, ADMIN |
| `GET /api/pedidos/**` | ATENDENTE, ADMIN |
| `POST /api/produtos` | ADMIN |
| `DELETE /api/produtos/**` | ADMIN |
| `POST /api/auth/register` | ADMIN |

### 🐛 Corrigido
- Import faltante de `Endereco` em `PedidoService` (causaria erro em runtime)

---

## [0.1.0] — 2026-08-05

### ✅ Adicionado
- **Backend Core** (M1 concluído)
- API REST com Spring Boot 4.0.6 + Java 25
- CRUD completo de produtos (`/api/produtos`)
  - `GET /api/produtos` — listar todos
  - `POST /api/produtos` — cadastrar
  - `GET /api/produtos/{id}` — buscar por ID
  - `DELETE /api/produtos/{id}` — remover
- Criação de pedidos (`/api/pedidos`)
  - `POST /api/pedidos` — criar pedido
  - `GET /api/pedidos/{id}` — buscar por ID
- Suporte a pizzas inteiras e meio a meio
- Regra de negócio: preço = maior sabor em pizzas meio a meio
- Criação automática de cliente por CPF
- Banco H2 em memória com 7 pizzas pré-cadastradas (`data.sql`)
- Documentação Swagger UI em `/swagger-ui.html`
- CORS habilitado para `localhost:5173` (React/Vite)
- Javadoc em todas as classes
- `README.md`, `ARCHITECTURE.md` e `docs/ROADMAP.md`

### 🏗️ Arquitetura
- Estrutura em camadas: Controller → Service → Repository → Domain
- DTOs como Java Records
- Lombok para redução de boilerplate
- Bean Validation nos DTOs e entidades

---

*Formato: `[versão] — AAAA-MM-DD`*
