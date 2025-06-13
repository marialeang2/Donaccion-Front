describe('Donar a una fundación', () => {
  beforeEach(() => {
     cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type('pruebauser1@user.com');
      cy.get('input[name="password"]').type('12345678');
      cy.get('.shadow.card').find('button').click();
      cy.wait(2000); 
    });


    it('deberia poder donar a una fundacion', () => {

    cy.get('.foundation-card').first().find('a,button').contains('Donar').click();

    // Verifica que el resumen muestre $25.000
    cy.get('.w-100.mb-3 button').first().click();

    // Haz clic en el botón de donar
    cy.get('button[type="submit"]').click();

    // Espera a que se procese y redirija
    cy.url().should('include', '/my-donations');


    

});

});