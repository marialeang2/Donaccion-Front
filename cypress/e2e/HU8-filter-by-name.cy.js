describe('Filter foundations by name', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/foundations');
    cy.wait(2000); 
  });

  it('Should filter foundations by name', () => {
    cy.get('input[placeholder="Buscar fundaciones..."]').type('Asociación Social Deporte');


    cy.get('.h-100.shadow-sm.card:visible').each(($el) => {
      cy.wrap($el).should('contain.text', 'Asociación Social Deporte');
    });

  });
});
