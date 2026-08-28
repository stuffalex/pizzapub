# 🍕 PizzaPub — API de Gerenciamento de Pedidos

> **Backend** de uma pizzaria moderna que conecta o **cardápio online** ao **painel interno de pedidos**, com arquitetura escalável pronta para crescer.

---

## 📌 Sobre o Projeto

O **PizzaPub** é uma API REST desenvolvida em **Java + Spring Boot** que atua como núcleo do sistema de pedidos de uma pizzaria. Ele recebe pedidos criados pelos clientes via cardápio online (frontend React/Vite), processa as regras de negócio e expõe os dados para a tela interna de acompanhamento de pedidos.

### Visão do Sistema Completo

```
[ Cardápio Online (React) ]  ──POST /api/pedidos──►  [ PizzaPub API ]  ──►  [ Banco de Dados ]
[ Painel de Pedidos (React)] ◄──GET /api/pedidos───  [ PizzaPub API ]  ◄──  [ Banco de Dados ]
```

> 🔐 **Próximas etapas**: Autenticação JWT, integração com **Supabase** (banco de dados em produção e storage de imagens) e autorização por perfis (Atendente / Admin).

---

## 🏗️ Arquitetura

O projeto segue a **arquitetura em camadas** (Layered Architecture), separando responsabilidades de forma clara:

```
src/
└── main/java/br/com/pizzapub/
    ├── config/          # Configurações globais (OpenAPI/Swagger)
    ├── controller/      # Camada HTTP — recebe e responde requisições REST
    ├── service/         # Camada de negócio — regras e orquestração
    ├── repository/      # Camada de dados — acesso ao banco via Spring Data JPA
    ├── domain/          # Entidades JPA (mapeamento objeto-relacional)
    └── dtos/            # Objetos de transferência de dados (Records Java)
```

Para o diagrama de entidades e fluxo de camadas, veja [`ARCHITECTURE.md`](./ARCHITECTURE.md).

---

## 🛠️ Stack Tecnológica

| Tecnologia             | Versão   | Papel                                      |
|------------------------|----------|--------------------------------------------|
| Java                   | 25       | Linguagem principal                        |
| Spring Boot            | 4.0.6    | Framework web e IoC container              |
| Spring Data JPA        | —        | Abstração do banco de dados                |
| Hibernate              | —        | ORM / mapeamento objeto-relacional         |
| H2 Database            | —        | Banco em memória para desenvolvimento      |
| Supabase (PostgreSQL)  | —        | ⏳ Banco de produção (próxima etapa)        |
| Lombok                 | —        | Redução de boilerplate (getters/setters)   |
| Springdoc OpenAPI      | 2.8.5    | Geração automática do Swagger UI           |
| Spring Validation      | —        | Validação de DTOs com Bean Validation      |
| Spring Boot DevTools   | —        | Reload automático em desenvolvimento       |
| Gradle (Kotlin DSL)    | —        | Build e gerenciamento de dependências      |

---

## ⚡ Como Rodar o Projeto (Guia Rápido)

Para que o sistema funcione por completo (Backend + Frontend), você precisa rodar ambos. Siga os passos abaixo:

### Passo 1: Rodar o Backend (API)
Abra um terminal na raiz do repositório do backend (`d:\PROJETOS\pizzapub`) e execute:

**No Windows (PowerShell/CMD):**
```bash
cd d:\PROJETOS\pizzapub
.\gradlew bootRun
```
> O backend iniciará na porta **8080**. O banco de dados já vem populado com 7 pizzas de exemplo!

### Passo 2: Rodar o Frontend (Cardápio Online e Painel Gerencial - SPA)
Abra um **novo terminal** na pasta do frontend (`pizzapub-frontend`) e execute:

```bash
cd pizzapub-frontend
npm install    # (Só na primeira vez, para baixar dependências)
npm run dev
```
> O frontend iniciará e você poderá acessá-lo no navegador no link mostrado (geralmente `http://localhost:5173`).

