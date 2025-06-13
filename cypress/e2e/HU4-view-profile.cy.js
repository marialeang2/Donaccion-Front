const randomSuffix = Date.now(); 
const randomEmail = `pruebauser_${randomSuffix}@user.com`;

describe('Creates a new user and views its profile', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register');
  });

  it('Should view profile', () => {


      cy.get('input[name="firstName"]').type('Pepito');
      cy.get('input[name="lastName"]').type('Perez');
      cy.get('input[name="email"]').type(randomEmail);
      cy.get('input[name="password"]').type('12345678');
      cy.get('input[name="confirmPassword"]').type('12345678');
      cy.get('.shadow.card').contains('Registrarse').click();
      cy.wait(2000); 

      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type(randomEmail);
      cy.get('input[name="password"]').type('12345678');
      cy.get('.shadow.card').find('button').click();
      cy.wait(2000); 
      cy.get('.nav-item.dropdown').contains('Pepito Perez').click();
      cy.get('.dropdown-item').contains('Perfil').click();
      cy.get('.shadow.card').contains('Pepito Perez').should('be.visible');
      cy.get('.shadow.card').contains(randomEmail).should('be.visible');


  });
});
