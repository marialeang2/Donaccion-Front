const randomSuffix = Date.now(); 
const randomEmail = `pruebauser_${randomSuffix}@user.com`;


describe('Agregar fundación a favoritos', () => {
  beforeEach(() => {
    
    // 2) Login con ese usuario
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('pruebauser1@user.com');
    cy.get('input[name="password"]').type('12345678');
    cy.get('.shadow.card').find('button').click();
    cy.wait(2000);
  });

  it('navega a fundaciones y marca la primera como favorita', () => {
    // 3) Click en "Descubrir fundaciones"
    cy.get('[data-cy="discover-foundations-btn"]').click();

    // 4) Click en el botón corazón de la primera card
    cy.get('.card')
      .first()
      .find('button.btn-outline-light')
      .click();
  });
});
