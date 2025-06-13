describe('Descubrir fundaciones y ver detalles', () => {
  beforeEach(() => {
    // Abre la home de la app
    cy.visit('http://localhost:3000');
  });

  it('hace click en "Descubrir fundaciones" y luego en el primer "Ver detalles"', () => {
    // 1) Click en el botón para ir a /foundations
    cy.get('[data-cy="discover-foundations-btn"]')
      .click();

    // 2) Click en el primer "Ver detalles" (link cuyo href empieza por /foundations/)
    cy.get('a[href^="/foundations/"]')
      .first()
      .click();
  });
});