describe('Enviar sugerencia', () => {
  beforeEach(() => {
    // 1) Login con usuario ya registrado
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('pruebauser1@user.com');
    cy.get('input[name="password"]').type('12345678');
    cy.get('.shadow.card').find('button').click();
    cy.wait(2000);
  });

  it('navega al formulario de sugerencias, lo completa y lo envía', () => {
    // 2) Abrir menú de usuario
    cy.get('.nav-item.dropdown').contains('Pepito').click();

    // 3) Hacer click en "Enviar sugerencia"
    cy.get('a[data-rr-ui-dropdown-item][href="/suggestions/create"]')
      .contains(/sugerencia/i)
      .click();

    // 4) Seleccionar una categoría (por valor; aquí elegimos "foundations" como ejemplo)
    cy.get('select[name="category"]').select('foundations');

    // 5) Escribir la sugerencia en el textarea
    cy.get('textarea[name="content"]')
      .type('Esta es una sugerencia de prueba para mejorar la plataforma.');

    // 6) Enviar el formulario
    cy.get('button[type="submit"]').click();
  });
});