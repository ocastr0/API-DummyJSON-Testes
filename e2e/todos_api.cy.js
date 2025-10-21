describe('Testes API - Todos', () => {
  

  // Teste 1: listar todos
  it('Deve retornar lista de todos', () => {
    cy.request('GET', 'https://dummyjson.com/todos')
      .then((resposta) => {
        expect(resposta.status).to.eq(200)
        
        expect(resposta.body).to.have.property('todos')
        expect(resposta.body.todos).to.be.an('array')
        expect(resposta.body.todos.length).to.be.greaterThan(0)
      })
  })



  // Teste 2: validar estrutura do todo
  it('Cada todo deve ter os campos corretos', () => {
    cy.request('GET', 'https://dummyjson.com/todos?limit=1')
      .then((resposta) => {
        const todo = resposta.body.todos[0]
        
        // campos obrigatórios
        expect(todo).to.have.property('id')
        expect(todo).to.have.property('todo')
        expect(todo).to.have.property('completed')
        expect(todo).to.have.property('userId')
        
        // validar tipos
        expect(todo.id).to.be.a('number')
        expect(todo.todo).to.be.a('string')
        expect(todo.completed).to.be.a('boolean')
        expect(todo.userId).to.be.a('number')
      })
  })



  // Teste 3: buscar todo por ID
  it('Deve buscar todo específico por ID', () => {
    cy.request('GET', 'https://dummyjson.com/todos/1')
      .then((resposta) => {
        expect(resposta.status).to.eq(200)
        expect(resposta.body.id).to.eq(1)
        expect(resposta.body).to.have.property('todo')
        expect(resposta.body).to.have.property('completed')
      })
  })



  // Teste 4: POST - adicionar novo todo
  it('Deve adicionar novo todo com dados válidos', () => {
    const novoTodo = {
      todo: 'Completar testes da API',
      completed: false,
      userId: 1
    }
    
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/todos/add',
      body: novoTodo
    }).then((resposta) => {
      expect(resposta.status).to.be.oneOf([200, 201])
      
      expect(resposta.body.todo).to.eq(novoTodo.todo)
      expect(resposta.body.completed).to.eq(novoTodo.completed)
      expect(resposta.body.userId).to.eq(novoTodo.userId)
      
      // deve ter gerado ID
      expect(resposta.body).to.have.property('id')
    })
  })



  // Teste 5: POST com dados inválidos
  it('Testar POST com dados inválidos', () => {
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/todos/add',
      body: {
        todo: '',  // descrição vazia
        userId: -1  // userId negativo
      },
      failOnStatusCode: false
    }).then((resposta) => {
      console.log('Status:', resposta.status)
      
      if (resposta.status === 200 || resposta.status === 201) {
        cy.log('API aceita dados inválidos')
      }
    })
  })



  // Teste 6: PUT - atualizar todo
  it('Deve atualizar todo existente', () => {
    cy.request({
      method: 'PUT',
      url: 'https://dummyjson.com/todos/1',
      body: {
        completed: true
      }
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      expect(resposta.body.completed).to.eq(true)
    })
  })



  // Teste 7: PATCH - atualização parcial
  it('Deve atualizar parcialmente com PATCH', () => {
    cy.request({
      method: 'PATCH',
      url: 'https://dummyjson.com/todos/1',
      body: {
        completed: false
      }
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      expect(resposta.body.completed).to.eq(false)
    })
  })



  // Teste 8: PUT com tipo errado
  it('Testar atualização com tipo de dado errado', () => {
    cy.request({
      method: 'PUT',
      url: 'https://dummyjson.com/todos/1',
      body: {
        completed: 'texto ao invés de boolean'
      },
      failOnStatusCode: false
    }).then((resposta) => {
      if (resposta.status === 200) {
        cy.log('API não valida tipos de dados')
      }
    })
  })



  // Teste 9: DELETE todo
  it('Deve deletar um todo', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://dummyjson.com/todos/1'
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      expect(resposta.body).to.have.property('isDeleted')
      expect(resposta.body.isDeleted).to.be.true
      expect(resposta.body).to.have.property('deletedOn')
    })
  })



  // Teste 10: DELETE todo inexistente
  it('Testar exclusão de todo inexistente', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://dummyjson.com/todos/999999',
      failOnStatusCode: false
    }).then((resposta) => {
      console.log('Status:', resposta.status)
      
      if (resposta.status === 200) {
        cy.log('Retorna sucesso ao deletar todo inexistente')
      }
    })
  })



  // Teste extra: buscar todos de um usuário
  it('Deve buscar todos de um usuário específico', () => {
    cy.request('GET', 'https://dummyjson.com/todos/user/5')
      .then((resposta) => {
        expect(resposta.status).to.eq(200)
        expect(resposta.body.todos).to.be.an('array')
        
        // todos devem ser do userId 5
        resposta.body.todos.forEach(todo => {
          expect(todo.userId).to.eq(5)
        })
      })
  })
})