import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DialoguesList from '../DialoguesList';
import jwtDecode from 'jwt-decode';
import useAxios from '../../utils/useAxios';
import moment from 'moment';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('jwt-decode', () => jest.fn());
jest.mock('../../utils/useAxios');

describe('DialoguesList', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fakeToken');
    jwtDecode.mockReturnValue({ user_id: 1 }); 
    useAxios.mockReturnValue({ get: mockGet });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders no dialogues message if messages array is empty', async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    render(
      <Router>
        <DialoguesList />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/No dialogues yet/i)).toBeInTheDocument();
    });
  });

  it('renders list of messages correctly', async () => {
    const fakeMessages = [
      {
        id: 1,
        sender: 1,
        receiver: 2,
        message: 'Hello',
        date: moment().toISOString(),
        sender_profile: { id: 1, name: 'SenderName', photo: 'sender-photo.jpg' },
        receiver_profile: { id: 2, name: 'ReceiverName', photo: 'receiver-photo.jpg' },
      },
      {
        id: 2,
        sender: 3,
        receiver: 1,
        message: 'Hi back',
        date: moment().subtract(5, 'minutes').toISOString(),
        sender_profile: { id: 3, name: 'OtherSender', photo: 'other-photo.jpg' },
        receiver_profile: { id: 1, name: 'MyName', photo: 'my-photo.jpg' },
      },
    ];

    mockGet.mockResolvedValueOnce({ data: fakeMessages });

    render(
      <Router>
        <DialoguesList />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('ReceiverName')).toBeInTheDocument();
      expect(screen.getByText('OtherSender')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi back')).toBeInTheDocument();

      expect(screen.getByRole('link', { name: /ReceiverName/i }).getAttribute('href')).toBe('/inbox/2');
      expect(screen.getByRole('link', { name: /OtherSender/i }).getAttribute('href')).toBe('/inbox/3');
    });
  });

  it('calls console.log on axios error', async () => {
    const error = new Error('Network Error');
    mockGet.mockRejectedValueOnce(error);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <Router>
        <DialoguesList />
      </Router>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    consoleSpy.mockRestore();
  });

  it('calls console.log on axios error', async () => {
  const error = new Error('Network Error');
  mockGet.mockRejectedValueOnce(error);

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  render(
    <Router>
      <DialoguesList />
    </Router>
  );

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith(error);
  });

  consoleSpy.mockRestore();
});
it('renders receiver profile photo when sender.id !== user_id', async () => {
  const mockUserId = 1;
  const mockMessage = {
    id: 123,
    sender: { id: 2 },
    receiver: 3,
    message: 'Hello!',
    date: new Date().toISOString(),
    sender_profile: { name: 'Other User', photo: 'sender_photo.jpg' },
    receiver_profile: { name: 'Receiver User', photo: 'receiver_photo.jpg' },
  };

  const mockToken = {
    user_id: mockUserId,
    exp: Date.now() / 1000 + 600,
  };

  localStorage.setItem('authTokens', JSON.stringify(mockToken));

  mockGet.mockResolvedValueOnce({ data: [mockMessage] });

  const { getByAltText } = render(
    <Router>
      <DialoguesList />
    </Router>
  );

  await waitFor(() => {
    const image = getByAltText('image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('default_image.jpg'));
  });
});
it('renders sender profile photo when sender.id === user_id', async () => {
  const mockUserId = 1;
  const mockMessage = {
    id: 456,
    sender: { id: 1 },
    receiver: 2,
    message: 'Hi!',
    date: new Date().toISOString(),
    sender_profile: { name: 'Sender User', photo: 'sender_photo.jpg' },
    receiver_profile: { name: 'Receiver User', photo: 'receiver_photo.jpg' },
  };

  const mockToken = {
    user_id: mockUserId,
    exp: Date.now() / 1000 + 600,
  };

  localStorage.setItem('authTokens', JSON.stringify(mockToken));

  mockGet.mockResolvedValueOnce({ data: [mockMessage] });

  const { getByAltText } = render(
    <Router>
      <DialoguesList />
    </Router>
  );

  await waitFor(() => {
    const image = getByAltText('image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('default_image.jpg'));
  });
});

});
