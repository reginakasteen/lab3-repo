import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import Homepage from '../Homepage';

describe('Homepage component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );
  });

 test('renders without crashing', () => {
  const mainHeading = screen.getByRole('heading', { level: 1 });
  expect(mainHeading.textContent).toMatch(/welcome to mynet/i);
});


  test('renders image with correct alt text', () => {
    const img = screen.getByAltText(/wifi image/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('network.png'));
  });

  test('renders all navigation links with correct hrefs', () => {
    const todoLink = screen.getByRole('link', { name: /todo list/i });
    const chatLink = screen.getByRole('link', { name: /simple chat application/i });
    const profileLink = screen.getByRole('link', { name: /profile settings/i });

    expect(todoLink).toBeInTheDocument();
    expect(todoLink).toHaveAttribute('href', '/todo');

    expect(chatLink).toBeInTheDocument();
    expect(chatLink).toHaveAttribute('href', '/inbox');

    expect(profileLink).toBeInTheDocument();
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  test('renders all descriptive texts', () => {
    expect(screen.getByText(/manage your tasks efficiently/i)).toBeInTheDocument();
    expect(screen.getByText(/communicate with friends in real-time/i)).toBeInTheDocument();
    expect(screen.getByText(/configure the profile that other users see/i)).toBeInTheDocument();
  });
});
