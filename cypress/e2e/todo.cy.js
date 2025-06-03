const apiBase = 'http://127.0.0.1:8000/api';
const userId = 42;
const fakeAccessToken = [
  btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
  btoa(JSON.stringify({ user_id: userId, exp: Math.floor(Date.now() / 1000) + 3600 })),
  'signature'
].join('.');

describe('Todo Component Tests', () => {
  const initialTodos = [
    { id: 1, title: 'First task', completed: false },
    { id: 2, title: 'Completed task', completed: true },
  ];

  beforeEach(() => {
    window.localStorage.setItem(
      'authTokens',
      JSON.stringify({ access: fakeAccessToken, refresh: 'fake-refresh' })
    );

    cy.intercept('GET', `${apiBase}/todo/${userId}/`, {
      statusCode: 200,
      body: initialTodos,
    }).as('getTodos');

    cy.intercept('POST', `${apiBase}/todo/${userId}/`, (req) => {
      const title = req.body.title || 'default title';
      req.reply({
        statusCode: 201,
        body: { id: 3, title, completed: false },
      });
    }).as('postTodo');

    cy.intercept('DELETE', `${apiBase}/todo-detail/${userId}/*`, {
      statusCode: 204,
      body: {},
    }).as('deleteTodo');

    cy.intercept('PATCH', `${apiBase}/todo-completed/${userId}/*`, {
      statusCode: 200,
      body: {},
    }).as('patchTodo');

    cy.visit('/todo');
    cy.wait('@getTodos');
  });

  it('Shows header and todo list', () => {
    cy.contains('Your Todo List').should('be.visible');
    cy.get('.space-y-4 > div').should('have.length', initialTodos.length);
    cy.get('.space-y-4 > div').eq(0).should('not.have.class', 'line-through');
    cy.get('.space-y-4 > div').eq(1).should('have.class', 'line-through');
  });

  it('Add todo disabled when input is empty or contains only spaces', () => {
    cy.get('#todo-input').clear();
    cy.contains('Add todo').should('be.disabled');

    cy.get('#todo-input').type('   ');
    cy.contains('Add todo').should('be.disabled');

    cy.get('#todo-input').clear().type('New Task');
    cy.contains('Add todo').should('not.be.disabled');
  });

  it('Adds new task and reload page', () => {
    const newTitle = 'Write Cypress tests';
    cy.get('#todo-input').type(newTitle);
    cy.contains('Add todo').click();

    cy.wait('@postTodo').its('request.body').then((body) => {
      expect(body.title).to.equal(newTitle);
    });

    cy.wait('@getTodos');
    cy.get('#todo-input').should('have.value', '');
  });

  it('Marks task as  completed', () => {
    cy.get('.space-y-4 > div').first().within(() => {
      cy.get('button').first().click();
    });

    cy.wait('@patchTodo');
    cy.wait('@getTodos');
  });

  it('Deletes task', () => {
    cy.get('.space-y-4 > div').first().within(() => {
      cy.get('button').last().click();
    });

    cy.wait('@deleteTodo');
    cy.wait('@getTodos');
  });

  it('Render empty list correctly', () => {
    cy.intercept('GET', `${apiBase}/todo/${userId}/`, {
      statusCode: 200,
      body: [],
    }).as('getEmpty');

    cy.reload();
    cy.wait('@getEmpty');

    cy.get('.space-y-4 > div').should('have.length', 0);
  });
});
