import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../context/AuthContext';

function Login() {
  const { loginUser } = useContext(AuthContext);

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');
  if (email && email.length > 0) {
    loginUser(email, password);
  }
};

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-500 to-violet-500'>
      <div className='bg-white p-8 rounded-lg shadow-md max-w-sm w-full'>
        <h1 className='text-3xl font-semibold text-center text-gray-800 mb-4'>Welcome back</h1>
        <h3 className='text-lg text-center text-gray-600 mb-6'>Sign into your account</h3>
        <form onSubmit={handleSubmit} className='space-y-4' data-testid="login-form">
          <div>
            <label className='block text-sm font-medium text-gray-700' htmlFor='email'>
              Email
            </label>
            <input
              type='email'
              name='email'
              id='email'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700' htmlFor='password'>
              Password
            </label>
            <input
              type='password'
              name='password'
              id='password'
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full py-2 bg-violet-700 text-white font-semibold rounded-md hover:bg-violet-800 transition duration-200'
          >
            Login
          </button>
        </form>
        <p className='mt-4 text-center text-gray-600'>
          Do not have an account?{' '}
          <Link to='/register' className='text-emerald-700 hover:underline'>
            Sign up here for free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
