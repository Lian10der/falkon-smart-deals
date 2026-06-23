## Usuários cadastrados no sistema (db.json)

Para fazer login, use qualquer um destes:

| Nome | Email | Senha | Nível |
|------|-------|-------|-------|
| **Ana Silva** | ana@email.com | admin123 | **admin** ✅ (acesso ao painel Admin) |
| **Bruno Souza** | bruno@email.com | bruno123 | vip |
| **Carlos Lima** | carlos@email.com | carlos123 | comum |

### Como testar
1. Acesse **http://localhost:3000**
2. Clique em **"Entrar"** na navbar (canto superior direito)
3. Digite o email e a senha

### Diferenciais por nível
- **admin** (Ana): vê o link **"Admin"** na navbar → pode editar/excluir usuários
- **vip** (Bruno): tem pedidos para avaliar nas "Minhas Compras"
- **comum** (Carlos): acesso básico

> 💡 O Bruno (bruno@email.com / bruno123) é o que tem mais pedidos e reviews para testar. A Ana (admin) é melhor para testar o painel de administração.