/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contratos'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
      return contrato.validateAsync(response.body)
  })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) => {
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
  })

  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let email = 'Fulano' + Math.floor(Math.random() * 1000000000)
    let usuario = 'Fulano' + Math.floor(Math.random() * 1000000000)    
    cy.cadastrarUsuario(usuario, email + '@qa.com', 'teste', 'true')
    .should((response) => {
      expect(response.status).equal(201)
      expect(response.body.message).equal('Cadastro realizado com sucesso')
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario('beltrano', 'beltrano@qa.com', 'teste', 'true')
    .should((response) => {
      expect(response.status).equal(400)
      expect(response.body.message).equal('Este email já está sendo usado')
    })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let email = 'ciclano' + Math.floor(Math.random() * 1000000000)
    let user = 'ciclano' + Math.floor(Math.random() * 1000000000)
    cy.cadastrarUsuario(user, email + '@qa.com', 'Teste', 'true')
    .then(response => {
        let id = response.body._id
        cy.request({
            method: 'PUT',
            url: `usuarios/${id}`,
            body:
            {
              "nome": user,
              "email": email + "@qa.com.br",
              "password": "teste",
              "administrador": "true"
            }
        
            }).should((response) => {
              expect(response.status).equal(200)
              expect(response.body.message).equal('Registro alterado com sucesso')
            })
    })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.cadastrarUsuario('ciclano', 'ciclano@deletado.com', 'Delete', 'true')
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`,
            }).should(resposta =>{
                expect(resposta.body.message).to.equal('Registro excluído com sucesso')
                expect(resposta.status).to.equal(200)
            })

          })
  });
  

})
