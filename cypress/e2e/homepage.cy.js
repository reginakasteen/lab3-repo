describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the main heading', () => {
    cy.contains('Welcome To').should('be.visible');
    cy.get('h1').within(() => {
      cy.get('span.text-violet-700').should('contain.text', 'My');
      cy.get('span.text-emerald-700').should('contain.text', 'Net');
    });
  });

  it('shows the three main links', () => {
    cy.get('a[href="/todo"]').should('contain.text', 'Todo List');
    cy.get('a[href="/inbox"]').should('contain.text', 'Simple Chat Application');
    cy.get('a[href="/profile"]').should('contain.text', 'Profile Settings');
  });

  it('navigates to login when accessing protected /todo', () => {
    cy.get('a[href="/todo"]').click();
    cy.url().should('include', '/login');
  });
});
