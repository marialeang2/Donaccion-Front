describe('Filter oportunities by Date Filter', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/opportunities'); // Replace with the route where FilterSidebar is rendered
    cy.wait(2000); // Wait for the page to load
  });

  it('should update filters when start and end dates are changed', () => {
    // Select the start date input and type a date
    cy.get('#startDateInput').type('2025-05-22').should('have.value', '2025-05-22');

    // Select the end date input and type a date
    cy.get('#endDateInput').type('2025-06-06').should('have.value', '2025-06-06');

    cy.get('.opportunity-card').should('have.length', 2);

    // Optionally, assert that the filter results update accordingly
    // For example, check that a callback was called or filtered items are shown
    // cy.get('.filtered-item').should('have.length', expectedCount);
  });
});