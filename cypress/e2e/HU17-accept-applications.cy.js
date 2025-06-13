describe('Aceptar aplicaciones de oportunidades', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login'); // Reemplaza con la ruta de tu aplicación
      cy.get('input[name="email"]').type('correo_empresa_prueba@correo.com');
      cy.get('input[name="password"]').type('12345678');
      cy.get('.shadow.card').find('button').click();
      cy.wait(2000); });

    it('Debería aceptar una aplicación de oportunidad', () => {

        cy.visit('http://localhost:3000/foundation/dashboard');
        cy.wait(1000); // Espera a que se cargue la página del dashboard de la fundación
        cy.get('.nav-tabs').contains(/^Solicitudes/).click();

        cy.get('[data-cy="accept-application-btn"]').first().click();

        cy.get('.modal').should('be.visible');
        cy.get('.modal').contains('button', 'Aceptar').click();

    });
    
});