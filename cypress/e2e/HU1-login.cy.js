describe('Verifica que se pueda iniciar sesion como un usuario', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/register');
    });
  
    it('Should create new user and login', () => {
      // Go to register page
      cy.get('input[name="firstName"]').type('Pepito');
      cy.get('input[name="lastName"]').type('Perez');
      cy.get('input[name="email"]').type('pruebauser1@user.com');
      cy.get('input[name="password"]').type('12345678');
      cy.get('input[name="confirmPassword"]').type('12345678');
      cy.get('.shadow.card').contains('Registrarse').click();
      cy.wait(2000); 

      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type('pruebauser1@user.com');
      cy.get('input[name="password"]').type('12345678');
      cy.get('.shadow.card').find('button').click();
      cy.wait(2000); 
      cy.get('.nav-item.dropdown').contains('Pepito Perez').click();
      cy.get('.dropdown-item').contains('Perfil').should('be.visible');
      
    });


  });