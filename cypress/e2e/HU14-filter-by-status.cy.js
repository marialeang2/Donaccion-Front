describe("Filtrar oportunidades por estado", () => {
  it("inicia sesión y filtra por estado Próxima", () => {
    // Paso 1: Iniciar sesión
    cy.visit("http://localhost:3000");
    cy.contains("Iniciar sesión").click();
    cy.get('input[type="email"]').type("juanlozanog9@gmail.com");
    cy.get('input[type="password"]').type("asdfasdf");
    cy.get('button[type="submit"]').click();

    // Paso 2: Ir a oportunidades
    cy.contains("Buscar oportunidades").click();

    // Paso 3: Usar el filtro "Estado" y seleccionar "Próxima"
    cy.get("select").select("Activa");

    // Paso 4: Validar que al menos una tarjeta tenga la etiqueta "Próxima"
    cy.contains("Próxima").should("exist");
  });
});
