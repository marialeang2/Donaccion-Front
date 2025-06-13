describe("Crear una oportunidad de voluntariado", () => {
  it("inicia sesión y crea una oportunidad", () => {
    cy.visit("http://localhost:3000");

    // Ir a login
    cy.contains("Iniciar sesión").click();
    cy.get('input[type="email"]').type("j.lozanog@uniandes.edu.co");
    cy.get('input[type="password"]').type("asdfasdf");
    cy.get('button[type="submit"]').click();

    // Esperar el dashboard
    cy.url({ timeout: 10000 }).should("include", "/foundation/dashboard");
    cy.contains("Bienvenido").should("exist");

    // Crear oportunidad
    cy.contains("Crear Oportunidad").click();
    cy.get("textarea").type("Oportunidad");
    cy.get('input[name="startDate"]').type("2025-05-26");
    cy.get('input[name="endDate"]').type("2025-06-30");

    // 👇 Clic confiable en el botón submit
    cy.get('button[type="submit"]').click();

    // Validación: esperar que vuelva al dashboard o muestre confirmación
    cy.contains("Oportunidades Recientes", { timeout: 10000 }).should("exist");
  });
});
