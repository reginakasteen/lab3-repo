import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessagesHistory from '../MessagesHistory';
import useAxios from '../../utils/useAxios';
import useSearch from '../../utils/useSearch';
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

jest.mock('../../utils/useAxios');
jest.mock('../../utils/useSearch');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('jwt-decode', () => jest.fn());

jest.mock('../DialoguesList', () => () => <div data-testid="dialogues-list-mock">DialoguesList mock</div>);

describe('MessagesHistory', () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useParams.mockReturnValue({ id: '2' });
    jwtDecode.mockReturnValue({ user_id: 1 });
    useAxios.mockReturnValue({
      get: mockGet,
      post: mockPost,
    });
    useSearch.mockReturnValue({
      searchUser: jest.fn(),
    });

    Storage.prototype.getItem = jest.fn(() => 'fakeToken');
  });

  test('renders and fetches messages and interlocutor', async () => {
    mockGet.mockImplementation((url) => {
      if (url.includes('/get-messages/')) {
        return Promise.resolve({
          data: [
            {
              sender: 1,
              message: 'Hello from me',
              date: new Date().toISOString(),
              sender_profile: { name: 'Me', photo: 'me.jpg' },
            },
            {
              sender: 2,
              message: 'Hello from you',
              date: new Date().toISOString(),
              sender_profile: { name: 'You', photo: 'you.jpg' },
            },
          ],
        });
      }
      if (url.includes('/profile/')) {
        return Promise.resolve({
          data: { name: 'Interlocutor', is_online: true, photo: 'photo.jpg' },
        });
      }
      return Promise.resolve({ data: {} });
    });

    render(<MessagesHistory />);

    expect(await screen.findByText('Interlocutor')).toBeInTheDocument();

    expect(screen.getByText('Hello from me')).toBeInTheDocument();
    expect(screen.getByText('Hello from you')).toBeInTheDocument();

    expect(screen.getByText('Online')).toBeInTheDocument();

    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(2);

    expect(screen.getByTestId('dialogues-list-mock')).toBeInTheDocument();
  });

  test('shows "No messages yet" if history is empty', async () => {
    mockGet.mockImplementation((url) => {
      if (url.includes('/get-messages/')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/profile/')) {
        return Promise.resolve({
          data: { name: 'Interlocutor', is_online: false },
        });
      }
      return Promise.resolve({ data: {} });
    });

    render(<MessagesHistory />);

    expect(await screen.findByText('No messages yet')).toBeInTheDocument();
  });

  test('updates input field on change and calls sendMessage on button click', async () => {
    mockGet.mockResolvedValue({ data: [] });
    mockPost.mockResolvedValue({});

    render(<MessagesHistory />);

    const input = screen.getByPlaceholderText('Type your message');
    fireEvent.change(input, { target: { value: 'New message' } });
    expect(input.value).toBe('New message');

    const button = screen.getByText('Send');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
    });
  });

});