---

### Links Úteis (Com o backend rodando)
- **Documentação da API (Swagger):** http://localhost:8080/swagger-ui.html
- **Painel do Banco de Dados H2:** http://localhost:8080/h2-console
  - *JDBC URL:* `jdbc:h2:mem:pizzariadb`
  - *Usuário:* `sa` (Senha em branco)

---

## 📡 Endpoints da API

A documentação interativa completa está disponível no **Swagger UI**: `http://localhost:8080/swagger-ui.html`

### Produtos (`/api/produtos`)

| Método   | Endpoint            | Descrição                       | Status |
|----------|---------------------|---------------------------------|--------|
| `GET`    | `/api/produtos`     | Lista todos os produtos/pizzas  | 200 OK |
| `POST`   | `/api/produtos`     | Cadastra um novo produto        | 201 Created |
| `GET`    | `/api/produtos/{id}`| Busca produto por ID            | 200 / 404 |
| `DELETE` | `/api/produtos/{id}`| Remove um produto               | 204 No Content |

#### Exemplo — Cadastrar Produto (`POST /api/produtos`)

```json
{
  "nome": "Calabresa Clássica",
  "descricao": "Molho artesanal, muçarela, calabresa e orégano.",
  "preco": "45.90"
}
```

#### Resposta

```json
{
  "id": 1,
  "nome": "Calabresa Clássica",
  "descricao": "Molho artesanal, muçarela, calabresa e orégano.",
  "preco": 45.90,
  "urlImagem": null
}
```

---

### Pedidos (`/api/pedidos`)

| Método | Endpoint             | Descrição                                  | Status |
|--------|----------------------|--------------------------------------------|--------|
| `POST` | `/api/pedidos`       | Cria um novo pedido                        | 201 Created |
| `GET`  | `/api/pedidos/{id}`  | Busca pedido por ID                        | 200 / 404 |

#### Exemplo — Criar Pedido (`POST /api/pedidos`)

```json
{
  "cpfCliente": "89986337011",
  "enderecoEntrega": "Rua das Flores, 123",
  "observacao": "Interfone 42",
  "itens": [
    {
      "produtoIds": [1],
      "tipo": "INTEIRA",
      "quantidade": 1,
      "observacao": "Sem cebola"
    },
    {
      "produtoIds": [2, 3],
      "tipo": "MEIO_A_MEIO",
      "quantidade": 1,
      "observacao": "Bem assada"
    }
  ]
}
```

> 💡 **Regra de negócio**: Em pizzas meio a meio, o preço unitário é sempre o do sabor mais caro entre os selecionados.

---

## 🗃️ Modelo de Dados

```
tb_cliente
  id | nome | cpf | telefone | email | logradouro | numero | complemento | bairro | cidade | uf | cep

tb_produto
  id | nome | descricao | preco | url_imagem

tb_pedido
  id | cliente_id (FK → tb_cliente)

tb_item_pedido
  id | pedido_id (FK → tb_pedido) | quantidade | preco_unitario | observacao

tb_item_pedido_sabores
  item_pedido_id (FK) | produto_id (FK)   ← tabela de junção (ManyToMany)
```

---

## 📐 Regras de Negócio

| # | Regra |
|---|-------|
| 1 | Se o cliente (identificado pelo CPF) não existir no banco, ele é criado automaticamente no momento do pedido. |
| 2 | Uma pizza pode ter **1 ou 2 sabores** (inteira ou meio a meio). |
| 3 | O preço unitário de um item com múltiplos sabores é sempre o **maior preço** entre os sabores escolhidos. |
| 4 | Todo o pedido é salvo atomicamente via `@Transactional` — ou salva tudo ou nada. |

---

## 🔐 Autenticação (Próximas Etapas)

O sistema está sendo preparado para suportar autenticação baseada em **JWT** com os seguintes perfis:

