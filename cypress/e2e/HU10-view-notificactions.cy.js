describe('Views notification panel', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login');
    });
  
    it('Should view notification panel', () => {
      cy.get('input[name="email"]').type('pruebauser1@user.com');
      cy.get('input[name="password"]').type('12345678');
      cy.get('.shadow.card').find('button').click();
      cy.wait(2000); 
      cy.get('.nav-item.dropdown').contains('Pepito Perez').click();
      cy.get('.dropdown-item').contains('Notificaciones').click();
      cy.get('.py-5.container').contains('Notificaciones').should('be.visible');
      
    });


  });