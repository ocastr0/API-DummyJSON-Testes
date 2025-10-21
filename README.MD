# # Testes Automatizados - API DummyJSON

Projeto de testes automatizados com Cypress para validação da API DummyJSON.

---

## 👥 Nome e RA

- **[Isaque Castro Moreira Cavalcante - RA: 1993141]**

---

## Falhas e Comportamentos Inesperados Encontrados

Durante os testes automatizados, identificamos os seguintes problemas:

### 1. API retorna status code incorreto para recursos inexistentes

**Descrição:** Ao buscar produtos, usuários ou posts com IDs que não existem (exemplo: ID 999999), a API retorna status 200 (sucesso) ao invés de 404 (não encontrado).

**Endpoints afetados:**
- GET /products/{id}
- GET /users/{id}
- GET /posts/{id}

**Impacto:** Dificulta identificar se um recurso realmente existe apenas verificando o código de status da resposta.

---

### 2. Falta de validação de dados de entrada

**Descrição:** A API aceita dados claramente inválidos sem retornar erro, como:
- Preços negativos (price: -100)
- Estoque negativo (stock: -10)
- Emails sem formato válido (exemplo: "emailsemarroba")
- Campos obrigatórios vazios
- Idades negativas

**Endpoints afetados:**
- POST /products/add
- POST /users/add
- POST /posts/add

**Impacto:** Em uma aplicação real, isso permitiria a inserção de dados inconsistentes no banco de dados, causando problemas de integridade.

---

### 3. Ausência de validação de tipos de dados

**Descrição:** A API aceita tipos de dados incompatíveis sem retornar erro. Por exemplo, enviar texto onde deveria ser número, ou número onde deveria ser booleano.

**Endpoints afetados:**
- PUT /products/{id}
- PATCH /users/{id}
- PUT /posts/{id}

**Impacto:** Pode causar comportamentos inesperados nas aplicações que consomem a API e dificulta a detecção de bugs.

---

### 4. Exposição de informações sensíveis (senha)

**Descrição:** A API retorna o campo `password` em texto plano nas respostas GET de usuários.

**Endpoints afetados:**
- GET /users/{id}
- GET /users

**Impacto:** Em uma API real de produção, isso seria uma falha crítica de segurança. Senhas nunca devem ser retornadas em requisições.

**Observação:** Como a DummyJSON é uma API fake para testes, isso pode ser intencional para facilitar o desenvolvimento.

---

### 5. Deleções são apenas simuladas (Soft Delete)

**Descrição:** Quando um recurso é deletado, ele não é realmente removido. A API apenas adiciona uma flag `isDeleted: true`, mas o recurso continua acessível via GET.

**Exemplo:**
// 1. Deletar produto
DELETE /products/1
// Retorna: { id: 1, isDeleted: true, deletedOn: "2025-10-21..." }

// 2. Buscar o produto "deletado"
GET /products/1
// Status: 200 - Produto ainda é retornado

text

**Endpoints afetados:**
- DELETE /products/{id}
- DELETE /users/{id}
- DELETE /posts/{id}
- DELETE /todos/{id}

**Impacto:** Pode confundir sobre se o recurso foi realmente removido ou apenas marcado como deletado.

---

### 6. API aceita deletar recursos inexistentes

**Descrição:** Ao tentar deletar recursos com IDs inexistentes, a API retorna status 200 (sucesso) ao invés de 404 (não encontrado).

**Impacto:** Impossível saber se a deleção realmente aconteceu ou se o recurso nem existia.

---

### 7. Não valida relacionamentos entre entidades

**Descrição:** A API permite criar posts com `userId` inexistente, ou seja, não verifica se o usuário realmente existe antes de criar o post.

**Exemplo:**
POST /posts/add
{
"title": "Meu Post",
"userId": 999999 // Usuário não existe
}
// Status: 201 Created (aceito sem validação)

text

**Impacto:** Cria registros "órfãos" sem relacionamento válido com outras entidades, violando integridade referencial.

---

##  Conclusão: Você Considera a API Confiável? Por Quê?

A DummyJSON é **altamente confiável** para os seguintes cenários:

**Motivos:**
-  **Dados bem estruturados:** Retorna JSON válido e consistente em todas as requisições
-  **Documentação clara:** Possui documentação completa com exemplos práticos
-  **Fácil de usar:** Não requer autenticação complexa ou configurações complicadas

**Ideal para:**
- Estudantes aprendendo a consumir APIs REST
- Praticar testes automatizados (como fizemos com Cypress)

---

###  Análise Final

A DummyJSON cumpre perfeitamente seu objetivo de ser uma API fake para testes e aprendizado. 
**Recursos utilizados:** Products, Users, Posts e Todos (GET, POST, PUT, PATCH, DELETE)