| Perfil      | Permissões                                           |
|-------------|------------------------------------------------------|
| `CLIENTE`   | Criar pedidos via cardápio online                    |
| `ATENDENTE` | Visualizar e atualizar status de pedidos             |
| `ADMIN`     | CRUD completo de produtos, relatórios e configurações|

A integração com **Supabase** substituirá o banco H2 em produção e fornecerá:
- PostgreSQL gerenciado
- Storage para imagens das pizzas (`urlImagem`)
- Auth integrado (alternativa ao JWT próprio)

---

## 🖥️ Frontend (Repositórios Relacionados)

| Repositório       | Descrição                                     |
|-------------------|-----------------------------------------------|
| `pizzapub-menu`   | ⏳ Cardápio online (React + Vite) — clientes  |
| `pizzapub-panel`  | ⏳ Painel de pedidos (React) — atendentes     |

> O `ProdutoController` já possui `@CrossOrigin(origins = "http://localhost:5173")` configurado para o servidor de desenvolvimento do React/Vite.

---

## 📁 Estrutura de Arquivos

```
pizzapub/
├── build.gradle.kts               # Configuração do build (Gradle Kotlin DSL)
├── settings.gradle.kts            # Nome do projeto
├── application.yaml               # Configuração principal da aplicação
├── ARCHITECTURE.md                # Diagramas de arquitetura e entidades
└── src/
    ├── main/
    │   ├── java/br/com/pizzapub/
    │   │   ├── PizzapubApplication.java      # Entrypoint Spring Boot
    │   │   ├── config/
    │   │   │   └── OpenApiConfig.java        # Configuração Swagger/OpenAPI
    │   │   ├── controller/
    │   │   │   ├── PedidoController.java     # Endpoints de pedidos
    │   │   │   └── ProdutoController.java    # Endpoints de produtos
    │   │   ├── service/
    │   │   │   ├── PedidoService.java        # Lógica de criação de pedidos
    │   │   │   └── ProdutoService.java       # Lógica de CRUD de produtos
    │   │   ├── repository/
    │   │   │   ├── ClienteRepository.java    # Acesso a dados de clientes
    │   │   │   ├── PedidoRepository.java     # Acesso a dados de pedidos
    │   │   │   ├── ProdutoRepository.java    # Acesso a dados de produtos
    │   │   │   └── ItemPedidoRepository.java # Acesso a dados de itens
    │   │   ├── domain/
    │   │   │   ├── Cliente.java              # Entidade cliente
    │   │   │   ├── Endereco.java             # Embeddable de endereço
    │   │   │   ├── Pedido.java               # Entidade pedido
    │   │   │   ├── ItemPedido.java           # Entidade item de pedido
    │   │   │   └── Produto.java              # Entidade produto (pizza)
    │   │   └── dtos/
    │   │       ├── CadastroProdutoDTO.java   # DTO para criação de produto
    │   │       ├── ItemPedidoDTO.java        # DTO para item dentro do pedido
    │   │       ├── PedidoDTO.java            # DTO para criação de pedido
    │   │       └── ProdutoDTO.java           # DTO de resposta de produto
    │   └── resources/
    │       ├── application.properties        # Configurações base
    │       ├── data.sql                      # Dados iniciais (7 pizzas)
    │       └── exemplojson.json              # Exemplo de payload de pedido
    └── test/
        └── java/br/com/pizzapub/
            └── PizzapubApplicationTests.java # Testes de contexto Spring
```

---

## 📁 Documentação do Projeto

| Arquivo | Descrição |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Diagramas de arquitetura, camadas, entidades e fluxo de dados |
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | Planejamento completo com milestones, features e tarefas rastreáveis |
| [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) | Histórico de versões e mudanças do projeto |
| [`docs/DECISOES.md`](./docs/DECISOES.md) | Registro de decisões técnicas (ADRs) com contexto e alternativas |

---

## 👤 Autora

**Alexya Viana** — amv.solucoes.tech@gmail.com

---

> 🚧 Projeto em desenvolvimento ativo. Contribuições e sugestões são bem-vindas!
