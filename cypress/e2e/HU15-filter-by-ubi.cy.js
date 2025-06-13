describe("Filtrar oportunidades por ubicación", () => {
  it("inicia sesión y filtra por una ubicación específica", () => {
    // Paso 1: Iniciar sesión
    cy.visit("http://localhost:3000");
    cy.contains("Iniciar sesión").click();
    cy.get('input[type="email"]').type("juanlozanog9@gmail.com");
    cy.get('input[type="password"]').type("asdfasdf");
    cy.get('button[type="submit"]').click();

    // Paso 2: Buscar oportunidades
    cy.contains("Buscar oportunidades").click();

    // Paso 3: Filtrar por ubicación (ejemplo: Cádiz)
    cy.get('input[placeholder="Filtrar por ubicación"]').type("Cádiz");

    // Paso 4: Validar que alguna tarjeta contenga "Cádiz"
    cy.contains("Cádiz").should("exist");
  });
});
