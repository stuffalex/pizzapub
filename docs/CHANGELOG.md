# 📋 Changelog — PizzaPub

> Todas as mudanças notáveis neste projeto são documentadas aqui.
> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [Não lançado]

### Em desenvolvimento (M2)
- Autenticação JWT com Spring Security
- Perfis de usuário: CLIENTE, ATENDENTE, ADMIN

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
