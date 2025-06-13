describe('Filter foundations and opportunities by location', () => {

  it('Should filter foundations by location', () => {
    cy.visit('http://localhost:3000/foundations');
    cy.wait(2000); 
    cy.get('input[placeholder="Ubicación..."]').type('Calle Ruelas');


    cy.get('.h-100.shadow-sm.card:visible').each(($el) => {
      cy.wrap($el).should('contain.text', 'Calle Ruelas');
    });

  });

  it('Should filter opportunities by location', () => {
    cy.visit('http://localhost:3000/opportunities');
    cy.wait(2000); 
    cy.get('input[placeholder="Filtrar por ubicación"]').type('Vial Eladio');


    cy.get('.h-100.shadow-sm.card:visible').each(($el) => {
      cy.wrap($el).should('contain.text', 'Vial Eladio');
    });

  });
});
