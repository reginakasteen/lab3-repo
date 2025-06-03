const exp = Math.floor(Date.now() / 1000) + 3600;
const fakeAccessToken = [
  btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
  btoa(JSON.stringify({ exp })),
  'signature'
].join('.');
const fakeRefreshToken = 'fake-refresh-token';

describe('Profile Component Tests', () => {
  const apiBase = 'http://127.0.0.1:8000/api';
  const profileEndpoint = `${apiBase}/profile/`;

  const mockUserData = {
    name: 'John Doe',
    gender: 'Male',
    bio: 'Software Developer',
    date_of_birth: '1990-01-01',
    photo: 'default_image.jpg',
  };

  beforeEach(() => {
    window.localStorage.setItem('authTokens', JSON.stringify({
      access: fakeAccessToken,
      refresh: fakeRefreshToken,
    }));

    cy.intercept('GET', profileEndpoint, {
      statusCode: 200,
      body: mockUserData,
    }).as('getProfile');

    cy.intercept('PUT', profileEndpoint, (req) => {
      const bodyString = req.body;
      req.reply({
        statusCode: 200,
        body: {
          ...mockUserData,
          name:          extractMultipartField(bodyString, 'name'),
          gender:        extractMultipartField(bodyString, 'gender'),
          bio:           extractMultipartField(bodyString, 'bio'),
          date_of_birth: extractMultipartField(bodyString, 'date_of_birth'),
        },
      });
    }).as('putProfile');

    cy.visit('/profile');
    cy.wait('@getProfile');
  });

  it('Shows "Loading..." before data is loaded', () => {
    cy.intercept('GET', profileEndpoint, (req) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ statusCode: 200, body: mockUserData }), 500);
      });
    }).as('delayedGet');

    cy.visit('/profile');
    cy.contains('Loading...').should('be.visible');
    cy.wait('@delayedGet');
  });

  it('Shows userdata after loading', () => {
    cy.get('p').contains(`Name: ${mockUserData.name}`);
    cy.get('p').contains(`Gender: ${mockUserData.gender}`);
    cy.get('p').contains(`Bio: ${mockUserData.bio}`);
    cy.get('p').contains(`Date of Birth: ${mockUserData.date_of_birth}`);
    cy.get('img[alt="Profile"]')
      .should('have.attr', 'src')
      .and('include', `/static/${mockUserData.photo}`);
  });

  it('Goes to edit mode after clicking on button', () => {
    cy.contains('Edit Profile').click();
    cy.get('form').should('exist');
    cy.get('input[name="name"]').should('have.value', mockUserData.name);
    cy.get('select[name="gender"]').should('have.value', mockUserData.gender);
    cy.get('input[name="bio"]').should('have.value', mockUserData.bio);
    cy.get('input[name="date_of_birth"]').should('have.value', mockUserData.date_of_birth);
  });

  it('Changes data and sends the form', () => {
  cy.contains('Edit Profile').click();
  const newData = {
    name: 'Jane Smith',
    gender: 'Female',
    bio: 'QA Engineer',
    date_of_birth: '1992-12-12',
  };

  cy.get('input[name="name"]').clear().type(newData.name);
  cy.get('select[name="gender"]').select(newData.gender);
  cy.get('input[name="bio"]').clear().type(newData.bio);
  cy.get('input[name="date_of_birth"]').clear().type(newData.date_of_birth);

  cy.get('form').submit();

  cy.wait('@putProfile').then(({ request }) => {
    const bodyString = request.body;
    expect(bodyString).to.include(`name="name"`);
expect(bodyString).to.include(newData.name);

expect(bodyString).to.include(`name="gender"`);
expect(bodyString).to.include(newData.gender);

expect(bodyString).to.include(`name="bio"`);
expect(bodyString).to.include(newData.bio);

expect(bodyString).to.include(`name="date_of_birth"`);
expect(bodyString).to.include(newData.date_of_birth);

  });

  cy.contains(`Name: ${newData.name}`).should('be.visible');
  cy.contains(`Gender: ${newData.gender}`).should('be.visible');
  cy.contains(`Bio: ${newData.bio}`).should('be.visible');
  cy.contains(`Date of Birth: ${newData.date_of_birth}`).should('be.visible');
});


  it('Processes file for profile photo', () => {
  cy.contains('Edit Profile').click();
  
  cy.get('input[type="file"]', { timeout: 10000 })
    .should('exist')
    .should('be.visible')
    .attachFile('test-photo.png', { force: true });
  
  cy.get('input[type="file"]').then(input => {
    expect(input[0].files[0].name).to.equal('test-photo.png');
  });
});


  it('Handles error when updating profile', () => {
    cy.intercept('PUT', profileEndpoint, {
      statusCode: 400,
      body: { error: 'Invalid data' },
    }).as('putProfileError');

    cy.contains('Edit Profile').click();
    cy.get('form').submit();

    cy.wait('@putProfileError');
    cy.get('form').should('exist');
  });
});

function extractMultipartField(multipartString, fieldName) {
  const marker = `name="${fieldName}"`;
  const idx = multipartString.indexOf(marker);
  if (idx === -1) return '';
  const start = multipartString.indexOf('\r\n\r\n', idx) + 4;
  const end = multipartString.indexOf('\r\n', start);
  return multipartString.substring(start, end);
}
