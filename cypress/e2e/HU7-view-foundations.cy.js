describe('View all foundations', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/foundations');
      cy.wait(3000);

    });
  
    it('Should view foundations', () => {
      cy.get('.py-5.container').contains('Fundaciones').should('be.visible');
      cy.get('.py-5.container').find('.row').children().should('have.length.greaterThan', 1);
    });


  });