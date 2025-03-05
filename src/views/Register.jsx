import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(email, username, password, password2);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-500 to-violet-500'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-sm w-full'>
        <h1 className='text-3xl font-semibold text-center text-gray-800 mb-4'>Welcome!</h1>
        <h3 className='text-lg text-center text-gray-600 mb-6'>Create a new account</h3>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <input
              type='email'
              placeholder='Email'
              name='email'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type='text'
              placeholder='Username'
              name='username'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type='password'
              placeholder='Password'
              name='password'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type='password'
              placeholder='Confirm password'
              name='password2'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
          <button
            type='submit'
            className='w-full py-2 bg-violet-700 text-white font-semibold rounded-md hover:bg-violet-800 transition duration-200'
          >
            Register
          </button>
        </form>
        <p className='mt-4 text-center text-gray-600'>
          Already have an account?{' '}
          <Link to='/login' className='text-emerald-700 hover:underline'>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
