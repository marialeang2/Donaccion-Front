describe("Postularse a una oportunidad", () => {
  it("inicia sesión y abre el formulario de postulación", () => {
    // Paso 1: Iniciar sesión
    cy.visit("http://localhost:3000");
    cy.contains("Iniciar sesión").click();
    cy.get('input[type="email"]').type("juanlozanog9@gmail.com");
    cy.get('input[type="password"]').type("asdfasdf");
    cy.get('button[type="submit"]').click();

    // Paso 2: Clic en "Buscar oportunidades"
    cy.contains("Buscar oportunidades").click();

    // Paso 3: Esperar a que se carguen las tarjetas y hacer clic en "Postularse" de la primera
    cy.get("button").contains("Postularse").first().scrollIntoView().click();

    // Paso 4: Confirmar que se abrió el formulario modal
    cy.contains("Formulario de solicitud").should("exist");
    cy.get("textarea").should("exist");
  });
});
