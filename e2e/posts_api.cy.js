describe('Testes API - Posts', () => {
  
  // Teste 1: listar posts
  it('Deve retornar lista de posts', () => {
    cy.request('GET', 'https://dummyjson.com/posts')
      .then((resposta) => {
        expect(resposta.status).to.eq(200)
        
        expect(resposta.body).to.have.property('posts')
        expect(resposta.body.posts).to.be.an('array')
        expect(resposta.body.posts.length).to.be.greaterThan(0)
      })
  })



  // Teste 2: validar estrutura do post
  it('Cada post deve ter os campos corretos', () => {
    cy.request('GET', 'https://dummyjson.com/posts?limit=1')
      .then((resposta) => {
        const post = resposta.body.posts[0]
        
        // campos obrigatórios
        expect(post).to.have.property('id')
        expect(post).to.have.property('title')
        expect(post).to.have.property('body')
        expect(post).to.have.property('userId')
        expect(post).to.have.property('tags')
        expect(post).to.have.property('reactions')
        
        // validar tipos
        expect(post.id).to.be.a('number')
        expect(post.title).to.be.a('string')
        expect(post.body).to.be.a('string')
        expect(post.userId).to.be.a('number')
        expect(post.tags).to.be.an('array')
        
        // reactions deve ter likes e dislikes
        expect(post.reactions).to.have.property('likes')
        expect(post.reactions).to.have.property('dislikes')
      })
  })



  // Teste 3: buscar post por ID
  it('Deve buscar post específico por ID', () => {
    cy.request('GET', 'https://dummyjson.com/posts/1')
      .then((resposta) => {
        expect(resposta.status).to.eq(200)
        expect(resposta.body.id).to.eq(1)
        expect(resposta.body).to.have.property('title')
      })
  })



  // Teste 4: POST - adicionar novo post
  it('Deve adicionar novo post com dados válidos', () => {
    const novoPost = {
      title: 'Meu Post de Teste',
      body: 'Este é o conteúdo do meu post de teste',
      userId: 1,
      tags: ['teste', 'cypress']
    }
    
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/posts/add',
      body: novoPost
    }).then((resposta) => {
      expect(resposta.status).to.be.oneOf([200, 201])
      
      expect(resposta.body.title).to.eq(novoPost.title)
      expect(resposta.body.body).to.eq(novoPost.body)
      expect(resposta.body.userId).to.eq(novoPost.userId)
      
      // deve ter ID
      expect(resposta.body).to.have.property('id')
    })
  })



  // Teste 5: POST sem dados obrigatórios
  it('Testar POST sem dados obrigatórios', () => {
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/posts/add',
      body: {},  // body vazio
      failOnStatusCode: false
    }).then((resposta) => {
      console.log('Status para post vazio:', resposta.status)
      
      // FALHA: API deveria rejeitar
      if (resposta.status === 200 || resposta.status === 201) {
        cy.log('API aceita post sem dados obrigatórios')
      }
    })
  })



  // Teste 6: POST com userId inexistente
  it('Testar post com userId inexistente', () => {
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/posts/add',
      body: {
        title: 'Teste',
        body: 'Teste',
        userId: 999999  // userId que não existe
      },
      failOnStatusCode: false
    }).then((resposta) => {
      console.log('Status:', resposta.status)
      
      // deveria validar se o userId existe
      if (resposta.status === 200 || resposta.status === 201) {
        cy.log('API não valida se userId existe')
      }
    })
  })



  // Teste 7: PUT - atualizar post
  it('Deve atualizar post existente', () => {
    cy.request({
      method: 'PUT',
      url: 'https://dummyjson.com/posts/1',
      body: {
        title: 'Título Atualizado'
      }
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      expect(resposta.body.title).to.eq('Título Atualizado')
    })
  })



  // Teste 8: PATCH - atualização parcial
  it('Deve atualizar parcialmente com PATCH', () => {
    cy.request({
      method: 'PATCH',
      url: 'https://dummyjson.com/posts/1',
      body: {
        reactions: {
          likes: 100
        }
      }
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
    })
  })



  // Teste 9: PUT com campo inválido
  it('Testar atualização com campo inválido', () => {
    cy.request({
      method: 'PUT',
      url: 'https://dummyjson.com/posts/1',
      body: {
        reactions: 'deveria ser objeto'  // tipo errado
      },
      failOnStatusCode: false
    }).then((resposta) => {
      if (resposta.status === 200) {
        cy.log('API não valida tipos na atualização')
      }
    })
  })



  // Teste 10: DELETE post
  it('Deve deletar um post', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://dummyjson.com/posts/1'
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      expect(resposta.body).to.have.property('isDeleted')
      expect(resposta.body.isDeleted).to.be.true
      expect(resposta.body).to.have.property('deletedOn')
    })
  })



  // Teste 11: DELETE post inexistente
  it('Testar exclusão de post inexistente', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://dummyjson.com/posts/999999',
      failOnStatusCode: false
    }).then((resposta) => {
      console.log('Status ao deletar post inexistente:', resposta.status)
      
      if (resposta.status === 200) {
        cy.log('Retorna sucesso para deleção de post inexistente')
      }
    })
  })
})