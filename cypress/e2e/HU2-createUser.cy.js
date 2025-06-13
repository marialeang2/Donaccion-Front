const randomSuffix = Date.now(); 
const randomEmail = `pruebauser_${randomSuffix}@user.com`;

describe('Creates a new user', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('Should create new user', () => {

    cy.get('input[name="firstName"]').type('Pepita');
    cy.get('input[name="lastName"]').type('Perez');
    cy.get('input[name="email"]').type(randomEmail);
    cy.get('input[name="password"]').type('12345678');
    cy.get('input[name="confirmPassword"]').type('12345678');
    cy.get('.shadow.card').contains('Registrarse').click();

    cy.wait(1000);
    cy.get('.shadow.card').contains('Iniciar sesión').should('be.visible');
  });
});
