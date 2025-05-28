import React from 'react';
import { render, screen } from '@testing-library/react';
import Search from '../Search';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useSearch from '../../utils/useSearch';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));

jest.mock('../../utils/useSearch');

describe('Search component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Loading... if results is empty', () => {
    useParams.mockReturnValue({ username: 'testuser' });
    useSearch.mockReturnValue({
      results: [],
      loading: true,
      searchUser: jest.fn(),
    });

    render(<Search />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders list of users when results available', () => {
    useParams.mockReturnValue({ username: 'testuser' });
    useSearch.mockReturnValue({
        results: [
        { user: '1', name: 'Alice', photo: 'alice.jpg' },
        { user: '2', name: 'Bob', photo: 'bob.jpg' },
        ],
        loading: false,
        searchUser: jest.fn(),
    });

    render(<Search />);

    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Alice/i }).getAttribute('href')).toBe('/inbox/1/');
    expect(screen.getByRole('link', { name: /Bob/i }).getAttribute('href')).toBe('/inbox/2/');

    const images = screen.getAllByRole('img');
    expect(images.length).toBe(2);

    expect(images[0]).toHaveAttribute('src', 'alice.jpg');
    expect(images[1]).toHaveAttribute('src', 'bob.jpg');
    });


  test('renders user photo if available, otherwise default image', () => {
    useParams.mockReturnValue({ username: 'testuser' });

    useSearch.mockReturnValue({
        results: [{ user: '1', name: 'Alice', photo: 'alice.jpg' }],
        loading: false,
        searchUser: jest.fn(),
    });
    const { rerender } = render(<Search />);
    let img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'alice.jpg');

    useSearch.mockReturnValue({
        results: [{ user: '2', name: 'Bob', photo: '' }],
        loading: false,
        searchUser: jest.fn(),
    });
    rerender(<Search />);
    img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://chat-back-production-1153.up.railway.app/static/default_image.jpg');
    });

});
