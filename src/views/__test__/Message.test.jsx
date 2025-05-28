import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from '../Message';
import useSearch from '../../utils/useSearch';

jest.mock('../../utils/useSearch');
jest.mock('../DialoguesList', () => () => <div data-testid="dialogues-list" />);
jest.mock('../SearchBar', () => (props) => (
  <div data-testid="search-bar">
    <button onClick={() => props.searchUser('test')}>Search</button>
  </div>
));

describe('Message component', () => {
  const mockSearchUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useSearch.mockReturnValue({ searchUser: mockSearchUser });
  });

  test('renders without crashing', () => {
    render(<Message />);
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('dialogues-list')).toBeInTheDocument();
  });

  test('passes searchUser function to SearchBar', () => {
    render(<Message />);
    const searchButton = screen.getByText('Search');
    searchButton.click();
    expect(mockSearchUser).toHaveBeenCalledWith('test');
  });
});
