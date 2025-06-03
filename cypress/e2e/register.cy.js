describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('renders all UI elements', () => {
    cy.contains('Welcome!').should('be.visible');
    cy.contains('Create a new account').should('be.visible');

    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('input[name="password2"]').should('exist');

    cy.contains('Your password must:').should('be.visible');

    cy.get('button[type="submit"]').should('contain.text', 'Register');
    cy.contains('Already have an account?').should('contain.text', 'Log in');
    cy.get('a[href="/login"]').should('exist');
  });

  it('allows user to type in all inputs', () => {
    cy.get('input[name="email"]')
      .type('test@example.com')
      .should('have.value', 'test@example.com');

    cy.get('input[name="username"]')
      .type('testuser')
      .should('have.value', 'testuser');

    cy.get('input[name="password"]')
      .type('Password123')
      .should('have.value', 'Password123');

    cy.get('input[name="password2"]')
      .type('Password123')
      .should('have.value', 'Password123');
  });

  it('prevents submission with empty inputs', () => {
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/register');
  });

  it('submits form with valid data (mocked)', () => {
    cy.intercept('POST', '/api/register/', {
      statusCode: 201,
      body: { message: 'User registered successfully' },
    }).as('registerRequest');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('Password123');
    cy.get('input[name="password2"]').type('Password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest');
    
    cy.url().should('include', '/login');
  });

  it('navigates to login page via link', () => {
  cy.get('a[href="/login"]').first().click();
  cy.url().should('include', '/login');
});
it('when passwords do not match', () => {
  cy.get('input[name="email"]').type('test@example.com');
  cy.get('input[name="username"]').type('testuser');
  cy.get('input[name="password"]').type('Password123');
  cy.get('input[name="password2"]').type('Password456');

  cy.get('button[type="submit"]').click();

  cy.url().should('include', '/register');

  cy.get('input[name="password2"]').should('have.class', 'error');
});

});
