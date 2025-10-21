describe('Testes API - Usuários', () => {
  
  // Teste 1: GET - listar usuários
  it('Deve retornar lista de usuários', () => {
    cy.request('GET', 'https://dummyjson.com/users')
      .then((resposta) => {
        expect(resposta.status).to.eq(200)
        
        // verificar estrutura
        expect(resposta.body).to.have.property('users')
        expect(resposta.body.users).to.be.an('array')
        expect(resposta.body.users.length).to.be.greaterThan(0)
      })
  })


  
  // Teste 2: validar estrutura do usuário
  it('Cada usuário deve ter os campos corretos', () => {
    cy.request('GET', 'https://dummyjson.com/users?limit=1')
      .then((resposta) => {
        const usuario = resposta.body.users[0]
        
        // campos obrigatórios
        expect(usuario).to.have.property('id')
        expect(usuario).to.have.property('firstName')
        expect(usuario).to.have.property('lastName')
        expect(usuario).to.have.property('email')
        expect(usuario).to.have.property('username')
        expect(usuario).to.have.property('age')
        expect(usuario).to.have.property('gender')
        
        // tipos corretos
        expect(usuario.id).to.be.a('number')
        expect(usuario.firstName).to.be.a('string')
        expect(usuario.email).to.be.a('string')
        expect(usuario.age).to.be.a('number')
        
        // email deve ter @
        expect(usuario.email).to.include('@')
      })
  })



  // Teste 3: buscar usuário por ID válido
  it('Deve buscar usuário por ID e retornar usuário único', () => {
    cy.request('GET', 'https://dummyjson.com/users/1')
      .then((resposta) => {
        expect(resposta.status).to.eq(200)
        
        // verificar se é o usuário correto
        expect(resposta.body.id).to.eq(1)
        expect(resposta.body).to.have.property('firstName')
        expect(resposta.body).to.have.property('lastName')
      })
  })



  // Teste 4: buscar usuário com ID inexistente
  it('Testar erro ao buscar ID inexistente', () => {
    cy.request({
      method: 'GET',
      url: 'https://dummyjson.com/users/999999',
      failOnStatusCode: false
    }).then((resposta) => {
      console.log('Status para ID inexistente:', resposta.status)
      
      // deveria ser 404, vamos ver o que retorna
      if (resposta.status === 404) {
        cy.log('API retorna 404 corretamente')
      } else {
        cy.log('API não retorna 404 para ID inexistente')
        console.log('Resposta:', resposta.body)
      }
    })
  })



  // Teste 5: POST - adicionar novo usuário
  it('Deve adicionar novo usuário com dados válidos', () => {
    const novoUsuario = {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao@test.com',
      username: 'joaosilva',
      age: 25
    }
    
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/users/add',
      body: novoUsuario
    }).then((resposta) => {
      expect(resposta.status).to.be.oneOf([200, 201])
      
      // verificar dados retornados
      expect(resposta.body.firstName).to.eq(novoUsuario.firstName)
      expect(resposta.body.lastName).to.eq(novoUsuario.lastName)
      expect(resposta.body.email).to.eq(novoUsuario.email)
      
      // deve ter gerado ID
      expect(resposta.body).to.have.property('id')
    })
  })



  // Teste 6: POST com email inválido
  it('Testar POST com email inválido', () => {
    const usuarioInvalido = {
      firstName: 'Teste',
      lastName: 'Teste',
      email: 'emailsemarroba',  // email sem @
      username: 'teste123'
    }
    
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/users/add',
      body: usuarioInvalido,
      failOnStatusCode: false
    }).then((resposta) => {
      console.log('Status:', resposta.status)
      
      // FALHA: API deveria validar o email
      if (resposta.status === 200 || resposta.status === 201) {
        cy.log('API aceitou email inválido')
        cy.log('Email sem @ foi aceito:', resposta.body.email)
      }
    })
  })



  // Teste 7: PUT - atualizar usuário
  it('Deve atualizar dados do usuário', () => {
    cy.request({
      method: 'PUT',
      url: 'https://dummyjson.com/users/1',
      body: {
        firstName: 'Nome Atualizado'
      }
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      expect(resposta.body.firstName).to.eq('Nome Atualizado')
    })
  })



  // Teste 8: PATCH - atualização parcial
  it('Deve atualizar parcialmente com PATCH', () => {
    cy.request({
      method: 'PATCH',
      url: 'https://dummyjson.com/users/1',
      body: {
        age: 30
      }
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      expect(resposta.body.age).to.eq(30)
    })
  })



  // Teste 9: DELETE usuário
  it('Deve deletar um usuário', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://dummyjson.com/users/1'
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      expect(resposta.body).to.have.property('isDeleted')
      expect(resposta.body.isDeleted).to.be.true
    })
  })



  // Teste 10: DELETE usuário inexistente
  it('Testar deleção de usuário inexistente', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://dummyjson.com/users/999999',
      failOnStatusCode: false
    }).then((resposta) => {
      console.log('Status ao deletar usuário inexistente:', resposta.status)
      
      if (resposta.status === 200) {
        cy.log('Retorna sucesso ao deletar usuário inexistente')
      }
    })
  })


  // Teste de segurança: verificar se retorna senha
  it('SEGURANÇA: Verificar se API expõe senha', () => {
    cy.request('GET', 'https://dummyjson.com/users/1')
      .then((resposta) => {
        // PROBLEMA: API retorna senha em texto plano
        if (resposta.body.password) {
          cy.log('FALHA DE SEGURANÇA: API retorna senha!')
          cy.log('Senha exposta:', resposta.body.password)
        }
      })
  })
})