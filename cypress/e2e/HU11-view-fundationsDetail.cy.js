describe("Ver detalle de una fundación", () => {
  it("navega hasta el detalle y verifica secciones", () => {
    // Paso 1: Visitar la página principal
    cy.visit("http://localhost:3000");

    // Paso 2: Clic en "Fundaciones" del navbar
    cy.contains("Fundaciones").click();

    // Paso 3: Clic en "Ver detalles" de la primera tarjeta
    cy.get("button, a").contains("Ver detalles").first().click();

    // Paso 4: Verificar que existen las pestañas "Acerca de" y "Oportunidades"
    cy.contains("Acerca de").should("exist");
    cy.contains("Oportunidades").should("exist");
  });
});
