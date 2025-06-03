const userId = 42;
const receiverId = 99;
const frontendBase = 'http://localhost:5173';
const apiBase = 'http://127.0.0.1:8000/api';

const fakeAccessToken = [
  btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
  btoa(JSON.stringify({ user_id: userId, exp: Math.floor(Date.now() / 1000) + 3600 })),
  'signature'
].join('.');

const fakeRefreshToken = 'fake-refresh-token';

describe('MessagesHistory Component', () => {
  const mockInterlocutor = {
    id: receiverId,
    name: 'Jane Doe',
    is_online: true,
    photo: 'https://example.com/interlocutor.jpg',
  };

  const mockMessages = [
    {
      sender: userId,
      receiver: receiverId,
      message: 'Hi there!',
      date: new Date().toISOString(),
      sender_profile: { name: 'You' }
    },
    {
      sender: receiverId,
      receiver: userId,
      message: 'Hello!',
      date: new Date().toISOString(),
      sender_profile: { name: 'Jane Doe', photo: 'https://example.com/interlocutor.jpg' }
    }
  ];

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('401') || err.message.includes('400')) return false;
    });

    window.localStorage.setItem('authTokens', JSON.stringify({
      access: fakeAccessToken,
      refresh: fakeRefreshToken
    }));

    cy.intercept('POST', `${apiBase}/token/refresh/`, {
      statusCode: 200,
      body: {
        access: fakeAccessToken,
        refresh: fakeRefreshToken
      }
    }).as('refreshToken');

    cy.intercept('GET', `${apiBase}/my-messages/${userId}/`, {
      statusCode: 200,
      body: []
    }).as('getMyMessages');

    cy.intercept('GET', `${apiBase}/get-messages/${userId}/${receiverId}/`, {
      statusCode: 200,
      body: mockMessages
    }).as('getMessages');

    cy.intercept('GET', `${apiBase}/profile/${receiverId}/`, {
      statusCode: 200,
      body: mockInterlocutor
    }).as('getProfile');

    cy.intercept('POST', `${apiBase}/send-message/`, (req) => {
      // Чтобы можно было проверить тело, записываем req.body в alias
      req.alias = 'sendMessage';
      req.reply({
        statusCode: 201,
        body: {}
      });
    });

    cy.visit(`${frontendBase}/inbox/${receiverId}`);
    cy.wait('@getMyMessages');
    cy.wait('@getMessages');
    cy.wait('@getProfile');
  });

  it('displays messages from both users', () => {
    cy.contains('Hi there!').should('exist');
    cy.contains('Hello!').should('exist');
    cy.contains('You').should('exist');
    cy.contains('Jane Doe').should('exist');
  });

  it('displays interlocutor name and online status', () => {
    cy.contains('Jane Doe').should('be.visible');
    cy.contains('Online').should('be.visible');
    cy.get('img[alt="User"]').should('have.attr', 'src', mockInterlocutor.photo);
  });

  it('sends a message and clears input', () => {
    const testMessage = 'Test message';
    cy.get('#message-input').type(testMessage);
    cy.contains('Send').click();

    cy.wait('@sendMessage').then((interception) => {
      expect(interception.request.body).to.include(testMessage);
    });

    cy.get('#message-input').should('have.value', '');
  });

  it('shows fallback image if interlocutor has no photo', () => {
    cy.intercept('GET', `${apiBase}/profile/${receiverId}/`, {
      statusCode: 200,
      body: { ...mockInterlocutor, photo: null }
    }).as('getProfileNoPhoto');

    cy.visit(`${frontendBase}/inbox/${receiverId}`);
    cy.wait('@getProfileNoPhoto');
    cy.get('img[alt="User"]')
      .should('have.attr', 'src')
      .and('include', 'default_image.jpg');
  });
});
