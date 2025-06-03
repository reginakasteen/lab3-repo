const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MiwiZXhwIjoxNzQ4NDU5NzA5LCJpYXQiOjE3NDg0NTYxMDl9.RT04txKPwJltakmSglLV1srDSGjyQmTyyDmkfyDN8jI'; // ваш токен
const frontendBase = 'http://localhost:5173';
const apiBase = 'http://127.0.0.1:8000/api';

describe('User Profile Page', () => {
  const userId = 42;
  const mockProfileData = {
    id: userId,
    name: 'John Doe',
    bio: 'Hello, I love coding!',
    gender: 'Male',
    date_of_birth: '1995-06-15',
    is_online: false,
    photo: 'https://example.com/profile.jpg',
  };

  beforeEach(() => {
    cy.intercept('GET', `${apiBase}/profile/${userId}/`, {
      statusCode: 200,
      body: mockProfileData,
    }).as('getProfile');

    cy.visit(`${frontendBase}/profile/${userId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('authTokens', JSON.stringify({ access: token }));
      },
    });

    cy.wait('@getProfile');
  });

  it('displays user profile data correctly', () => {
    cy.contains('Profile').should('be.visible');
    cy.contains('John Doe').should('be.visible');
    cy.contains('Hello, I love coding!').should('be.visible');
    cy.contains('Gender: Male').should('be.visible');
    cy.contains('Date of Birth: 1995-06-15').should('be.visible');
    cy.get('img[alt="Profile"]').should('have.attr', 'src', mockProfileData.photo);
  });

  it('shows "Offline" when user is not online', () => {
    cy.contains('Status: Offline').should('exist');
    cy.get('.bg-green-500').should('not.exist');
  });

  it('navigates to inbox on button click', () => {
    cy.contains('Write a message').click();
    cy.url().should('include', `/inbox/${userId}`);
  });

  it('handles API error gracefully', () => {
    cy.intercept('GET', `${apiBase}/profile/${userId}/`, {
      statusCode: 500,
      body: { error: 'Server error' },
    }).as('getProfileError');

    cy.visit(`${frontendBase}/profile/${userId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('authTokens', JSON.stringify({ access: token }));
      },
    });

    cy.wait('@getProfileError');
    cy.contains('Profile').should('be.visible');
  });
});
