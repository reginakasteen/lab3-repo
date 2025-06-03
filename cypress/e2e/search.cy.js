describe('Search Component E2E', () => {
  const apiBase = 'https://127.0.0.1:8000/api'; // адаптируйте URL, если нужен
  const mockUsername = 'testuser';

  const mockResults = [
    { user: 'user1', name: 'User One', photo: 'https://example.com/photo1.jpg' },
    { user: 'user2', name: 'User Two', photo: 'https://example.com/photo2.jpg' },
  ];

  beforeEach(() => {
    // Мокаем хук useSearch — это сложнее в E2E, проще замокать сеть, если есть API
    // Если у вас нет API для поиска, тогда можно замокать компонент SearchBar и useSearch с cy.stub или с Cypress Component Testing.
    // Здесь предположим, что запросы к API идут по username и возвращают результаты.

    // Мокаем ответ на поиск пользователя (предположим, что поиск вызывает API)
    cy.intercept('GET', `**/search/${mockUsername}*`, {
      statusCode: 200,
      body: mockResults,
    }).as('getSearchResults');

    // Заходим на страницу с параметром username
    cy.visit(`/search/${mockUsername}`);

    // Ждём загрузки результатов
    cy.wait('@getSearchResults');
  });

  it('Отображает список пользователей после загрузки', () => {
    // Проверяем, что список результатов есть и правильный размер
    cy.get('a.list-group-item').should('have.length', mockResults.length);

    // Проверяем, что отображаются имена пользователей
    cy.get('a.list-group-item').first().contains(mockResults[0].name);
  });

  it('Каждый элемент списка содержит правильный путь и изображение', () => {
    mockResults.forEach((user, index) => {
      cy.get('a.list-group-item').eq(index)
        .should('have.attr', 'href', `/inbox/${user.user}/`)
        .find('img')
        .should('have.attr', 'src', 'https://chat-back-production-1153.up.railway.app/static/default_image.jpg'); // так как у вас src жестко прописан в коде
    });
  });

  it('Показывает "Loading..." если результатов нет', () => {
    // Смокируем пустой массив
    cy.intercept('GET', `**/search/emptyuser*`, {
      statusCode: 200,
      body: [],
    }).as('getEmptyResults');

    cy.visit('/search/emptyuser');
    cy.wait('@getEmptyResults');

    cy.contains('Loading...').should('be.visible');
  });

  it('Можно использовать SearchBar для поиска и перенаправления', () => {
    // В этом тесте можно проверить, что компонент SearchBar вызывает searchUser и страница обновляется
    // Но так как useSearch - кастомный хук, без моков сложно. Можно протестировать UI SearchBar отдельно в unit-тестах.
    // Здесь пример клика на кнопку поиска, если она есть

    // Предположим, SearchBar содержит input с id="search-input" и кнопку с id="search-btn"
    cy.get('input').first().type('newsearch');
    // Далее можно эмулировать отправку (если есть кнопка или onEnter)

    // Тут можно проверить, что URL обновился, например:
    // cy.url().should('include', 'newsearch');
  });
});
