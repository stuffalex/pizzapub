# 🗺️ PizzaPub — Roadmap & Planejamento

> **Documento vivo** — atualizado conforme o progresso do projeto.
> Qualquer membro do time ou cliente pode consultar este arquivo para entender o estado atual do desenvolvimento.

---

## 📊 Status Geral

| Milestone | Status | Progresso |
|---|---|---|
| M1 · Backend Core | ✅ Concluído | ██████████ 100% |
| M2 · Autenticação & Segurança | ✅ Concluído | ██████████ 100% |
| M3 · Cardápio Online (Frontend) | ✅ Concluído | ██████████ 100% |
| M4 · Painel de Pedidos (Frontend) | 🔄 Em andamento | ░░░░░░░░░░ 0% |
| M5 · Integração Supabase (Produção) | ⏳ Aguardando | ░░░░░░░░░░ 0% |
| M6 · Deploy & DevOps | ⏳ Aguardando | ░░░░░░░░░░ 0% |

---

## ✅ M1 · Backend Core

> **Meta**: API REST funcional com operações de produto e pedido, banco em memória (H2) e documentação Swagger.
> **Status**: ✅ Concluído

### 🎯 F1.1 · Domínio & Persistência

- [x] Modelar entidade `Produto` (nome, descrição, preço, urlImagem)
- [x] Modelar entidade `Cliente` (nome, cpf, telefone, email, endereço)
- [x] Modelar entidade `Endereco` como `@Embeddable`
- [x] Modelar entidade `Pedido` (cliente + lista de itens)
- [x] Modelar entidade `ItemPedido` (pedido, sabores ManyToMany, quantidade, preço, observação)
- [x] Configurar banco H2 em memória (`application.yaml`)
- [x] Popular banco com 7 pizzas iniciais via `data.sql`

### 🎯 F1.2 · CRUD de Produtos

- [x] `GET /api/produtos` — listar todos
- [x] `POST /api/produtos` — cadastrar produto
- [x] `GET /api/produtos/{id}` — buscar por ID
- [x] `DELETE /api/produtos/{id}` — remover produto
- [x] Validação de entrada com Bean Validation (`@NotBlank`, `@Positive`)
- [x] DTO de entrada: `CadastroProdutoDTO` (record Java)

### 🎯 F1.3 · Gestão de Pedidos

- [x] `POST /api/pedidos` — criar pedido
- [x] `GET /api/pedidos/{id}` — buscar pedido por ID
- [x] Criação automática de cliente se CPF não existir
- [x] Suporte a pizza inteira (1 sabor) e meio a meio (2+ sabores)
- [x] Regra de negócio: preço = maior preço entre os sabores
- [x] Persistência transacional com `@Transactional`
- [x] DTOs: `PedidoDTO`, `ItemPedidoDTO`

### 🎯 F1.4 · Documentação & Config

- [x] Configurar Swagger UI via Springdoc OpenAPI
- [x] `OpenApiConfig` com título, versão, contato
- [x] CORS configurado para `localhost:5173` (React/Vite)
- [x] Javadoc em todas as classes (domain, service, controller)
- [x] `README.md` completo
- [x] `ARCHITECTURE.md` com diagramas Mermaid
- [x] Pasta `docs/` com roadmap (este arquivo)

---

## ✅ M2 · Autenticação & Segurança

> **Meta**: Proteger os endpoints com JWT, definir perfis de acesso e preparar o sistema para múltiplos usuários.
> **Status**: ✅ Concluído

### 🎯 F2.1 · Spring Security + JWT

