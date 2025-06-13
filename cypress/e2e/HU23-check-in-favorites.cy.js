describe('Revisar favoritos', () => {
  beforeEach(() => {
    // 1) Login con usuario ya registrado
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('pruebauser1@user.com');
    cy.get('input[name="password"]').type('12345678');
    cy.get('.shadow.card').find('button').click();
    cy.wait(2000);
  });

  it('marca una fundación como favorita y luego abre Favoritos', () => {
    // 2) Ir a Fundaciones
    cy.get('[data-cy="discover-foundations-btn"]').click();

    // 3) Hacer click en el corazón de la primera card
    cy.get('.card').first().find('button.btn-outline-light').click();

    // 4) Abrir menú de usuario (click en el dropdown toggle)
    cy.get('.nav-item.dropdown')
      .contains('Pepito')     // asume que aparece tu nombre ahí
      .click();

    // 5) Hacer click en "Favoritos"
    cy.get('a[data-rr-ui-dropdown-item][href="/favorites"]')
      .contains('Favoritos')
      .click();

    // 6) Click en el primer "Ver detalles" (link cuyo href empieza por /foundations/)
    cy.get('a[href^="/foundations/"]')
      .first()
      .click();
  });
});