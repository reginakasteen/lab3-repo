import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Profile from '../Profile';
import useAxios, { baseURL } from '../../utils/useAxios';

jest.mock('../../utils/useAxios');

describe('Profile component combined tests', () => {
  const mockGet = jest.fn();
  const mockPut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReset();
    mockPut.mockReset();
    useAxios.mockReturnValue({ get: mockGet, put: mockPut });
  });

  test('renders loading initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));
    render(<Profile />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('fetches and displays user data', async () => {
    const userData = {
      name: 'John Doe',
      gender: 'Male',
      bio: 'Hello world',
      date_of_birth: '1990-01-01',
      photo: 'https://chat-back-production-1153.up.railway.app/static/default_image.jpg',
    };
    mockGet.mockResolvedValueOnce({ data: userData });

    render(<Profile />);

    await waitFor(() =>
      expect(screen.getByText(/john doe/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/male/i)).toBeInTheDocument();
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
    expect(screen.getByText(/1990-01-01/i)).toBeInTheDocument();

    const img = screen.getByAltText(/profile/i);
    expect(img).toHaveAttribute('src', userData.photo);
  });

  test('handles error when fetching user data and logs error to console', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'));
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Profile />);

    await waitFor(() =>
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Fetching profile error:',
        expect.any(Error)
      )
    );

    consoleErrorSpy.mockRestore();
  });

  test('renders input fields with correct initial values after entering edit mode', async () => {
    const userData = {
      name: 'John Doe',
      gender: 'Male',
      bio: 'Developer',
      date_of_birth: '1990-01-01',
      photo: 'profile.jpg',
    };
    mockGet.mockResolvedValueOnce({ data: userData });

    render(<Profile />);
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /profile/i })
      ).toBeInTheDocument()
    );

    fireEvent.click(
      screen.getByRole('button', { name: /edit profile/i })
    );

    expect(screen.getByLabelText(/name:/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/gender:/i)).toHaveValue('Male');
    expect(screen.getByLabelText(/bio:/i)).toHaveValue('Developer');
    expect(screen.getByLabelText(/date of birth:/i)).toHaveValue(
      '1990-01-01'
    );
  });

  test('handleChange updates formData state', async () => {
    const userData = {
      name: 'John Doe',
      gender: '',
      bio: '',
      date_of_birth: '',
      photo: null,
    };
    mockGet.mockResolvedValueOnce({ data: userData });

    render(<Profile />);
    await waitFor(() =>
      screen.getByRole('heading', { name: /profile/i })
    );

    fireEvent.click(
      screen.getByRole('button', { name: /edit profile/i })
    );

    const nameInput = screen.getByLabelText(/name:/i);
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput).toHaveValue('New Name');

    const genderSelect = screen.getByLabelText(/gender:/i);
    fireEvent.change(genderSelect, { target: { value: 'Female' } });
    expect(genderSelect).toHaveValue('Female');
  });

  test('handleFileChange sets photoFile state when file selected', async () => {
    const userData = {
      name: 'John Doe',
      gender: '',
      bio: '',
      date_of_birth: '',
      photo: null,
    };
    mockGet.mockResolvedValueOnce({ data: userData });

    render(<Profile />);
    await waitFor(() =>
      screen.getByRole('heading', { name: /profile/i })
    );

    fireEvent.click(
      screen.getByRole('button', { name: /edit profile/i })
    );

    const fileInput = screen.getByTestId('photo-input');
    const file = new File(['dummy content'], 'photo.png', {
      type: 'image/png',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files[0]).toStrictEqual(file);
  });

  test('handleFileChange does nothing when no files selected', async () => {
    const userData = {
      name: 'John Doe',
      gender: '',
      bio: '',
      date_of_birth: '',
      photo: null,
    };
    mockGet.mockResolvedValueOnce({ data: userData });

    render(<Profile />);
    await waitFor(() =>
      screen.getByRole('heading', { name: /profile/i })
    );

    fireEvent.click(
      screen.getByRole('button', { name: /edit profile/i })
    );

    const fileInput = screen.getByTestId('photo-input');
    fireEvent.change(fileInput, { target: { files: [] } });

    expect(fileInput.files).toHaveLength(0);
  });

  test('successfully updates profile on submit', async () => {
    const userData = {
      name: 'John Doe',
      gender: 'Male',
      bio: 'Hello world',
      date_of_birth: '1990-01-01',
      photo: 'https://chat-back-production-1153.up.railway.app/static/default_image.jpg',
    };
    mockGet.mockResolvedValueOnce({ data: userData });
    mockPut.mockResolvedValueOnce({ data: { ...userData, name: 'Jane Doe' } });

    render(<Profile />);
    await waitFor(() =>
      screen.getByText(/john doe/i)
    );

    fireEvent.click(
      screen.getByRole('button', { name: /edit profile/i })
    );
    fireEvent.change(
      screen.getByDisplayValue('John Doe'),
      { target: { value: 'Jane Doe' } }
    );
    fireEvent.click(
      screen.getByRole('button', { name: /save changes/i })
    );

    await waitFor(() =>
      expect(screen.getByText(/jane doe/i)).toBeInTheDocument()
    );
  });

  test('handleSubmit appends photoFile to FormData when photoFile exists', async () => {
    const userData = {
      name: 'John Doe',
      gender: 'Male',
      bio: 'Hello world',
      date_of_birth: '1990-01-01',
      photo: 'https://chat-back-production-1153.up.railway.app/static/default_image.jpg',
    };
    mockGet.mockResolvedValueOnce({ data: userData });
    mockPut.mockResolvedValueOnce({ data: { ...userData, name: 'Jane Doe' } });

    render(<Profile />);
    await waitFor(() =>
      screen.getByText(/john doe/i)
    );

    fireEvent.click(
      screen.getByRole('button', { name: /edit profile/i })
    );
    fireEvent.change(
      screen.getByDisplayValue('John Doe'),
      { target: { value: 'Jane Doe' } }
    );

    const fileInput = screen.getByTestId('photo-input');
    const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(
      screen.getByRole('button', { name: /save changes/i })
    );

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledTimes(1);
      const formDataArg = mockPut.mock.calls[0][1];
      expect(formDataArg).toBeInstanceOf(FormData);
      expect(formDataArg.get('photo')).toStrictEqual(file);
      expect(formDataArg.get('name')).toBe('Jane Doe');
      expect(formDataArg.get('gender')).toBe(userData.gender);
      expect(formDataArg.get('bio')).toBe(userData.bio);
      expect(formDataArg.get('date_of_birth')).toBe(userData.date_of_birth);
    });
  });

  test('handles error when updating profile and calls console.error', async () => {
    const userData = {
      name: 'Jane Doe',
      gender: 'Female',
      bio: 'Tester',
      date_of_birth: '1992-02-02',
      photo: null,
    };
    mockGet.mockResolvedValueOnce({ data: userData });
    mockPut.mockRejectedValueOnce({ response: { data: 'Server error' } });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Profile />);
    await waitFor(() =>
      screen.getByRole('heading', { name: /profile/i })
    );

    fireEvent.click(
      screen.getByRole('button', { name: /edit profile/i })
    );
    fireEvent.change(
      screen.getByLabelText(/name:/i),
      { target: { value: 'Jane Test' } }
    );
    fireEvent.click(
      screen.getByRole('button', { name: /save changes/i })
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Profile updating error:',
        'Server error'
      );
    });
    consoleErrorSpy.mockRestore();
  });

  test('handles error when updating profile, form stays in edit mode and logs error', async () => {
    const userData = {
      name: 'John Doe',
      gender: 'Male',
      bio: 'Hello world',
      date_of_birth: '1990-01-01',
      photo: 'https://chat-back-production-1153.up.railway.app/static/default_image.jpg',
    };
    mockGet.mockResolvedValueOnce({ data: userData });
    mockPut.mockRejectedValueOnce({ response: { data: 'Update failed' } });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Profile />);
    await waitFor(() =>
      screen.getByText(/john doe/i)
    );

    fireEvent.click(
      screen.getByRole('button', { name: /edit profile/i })
    );
    fireEvent.change(
      screen.getByDisplayValue('John Doe'),
      { target: { value: 'Jane Doe' } }
    );
    fireEvent.click(
      screen.getByRole('button', { name: /save changes/i })
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Profile updating error:',
        'Update failed'
      );
    });
    consoleErrorSpy.mockRestore();
  });

  test('getPhotoUrl returns correct photo URL', () => {
    const userPhotos = [
      {
        photo: null,
        expected: `${baseURL}/static/default_image.jpg`,
      },
      {
        photo: 'http://example.com/photo.jpg',
        expected: 'http://example.com/photo.jpg',
      },
      {
        photo: 'profile.png',
        expected: `${baseURL}/static/profile.png`,
      },
    ];

    function TestComponent({ photo }) {
      const getPhotoUrl = (photo) => {
        if (!photo) return `${baseURL}/static/default_image.jpg`;
        if (photo.startsWith('http') || photo.startsWith('https')) {
          return photo;
        }
        return `${baseURL}/static/${photo}`;
      };
      return (
        <img
          src={getPhotoUrl(photo)}
          alt="Test"
          data-testid="test-img"
        />
      );
    }

    for (const { photo, expected } of userPhotos) {
      const { getByTestId, unmount } = render(
        <TestComponent photo={photo} />
      );
      expect(getByTestId('test-img')).toHaveAttribute('src', expected);
      unmount();
    }
  });
});
