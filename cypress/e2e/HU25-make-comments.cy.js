describe('Enviar reseña', () => {
  beforeEach(() => {
    // 1) Login con usuario ya registrado
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('pruebauser1@user.com');
    cy.get('input[name="password"]').type('12345678');
    cy.get('.shadow.card').find('button').click();
    cy.wait(2000);
  });

  it('navega a la página de detalle de la primera fundación, abre la pestaña de reviews y envía una reseña', () => {
    // 2) Click en el botón para ir a /foundations
    cy.get('[data-cy="discover-foundations-btn"]').click();

    // 3) Click en el primer "Ver detalles"
    cy.get('a[href^="/foundations/"]')
      .first()
      .click();

    // 4) Abrir la pestaña de reviews usando su atributo data-rr-ui-event-key
    cy.get('button[data-rr-ui-event-key="reviews"]').click();

    // 5) Escribir la reseña en el textarea (usa el placeholder, que no cambia con i18n)
    cy.get('textarea[placeholder="Comparte tu experiencia..."]')
      .type('Esta es una reseña automática de prueba.');

    // 6) Pulsar el botón de enviar comentario (type="submit" y btn-primary)
    cy.get('button[type="submit"].btn-primary').click();
  });
});