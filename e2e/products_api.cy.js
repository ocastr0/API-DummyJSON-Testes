describe('Testes API - Produtos', () => {
  
  // Teste 1: GET - validar se retorna lista de produtos
  it('Deve retornar lista de produtos', () => {
    cy.request('GET', 'https://dummyjson.com/products')
      .then((resposta) => {
        // verificar se deu sucesso
        expect(resposta.status).to.eq(200)
        
        // ver se tem products na resposta
        expect(resposta.body).to.have.property('products')
        expect(resposta.body.products).to.be.an('array')
        
        // tem que ter pelo menos 1 produto
        expect(resposta.body.products.length).to.be.greaterThan(0)
      })
  })



  // Teste 2: GET com limit=5 - verificar se retorna só 5 produtos
  it('Deve retornar apenas 5 produtos quando usar limit=5', () => {
    cy.request('GET', 'https://dummyjson.com/products?limit=5')
      .then((resposta) => {
        expect(resposta.status).to.eq(200)
        
        // conferir se retornou exatamente 5
        expect(resposta.body.products).to.have.length(5)
        expect(resposta.body.limit).to.eq(5)
      })
  })



  // Teste 3: validar campos de cada produto
  it('Cada produto deve ter os campos esperados', () => {
    cy.request('GET', 'https://dummyjson.com/products?limit=3')
      .then((resposta) => {
        expect(resposta.status).to.eq(200)
        
        // pegar o primeiro produto pra validar
        const produto = resposta.body.products[0]
        
        // validar os campos obrigatorios
        expect(produto).to.have.property('id')
        expect(produto).to.have.property('title')
        expect(produto).to.have.property('price')
        expect(produto).to.have.property('description')
        expect(produto).to.have.property('category')
        expect(produto).to.have.property('rating')
        expect(produto).to.have.property('stock')
        
        // validar tipos de dados
        expect(produto.id).to.be.a('number')
        expect(produto.title).to.be.a('string')
        expect(produto.price).to.be.a('number')
        
        // preço tem que ser maior que 0
        expect(produto.price).to.be.greaterThan(0)
      })
  })



  // Teste 4: buscar produto por ID
  it('Deve buscar um produto específico por ID', () => {
    cy.request('GET', 'https://dummyjson.com/products/1')
      .then((resposta) => {
        expect(resposta.status).to.eq(200)
        
        // verificar se retornou o produto correto
        expect(resposta.body.id).to.eq(1)
        expect(resposta.body).to.have.property('title')
        expect(resposta.body).to.have.property('price')
      })
  })



  // Teste 5: POST - adicionar novo produto
  it('Deve adicionar um novo produto', () => {
    // dados do novo produto
    const novoProduto = {
      title: 'Notebook Teste',
      price: 2500,
      description: 'Notebook para testes',
      category: 'electronics'
    }
    
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/products/add',
      body: novoProduto
    }).then((resposta) => {
      // deve retornar 201 ou 200
      expect(resposta.status).to.be.oneOf([200, 201])
      
      // verificar se retornou com os dados enviados
      expect(resposta.body.title).to.eq(novoProduto.title)
      expect(resposta.body.price).to.eq(novoProduto.price)
      
      // deve ter gerado um ID
      expect(resposta.body).to.have.property('id')
    })
  })



  // Teste 6: POST com dados inválidos - testar validação
  it('Testar POST com dados inválidos', () => {
    const produtoInvalido = {
      title: '',  // título vazio
      price: -100  // preço negativo
    }
    
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/products/add',
      body: produtoInvalido,
      failOnStatusCode: false  // não falhar automaticamente
    }).then((resposta) => {
      // ver o que a API retorna
      // idealmente deveria ser 400, mas vamos documentar o que acontece
      console.log('Status code:', resposta.status)
      console.log('Resposta:', resposta.body)
      
      // FALHA ENCONTRADA: API aceita dados inválidos
      if (resposta.status === 200 || resposta.status === 201) {}
    })
  })



  // Teste 7: PUT - atualizar produto
  it('Deve atualizar um produto existente', () => {
    const dadosAtualizados = {
      title: 'Produto Atualizado'
    }
    
    cy.request({
      method: 'PUT',
      url: 'https://dummyjson.com/products/1',
      body: dadosAtualizados
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      
      // verificar se o título foi atualizado
      expect(resposta.body.title).to.eq(dadosAtualizados.title)
      expect(resposta.body.id).to.eq(1)
    })
  })



  // Teste 8: PATCH - atualização parcial
  it('Deve fazer atualização parcial com PATCH', () => {
    cy.request({
      method: 'PATCH',
      url: 'https://dummyjson.com/products/1',
      body: {
        price: 999.99
      }
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      expect(resposta.body.price).to.eq(999.99)
    })
  })



  // Teste 9: PUT com campo inválido
  it('Testar atualização com campo inválido', () => {
    cy.request({
      method: 'PUT',
      url: 'https://dummyjson.com/products/1',
      body: {
        price: 'texto ao invés de número'  // tipo errado
      },
      failOnStatusCode: false
    }).then((resposta) => {
      console.log('Status:', resposta.status)
      
      // documentar comportamento
      if (resposta.status === 200) {
        cy.log('API não valida tipos de dados')
      }
    })
  })



  // Teste 10: DELETE - deletar produto
  it('Deve deletar um produto', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://dummyjson.com/products/1'
    }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      
      // verificar se tem o campo isDeleted
      expect(resposta.body).to.have.property('isDeleted')
      expect(resposta.body.isDeleted).to.be.true
      expect(resposta.body).to.have.property('deletedOn')
    })
  })



  // Teste 11: DELETE de produto inexistente
  it('Testar exclusão de produto inexistente', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://dummyjson.com/products/999999',
      failOnStatusCode: false
    }).then((resposta) => {
      console.log('Status ao deletar ID inexistente:', resposta.status)
      
      // idealmente deveria ser 404
      if (resposta.status === 200) {
        cy.log('API retorna 200 para deleção de produto inexistente')
      }
    })
  })
})