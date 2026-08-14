# 🍕 PizzaPub — Cardápio Online (Menu)

Este é o **Frontend** do projeto PizzaPub, voltado para a experiência do cliente que deseja fazer pedidos de pizza de forma rápida e intuitiva. 
Ele foi construído utilizando **React**, **TypeScript**, **Vite** e **Zustand**.

---

## ⚡ Como Rodar Localmente

Para rodar este frontend, é altamente recomendado que o seu **Backend (API Spring Boot)** já esteja rodando na porta `8080`, caso contrário, você não verá as pizzas na tela!

### Passo 1: Instalar Dependências
Na primeira vez que clonar o projeto, abra o terminal na pasta raiz deste frontend (`d:\PROJETOS\pizzapub-menu`) e rode:

```bash
npm install
```

### Passo 2: Iniciar o Servidor de Desenvolvimento
Em seguida, para rodar o site localmente:

```bash
npm run dev
```

### Passo 3: Acessar no Navegador
O terminal mostrará um link (geralmente `http://localhost:5173`). Segure `Ctrl` e clique no link, ou copie e cole no seu navegador.

---

## 🏗️ Principais Tecnologias
- **React + Vite**: Alta performance e renderização instantânea
- **Zustand**: Gerenciamento de estado leve para o carrinho de compras e autenticação
- **React Query**: Cache e sincronização rápida com a API
- **Axios**: Requisições HTTP com o backend
- **CSS Modules**: Estilização própria sem conflitos de classes

## 📁 Estrutura de Pastas
- `src/features`: Páginas principais separadas por contexto (ex: `cardapio`, `carrinho`, `checkout`, `confirmacao`)
- `src/components`: Componentes reaproveitáveis de UI (ex: `Button`, `Modal`) e Layout.
- `src/store`: Estados globais do Zustand (`cart.store.ts`, `auth.store.ts`)
- `src/core/api`: Configurações do Axios e endpoints globais.
