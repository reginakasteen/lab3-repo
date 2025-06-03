describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('renders all UI elements', () => {
    cy.contains('Welcome back').should('be.visible');
    cy.contains('Sign into your account').should('be.visible');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('contain.text', 'Login');
    cy.contains('Sign up here for free').should('have.attr', 'href', '/register');
  });

  it('prevents login with empty form', () => {
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
  });

  it('allows user to type in email and password', () => {
    cy.get('input[name="email"]').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('input[name="password"]').type('password123').should('have.value', 'password123');
  });

  it('submits form with valid credentials (mocked)', () => {
    cy.intercept('POST', '/api/token/', {
      statusCode: 200,
      body: {
        access: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.' +
                'signature123',
        refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                'eyJ0eXAiOiJyZWZyZXNoIiwidXNlcl9pZCI6MX0.' +
                'refreshsig456'
      }
    }).as('loginRequest');

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');

    cy.url().should('not.include', '/login');
  });


  it('navigates to the registration page via link', () => {
    cy.contains('Sign up here for free').click();
    cy.url().should('include', '/register');
  });


  describe('Negative Scenarios', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('shows error on wrong credentials (mocked 401)', () => {
      cy.intercept('POST', '/api/token/', {
        statusCode: 401,
        body: { detail: 'No active account found with the given credentials' }
      }).as('loginRequest');

      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');

      cy.get('[data-cy="login-error"]').should('contain.text', 'Invalid credentials');
      cy.url().should('include', '/login');
    });

    it('does not submit with only email filled', () => {
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/login');
      cy.get('[data-cy="login-error"]').should('contain.text', 'Please fill in all fields');
    });

    it('does not submit with only password filled', () => {
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/login');
      cy.get('[data-cy="login-error"]').should('contain.text', 'Please fill in all fields');
    });

    it('shows browser validation error for invalid email format', () => {
      cy.get('input[name="email"]').type('not-an-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.get('input[name="email"]:invalid').should('exist'); // HTML5 native check
    });
  });

});
