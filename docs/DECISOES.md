# 🧠 Decisões Técnicas — PizzaPub

> Registro de decisões de arquitetura e design tomadas ao longo do projeto.
> Formato: **ADR** (Architecture Decision Record).

---

## ADR-001 · Java Records como DTOs

**Data**: 2026-07
**Status**: ✅ Aceito

**Contexto**: Precisávamos de objetos para transferência de dados entre as camadas (requests e responses da API).

**Decisão**: Usar `record` do Java (disponível desde o Java 16) em vez de classes com Lombok.

**Consequências**:
- ✅ Imutabilidade por padrão
- ✅ `equals()`, `hashCode()`, `toString()` gerados automaticamente
- ✅ Sintaxe concisa e expressiva
- ⚠️ Records não suportam herança — OK para nosso caso de uso

---

## ADR-002 · Preço de Pizza Meio a Meio = Maior Sabor

**Data**: 2026-07
**Status**: ✅ Aceito

**Contexto**: Uma pizza pode ter 2 sabores. Precisávamos definir como calcular o preço.

**Decisão**: O `precoUnitario` do `ItemPedido` é o **maior preço** entre os sabores selecionados.

**Alternativa considerada**: Média dos preços (código comentado em `PedidoService.criarItem()`).

**Consequências**:
- ✅ Prática padrão no mercado de pizzarias brasileiro
- ✅ Cálculo simples e auditável
- ✅ Transparente para o cliente (paga o mais caro, não a média)
- ⚠️ Pode ser revisado se o cliente preferir a média

---

## ADR-003 · Cliente Criado Automaticamente pelo CPF

**Data**: 2026-07
**Status**: ✅ Aceito

**Contexto**: O cliente pode fazer um pedido sem ter um cadastro prévio.

**Decisão**: Se o CPF informado no pedido não existir no banco, um novo `Cliente` é criado automaticamente com apenas o CPF. Os dados complementares (nome, telefone, endereço) podem ser preenchidos depois.

**Consequências**:
- ✅ Reduz atrito no primeiro pedido (sem cadastro obrigatório)
- ✅ Permite identificar clientes recorrentes pelo CPF
- ⚠️ Cliente pode ter dados incompletos — exige complementação futura

---

## ADR-004 · H2 em Memória para Desenvolvimento

**Data**: 2026-07
**Status**: ✅ Aceito

**Contexto**: Precisávamos de um banco de dados para desenvolvimento sem dependências externas.

**Decisão**: H2 em memória durante desenvolvimento; Supabase (PostgreSQL) em produção.

**Consequências**:
- ✅ Zero configuração para rodar localmente
- ✅ Banco sempre limpo ao reiniciar (com dados de seed via `data.sql`)
- ⚠️ Dados são perdidos a cada restart — comportamento esperado em dev
- ⚠️ Diferenças sutis entre H2 e PostgreSQL (ex: funções SQL) — mitigado pelo Flyway

---

## ADR-005 · React (Vite) como Framework Frontend

**Data**: 2026-08
**Status**: ✅ Aceito

**Contexto**: Escolha do framework para os dois frontends (cardápio online e painel de pedidos).

**Decisão**: React com Vite como bundler e TypeScript.

**Alternativa considerada**: Vue.js.

**Razões**:
- Maior ecossistema e adoção no mercado brasileiro
- SDK do Supabase com suporte de primeira classe para React
- Port `localhost:5173` já pré-configurado no backend (`@CrossOrigin`)
- TanStack Query (React Query) ideal para sincronização do painel de pedidos
- Maior disponibilidade de devs e conteúdo em PT-BR

---

## ADR-006 · Dois Repositórios de Frontend Separados

**Data**: 2026-08
**Status**: ✅ Aceito

**Contexto**: Os dois frontends têm públicos, objetivos e ciclos de deploy distintos.

**Decisão**: Repositórios separados: `pizzapub-menu` (cardápio público) e `pizzapub-panel` (painel interno).

**Alternativa considerada**: Monorepo com ambos os frontends.

**Razões**:
- Deploy independente e facilitado (Frontend pode ir para Vercel/Netlify; Backend para Render/Railway/AWS).
- Permissões de acesso separadas (painel é privado).
- Menor complexidade de configuração para o time.
- Escalabilidade futura independente.

---

## ADR-007 · JWT Próprio vs. Supabase Auth

**Data**: 2026-08
**Status**: 🔄 Em avaliação (M2)

**Contexto**: Precisamos de autenticação para os frontends e para proteger os endpoints da API.

**Opção A**: JWT próprio com Spring Security (implementação manual no backend).

**Opção B**: Supabase Auth como provedor de identidade.

**Análise**:
| | JWT Próprio | Supabase Auth |
|---|---|---|
| Controle | Total | Parcial (depende do Supabase) |
| Implementação | Maior esforço | Pronto para usar |
| Custo | Zero | Gratuito até certo limite |
| Flexibilidade | Alta | Média |
| Maturidade no projeto | Boa prática Spring | Depende do SDK JS |

**Decisão pendente**: A ser definida ao iniciar M2. Recomendação atual: JWT próprio para manter o controle no backend Spring Boot.

---

*Para adicionar uma nova decisão, copie o template abaixo:*

```markdown
## ADR-XXX · Título da Decisão

**Data**: AAAA-MM
**Status**: ✅ Aceito / 🔄 Em avaliação / 🚫 Rejeitado / ⚠️ Depreciado

**Contexto**: Descreva o problema ou situação que motivou a decisão.

**Decisão**: O que foi decidido.

**Alternativa considerada**: O que mais foi avaliado e por que foi descartado.

**Consequências**:
- ✅ Benefícios
- ⚠️ Trade-offs e riscos
```
