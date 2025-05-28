import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';
import useSearch from '../../utils/useSearch';

jest.mock('../../utils/useSearch');

describe('SearchBar', () => {
  const mockSearchUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and button with text "Search" when not loading', () => {
    useSearch.mockReturnValue({ loading: false });

    render(<SearchBar searchUser={mockSearchUser} />);
    const input = screen.getByPlaceholderText(/search/i);
    const button = screen.getByRole('button', { name: /search/i });

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Search');
  });

  it('disables button and shows "Searching..." when loading', () => {
    useSearch.mockReturnValue({ loading: true });

    render(<SearchBar searchUser={mockSearchUser} />);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Searching...');
  });

  it('updates query state on typing', () => {
    useSearch.mockReturnValue({ loading: false });

    render(<SearchBar searchUser={mockSearchUser} />);
    const input = screen.getByPlaceholderText(/search/i);

    fireEvent.change(input, { target: { value: 'alice' } });
    expect(input).toHaveValue('alice');

    fireEvent.change(input, { target: { value: 'bob' } });
    expect(input).toHaveValue('bob');
  });

  it('calls searchUser with current query on button click', () => {
    useSearch.mockReturnValue({ loading: false });

    render(<SearchBar searchUser={mockSearchUser} />);
    const input = screen.getByPlaceholderText(/search/i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'charlie' } });
    fireEvent.click(button);

    expect(mockSearchUser).toHaveBeenCalledTimes(1);
    expect(mockSearchUser).toHaveBeenCalledWith('charlie');
  });

  
});