- [x] Adicionar dependência `spring-boot-starter-security` no `build.gradle.kts`
- [x] Adicionar dependência `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (v0.12.6)
- [x] Criar entidade `Usuario` (id, email, senha, perfil)
  - [x] Perfis: `CLIENTE`, `ATENDENTE`, `ADMIN`
- [x] Criar `UsuarioRepository` com `findByEmail`
- [x] Implementar `UsuarioDetailsService` customizado
- [x] Implementar `JwtService` (geração, validação e extração de claims)

### 🎯 F2.2 · Endpoints de Autenticação

- [x] `POST /api/auth/login` — recebe email + senha, retorna JWT
- [x] `POST /api/auth/register` — restrito a ADMIN (protegido com `@PreAuthorize`)
- [x] Criar `AuthController` e `AuthService`
- [x] Criar DTOs: `LoginRequestDTO`, `LoginResponseDTO`, `RegisterRequestDTO`

### 🎯 F2.3 · Filtro JWT & Autorização

- [x] Implementar `JwtAuthenticationFilter` (intercepta requests e valida token)
- [x] Configurar `SecurityFilterChain` em `SecurityConfig`
  - [x] Endpoints públicos: `GET /api/produtos`, `POST /api/auth/login`
  - [x] Endpoints `ATENDENTE+`: `GET /api/pedidos/**`, `PUT /api/pedidos/**`
  - [x] Endpoints `ADMIN`: `POST /api/produtos`, `DELETE /api/produtos/**`, `POST /api/auth/register`
- [x] Swagger UI sem autenticação (`/swagger-ui/**`, `/v3/api-docs/**` públicos)
- [x] Botão Authorize no Swagger (Bearer JWT via `OpenApiConfig`)

### 🎯 F2.4 · Segurança de Dados

- [x] Hash de senha com `BCryptPasswordEncoder`
- [x] Não expor entidade `Usuario` diretamente (usar DTOs `auth/` sem senha)
- [x] `POST /api/auth/register` protegido com `@PreAuthorize("hasRole('ADMIN')")`
- [x] `DataInitializer` — cria admin padrão (`admin@pizzapub.com` / `admin123`) na inicialização
- [x] Configurar tempo de expiração do JWT (24h) via `application.yaml`
- [x] Corrigir import faltante de `Endereco` no `PedidoService`

---

## ⏳ M3 · Cardápio Online (Frontend — React)

> **Meta**: Interface pública para o cliente visualizar o cardápio, montar o pedido e enviá-lo.
> **Repositório**: `pizzapub-menu` (Vite + React)
> **Status**: ⏳ Aguardando M2

### 🎯 F3.1 · Setup do Projeto

- [ ] Criar projeto com `npm create vite@latest pizzapub-menu -- --template react-ts`
- [ ] Configurar ESLint + Prettier
- [ ] Instalar dependências base:
  - [ ] `axios` — requisições HTTP
  - [ ] `react-router-dom` — rotas
  - [ ] `@tanstack/react-query` — cache e sincronização de dados
  - [ ] `zustand` — estado global do carrinho
- [ ] Configurar `baseURL` do Axios apontando para `http://localhost:8080`
- [ ] Configurar variáveis de ambiente (`.env`) para URL da API
- [ ] Criar estrutura de pastas: `components/`, `pages/`, `hooks/`, `services/`, `store/`

### 🎯 F3.2 · Design System & Layout

- [ ] Definir paleta de cores (tema quente: vermelho/laranja/creme)
- [ ] Configurar tipografia (Google Fonts — ex: `Poppins` ou `Outfit`)
- [ ] Criar componentes base:
  - [ ] `Button` (variantes: primary, secondary, ghost)
  - [ ] `Card` (card de pizza)
  - [ ] `Badge` (ex: "Novo", "Popular")
  - [ ] `Modal` (detalhes da pizza)
  - [ ] `CartSummary` (resumo do carrinho)
- [ ] Layout principal com `Header`, `Footer` e área de conteúdo
- [ ] Design responsivo (mobile-first — cliente usa celular)

### 🎯 F3.3 · Página do Cardápio

- [ ] Buscar produtos via `GET /api/produtos`
- [ ] Exibir grid de cards com imagem, nome, descrição e preço
- [ ] Filtro por categoria (quando disponível)
- [ ] Busca por nome de pizza
- [ ] Skeleton loading enquanto busca dados
- [ ] Estado de erro (API offline, produto não encontrado)
- [ ] Botão "Adicionar ao Carrinho" em cada card
- [ ] Suporte a pizza meio a meio (selecionar 2 sabores)
  - [ ] Modal para seleção do 2º sabor
  - [ ] Preview do preço calculado (maior entre os sabores)

### 🎯 F3.4 · Carrinho de Compras

- [ ] Estado global do carrinho com Zustand
- [ ] Adicionar / remover itens do carrinho
- [ ] Alterar quantidade de cada item
- [ ] Calcular subtotal, total e número de itens
- [ ] Tela/modal do carrinho
- [ ] Persistência do carrinho em `localStorage` (não perde ao fechar aba)

### 🎯 F3.5 · Checkout & Envio do Pedido

- [ ] Formulário de checkout:
  - [ ] Campo CPF do cliente (com máscara)
  - [ ] Campo endereço de entrega
  - [ ] Campo observações gerais
- [ ] Validação dos campos no frontend
- [ ] Enviar `POST /api/pedidos` com JWT no header (se logado)
- [ ] Tela de confirmação de pedido (número do pedido)
- [ ] Tela de erro com opção de tentar novamente

### 🎯 F3.6 · Autenticação do Cliente (opcional no MVP)

- [ ] Tela de login
- [ ] Tela de cadastro
- [ ] Persistir JWT no `localStorage` / `sessionStorage`
- [ ] Interceptor Axios para enviar token em todas as requests
- [ ] Logout (limpar token)
- [ ] Redirecionamento para checkout após login

---

## ⏳ M4 · Painel de Pedidos (Frontend — React)

> **Meta**: Interface interna para atendentes e admins gerenciarem pedidos e o cardápio em tempo real.
> **Repositório**: `pizzapub-panel` (Vite + React)
> **Status**: ⏳ Aguardando M2 e M3

### 🎯 F4.1 · Setup do Projeto

- [ ] Criar projeto com `npm create vite@latest pizzapub-panel -- --template react-ts`
- [ ] Instalar dependências base (mesmas do M3 + extras):
  - [ ] `react-hot-toast` — notificações
  - [ ] `recharts` — gráficos de relatórios
  - [ ] `date-fns` — formatação de datas
- [ ] Rota base protegida — redireciona para login se não autenticado
- [ ] Configurar proxy para a API em desenvolvimento

### 🎯 F4.2 · Login & Controle de Acesso

- [ ] Tela de login (email + senha)
- [ ] Redirecionar para dashboard após login bem-sucedido
- [ ] Guardar JWT e dados do usuário (nome, perfil) no estado global
- [ ] Exibir menu/funcionalidades conforme perfil:
  - [ ] `ATENDENTE`: apenas pedidos
  - [ ] `ADMIN`: pedidos + cardápio + relatórios

### 🎯 F4.3 · Dashboard de Pedidos

- [ ] Buscar todos os pedidos via `GET /api/pedidos`
- [ ] Cards de pedidos organizados por status:
  - [ ] Novo / Em preparo / Saiu para entrega / Entregue / Cancelado
- [ ] Atualização automática (polling a cada 30s)
- [ ] Clicar no pedido para ver detalhes completos
- [ ] Ação: avançar status do pedido
- [ ] Ação: cancelar pedido (com motivo)
- [ ] Filtro por status
- [ ] Busca por número do pedido ou CPF

### 🎯 F4.4 · Gerenciamento do Cardápio (Admin)

- [ ] Listar todos os produtos: `GET /api/produtos`
- [ ] Formulário de cadastro de produto (nome, descrição, preço, imagem)
  - [ ] Upload de imagem → Supabase Storage (M5)
- [ ] Editar produto existente (`PUT /api/produtos/{id}`)
- [ ] Desativar/remover produto (`DELETE /api/produtos/{id}`)
- [ ] Preview de como o produto aparece no cardápio online

### 🎯 F4.5 · Relatórios Básicos (Admin)

- [ ] Total de pedidos por dia/semana/mês (gráfico de barras)
- [ ] Pizzas mais pedidas (gráfico de pizza)
- [ ] Ticket médio por período
- [ ] Exportar relatório como CSV

---

## ⏳ M5 · Integração Supabase (Produção)

> **Meta**: Substituir H2 por PostgreSQL gerenciado no Supabase, com storage de imagens e autenticação robusta.
> **Status**: ⏳ Aguardando M2

### 🎯 F5.1 · Banco de Dados PostgreSQL

- [ ] Criar projeto no Supabase
- [ ] Obter connection string do PostgreSQL
- [ ] Adicionar dependência `postgresql` no `build.gradle.kts`
- [ ] Criar `application-prod.yaml` com configurações do Supabase
- [ ] Configurar Flyway para migrations versionadas
  - [ ] `V1__create_tables.sql` — criar todas as tabelas
  - [ ] `V2__seed_produtos.sql` — pizzas iniciais
- [ ] Mudar `ddl-auto` de `update` para `none` em produção
- [ ] Ativar Row Level Security (RLS) nas tabelas sensíveis
- [ ] Testar toda a API contra o banco PostgreSQL

### 🎯 F5.2 · Supabase Storage (Imagens)

- [ ] Criar bucket `produtos-imagens` no Supabase Storage
- [ ] Adicionar endpoint `POST /api/produtos/{id}/imagem` no backend
- [ ] Integrar SDK do Supabase no backend para upload
- [ ] Salvar URL pública da imagem no campo `urlImagem` do produto
- [ ] Implementar upload de imagem no painel admin (F4.4)
- [ ] Servir imagens via CDN do Supabase no cardápio

### 🎯 F5.3 · Variáveis de Ambiente & Secrets

- [ ] Documentar todas as variáveis de ambiente necessárias
- [ ] Criar `.env.example` nos 3 projetos (backend + 2 frontends)
- [ ] Configurar secrets no ambiente de deploy (nunca commitar `.env`)
- [ ] Validar que nenhuma chave sensível está no código ou no repositório

---

## ⏳ M6 · Deploy & DevOps

> **Meta**: Sistema disponível em produção com CI/CD automatizado.
> **Status**: ⏳ Aguardando M5

### 🎯 F6.1 · Backend — Deploy

- [ ] Definir plataforma de deploy (Railway / Render / Fly.io)
- [ ] Criar `Dockerfile` para a API Spring Boot
- [ ] Criar `docker-compose.yml` para ambiente local completo
- [ ] Configurar variáveis de ambiente de produção na plataforma
- [ ] Configurar domínio customizado para a API

### 🎯 F6.2 · Frontend — Deploy

- [ ] Deploy do cardápio online (`pizzapub-menu`) na Vercel ou Netlify
- [ ] Deploy do painel de pedidos (`pizzapub-panel`) na Vercel ou Netlify
- [ ] Configurar variáveis de ambiente nos projetos de deploy
- [ ] Configurar domínios customizados

### 🎯 F6.3 · CI/CD

- [ ] Criar pipeline GitHub Actions para o backend:
  - [ ] Rodar testes a cada PR
  - [ ] Build e deploy automático no merge para `main`
- [ ] Criar pipeline GitHub Actions para cada frontend:
  - [ ] Lint + build check a cada PR
  - [ ] Deploy automático no merge para `main`

### 🎯 F6.4 · Monitoramento & Observabilidade

- [ ] Configurar health check endpoint (`/actuator/health`)
- [ ] Configurar logs estruturados (JSON) para produção
- [ ] Integrar Sentry (ou equivalente) para rastreamento de erros
- [ ] Configurar alertas básicos (ex: API offline)
- [ ] Documentar processo de rollback

---

## 🐛 Backlog — Issues Conhecidas & Melhorias Futuras

> Itens identificados que não pertencem a nenhum milestone atual, mas devem ser endereçados.

### Backend
- [ ] `ProdutoController.listarTodos()` — cast explícito `(List<Produto>)` deve ser refatorado
- [ ] `buscarPedidoPorId` e `buscarProdutoPorId` retornam `null` — devem lançar `NotFoundException` com 404
- [ ] Criar handler global de exceções com `@ControllerAdvice`
- [ ] Adicionar campo `status` ao `Pedido` (NOVO / EM_PREPARO / ENTREGUE / CANCELADO)
- [ ] Adicionar campos `createdAt` / `updatedAt` com `@CreationTimestamp`
- [ ] `GET /api/pedidos` — endpoint para listar todos (com paginação)
- [ ] `PUT /api/pedidos/{id}/status` — atualizar status do pedido
- [ ] `PUT /api/produtos/{id}` — editar produto
- [ ] Testes unitários para `PedidoService` e `ProdutoService`
- [ ] Testes de integração para os controllers

### Cardápio
- [ ] Suporte a mais de 2 sabores por pizza (decisão de negócio)
- [ ] Sistema de avaliação (estrelas) por produto
- [ ] Histórico de pedidos do cliente

### Painel
- [ ] Notificações em tempo real via WebSocket (novos pedidos)
- [ ] Impressão de comanda
- [ ] Estimativa de tempo de entrega configurável

---

## 📋 Convenções deste Documento

| Símbolo | Significado |
|---|---|
| ✅ | Milestone/feature concluída |
| 🔄 | Em andamento |
| ⏳ | Aguardando (bloqueada por dependência) |
| 🚫 | Cancelada |
| `[x]` | Tarefa concluída |
| `[ ]` | Tarefa pendente |
| `[/]` | Tarefa em progresso |

### Como atualizar este documento

1. Ao **iniciar** uma tarefa: mude `[ ]` para `[/]`
2. Ao **concluir** uma tarefa: mude `[/]` para `[x]`
3. Ao concluir todas as tarefas de uma feature: marque a feature com ✅
4. Ao concluir todas as features de um milestone: atualize a tabela de **Status Geral** no topo
5. Faça commit deste arquivo junto com o código da tarefa concluída

---

*Última atualização: 2026-08-05 · M2 concluído · Autor: Alexya Viana*
