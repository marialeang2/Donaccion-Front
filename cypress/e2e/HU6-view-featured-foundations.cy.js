describe('View featured foundations', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000');
    });
  
    it('Should view featured foundations', () => {
      cy.get('.py-5.bg-light').find('.container').contains('Fundaciones destacadas').should('be.visible');
      cy.get('.py-5.bg-light').find('.container').find('.row').children().should('have.length.greaterThan', 1);
    });


  });