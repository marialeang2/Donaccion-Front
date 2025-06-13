describe('Ver detalles de la oportunidad', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/opportunities'); // Reemplaza con la ruta donde se renderiza FilterSidebar
    cy.wait(2000); // Espera a que la página se cargue
  });

  it('Debería mostrar los detalles de la oportunidad al hacer clic en "Ver detalles"', () => {
    // Selecciona el botón "Ver detalles" y haz clic en él
    cy.get('.opportunity-card').first().find('a,button').contains('Ver detalles').click();

    // Verifica que los detalles de la oportunidad se muestran correctamente
    cy.get('.opportunity-details').should('exist');
  });
});