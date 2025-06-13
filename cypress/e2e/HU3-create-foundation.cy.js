const randomSuffix = Date.now(); 
const randomEmail = `pruebauser_${randomSuffix}@user.com`;

describe('Creates a new foundation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('Should create new foundation', () => {
    cy.get('.btn-group').contains('Fundación').click()

    cy.get('input[name="name"]').type('Empresa prueba');
    cy.get('input[name="address"]').type('Calle 1111 #4000 ');
    cy.get('input[name="phone"]').type('1112223344');
    cy.get('input[name="website"]').type('http://www.empresasuperoficial1111.com');
    cy.get('input[name="email"]').type(randomEmail);
    cy.get('input[name="password"]').type('12345678');
    cy.get('input[name="confirmPassword"]').type('12345678');
    cy.get('.shadow.card').contains('Registrarse').click();

    cy.wait(1000);
    cy.get('.shadow.card').contains('Iniciar sesión').should('be.visible');
  });
});
