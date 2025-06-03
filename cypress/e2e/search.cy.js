describe('Search Component E2E', () => {
  const apiBase = 'https://127.0.0.1:8000/api'; 
  const mockUsername = 'testuser';

  const mockResults = [
    { user: 'user1', name: 'User One', photo: 'https://example.com/photo1.jpg' },
    { user: 'user2', name: 'User Two', photo: 'https://example.com/photo2.jpg' },
  ];
