describe('View user participations', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login');
    });
  
    it('Should view users participations', () => {
      cy.get('input[name="email"]').type('pruebauser1@user.com');
      cy.get('input[name="password"]').type('12345678');
      cy.get('.shadow.card').find('button').click();
      cy.wait(2000); 
      cy.get('.nav-item.dropdown').contains('Pepito Perez').click();
      cy.get('.dropdown-item').contains('Mis participaciones').click();
      cy.get('.mb-4.row').get('.col-md-3').contains('Pendientes').should('be.visible');
      cy.get('.mb-4.row').get('.col-md-3').contains('Aceptados').should('be.visible');
      cy.get('.mb-4.row').get('.col-md-3').contains('Rechazados').should('be.visible');
      cy.get('.mb-4.row').get('.col-md-3').contains('Total').should('be.visible');

    });


  });