describe('Revisar mis contribuciones', () => {
  beforeEach(() => {
     cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type('pruebauser1@user.com');
      cy.get('input[name="password"]').type('12345678');
      cy.get('.shadow.card').find('button').click();
      cy.wait(2000); 
    });

it ('Debería llevarme a la página de mis contribuciones', () => {
    cy.get('[data-cy="user-menu-dropdown"]').click(); // Abre el menú del usuario
cy.get('[data-cy="my-donations-link"]').click();  // Haz clic en "Mis Donaciones"
cy.url().should('include', '/my-donations');
cy.contains('Mis donaciones');


});

});