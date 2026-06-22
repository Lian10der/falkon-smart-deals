# Falkon – Portal de Reviews (Desafio 4)

Portal de avaliação de produtos para o e-commerce Falkon. O usuário visualiza suas compras, avalia produtos com nota e comentário, e recebe R$ 5,00 em saldo a cada avaliação enviada.

## Como rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar tudo de uma vez
```bash
npm start
```
Isso sobe **simultaneamente**:
- `json-server` na porta **3001** (back-end fake)
- `React` na porta **3000** (front-end)

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Estrutura do projeto

```
falkon-reviews/
├── db.json                        ← Banco de dados do json-server
├── public/
│   └── index.html
└── src/
    ├── App.jsx                    ← Roteamento (BrowserRouter + Routes)
    ├── index.js
    ├── hooks/
    │   └── useReviews.js          ← Custom Hook: toda lógica de negócio
    ├── components/
    │   ├── CardPedido.jsx         ← Componente reutilizável: card de pedido
    │   ├── StarRating.jsx         ← Componente reutilizável: estrelas (display/interativo)
    │   └── BadgeCategoria.jsx     ← Componente reutilizável: badge de categoria
    ├── routes/
    │   ├── PaginaInicial.jsx      ← Rota "/" — lista de compras + big numbers
    │   └── PaginaAvaliacao.jsx    ← Rota "/avaliar/:pedidoId" — formulário de review
    └── styles/
        ├── global.css
        ├── StarRating.css
        ├── BadgeCategoria.css
        ├── CardPedido.css
        ├── PaginaInicial.css
        └── PaginaAvaliacao.css
```

## Requisitos técnicos atendidos

| Requisito | Implementação |
|---|---|
| **React Router** | `BrowserRouter` + 2 rotas: `/` e `/avaliar/:pedidoId` |
| **Custom Hook** | `useReviews.js` — busca dados, envia avaliação, credita bônus |
| **Componentização** | `CardPedido`, `StarRating`, `BadgeCategoria` (reutilizáveis) |
| **json-server** | Lê e escreve em `db.json` via `fetch` na porta 3001 |
| **CSS separado** | Arquivo `.css` por componente em `src/styles/` |
| **CamelCase** | Todas as variáveis e componentes nomeados em camelCase |

## Usuário logado (simulado)
O app usa **Bruno Souza (id: "2")** por padrão — ele tem 2 pedidos entregues prontos para avaliação. Para trocar, edite `USUARIO_ID` em `src/App.jsx`.
