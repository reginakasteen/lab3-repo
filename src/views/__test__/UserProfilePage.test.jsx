import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserProfilePage from '../UserProfilePage';
import useAxios, { baseURL } from '../../utils/useAxios';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

jest.mock('../../utils/useAxios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

describe('UserProfilePage', () => {
  const mockGet = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    localStorage.getItem = jest.fn(() => 'fakeToken');
    jwtDecode.mockReturnValue({ user_id: 1 });
    useAxios.mockReturnValue({ get: mockGet });
    useParams.mockReturnValue({ id: '2' });
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders user data correctly', async () => {
    mockGet.mockResolvedValue({
      data: {
        id: 2,
        name: 'Alice',
        photo: 'alice.jpg',
        gender: 'Female',
        is_online: true,
        bio: 'Hello, I am Alice',
        date_of_birth: '2000-01-01',
      },
    });

    render(<UserProfilePage />);

    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText(/Hello, I am Alice/)).toBeInTheDocument();
    expect(screen.getByText('2000-01-01')).toBeInTheDocument();
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'alice.jpg');
  });

  test('displays offline status', async () => {
    mockGet.mockResolvedValue({
      data: {
        id: 2,
        name: 'Bob',
        is_online: false,
        photo: 'bob.jpg',
        gender: 'Male',
        bio: 'Just Bob',
        date_of_birth: '1995-05-15',
      },
    });

    render(<UserProfilePage />);

    expect(await screen.findByText('Offline')).toBeInTheDocument();
  });

  test('navigates to inbox on button click', async () => {
    mockGet.mockResolvedValue({
      data: {
        id: 2,
        name: 'Alice',
        is_online: true,
        gender: 'Female',
        photo: 'alice.jpg',
        bio: 'Hello, I am Alice',
        date_of_birth: '2000-01-01',
      },
    });

    render(<UserProfilePage />);
    const button = await screen.findByText('Write a message');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/inbox/2');
  });

  test('handles API error gracefully', async () => {
    const error = new Error('Network error');
    mockGet.mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<UserProfilePage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    consoleSpy.mockRestore();
  });
});
