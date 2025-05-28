import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import AuthContext from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Login component', () => {
  const loginUser = jest.fn();

  beforeEach(() => {
    loginUser.mockClear();
    render(
      <AuthContext.Provider value={{ loginUser }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  });

  test('renders login form with inputs and button', () => {
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('calls loginUser with email and password on submit', () => {
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByTestId('login-form'));

    expect(loginUser).toHaveBeenCalledTimes(1);
    expect(loginUser).toHaveBeenCalledWith('user@example.com', 'password123');
  });

  test('does not call loginUser if email is empty', () => {
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByTestId('login-form'));

    expect(loginUser).not.toHaveBeenCalled();
  });
});
