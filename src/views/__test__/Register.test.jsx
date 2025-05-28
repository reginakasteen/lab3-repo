import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../Register';
import AuthContext from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Register component', () => {
  const registerUser = jest.fn();

  beforeEach(() => {
    registerUser.mockClear();
    render(
      <AuthContext.Provider value={{ registerUser }}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  });

  test('renders register form inputs and button', () => {
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('calls registerUser with correct arguments on submit', () => {
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(registerUser).toHaveBeenCalledTimes(1);
    expect(registerUser).toHaveBeenCalledWith(
      'test@example.com',
      'testuser',
      'password123',
      'password123'
    );
  });
});
