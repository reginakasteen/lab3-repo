import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className='min-h-screen  flex-column items-center justify-center bg-emerald-100 p-4'>
      <img src="https://energetic-respect.up.railway.app/staticfiles/network.png" alt="Wifi image" className="w-1/2 m-auto sm:w-1/4 lg:w-1/3 xl:w-1/4"/>
      <div className='max-w-2xl w-full m-auto bg-emerald-200 p-6 rounded-lg shadow-lg'>
        <main className='bg-emerald-300 p-6 rounded-lg'>
          <h1 className='text-center text-2xl font-bold p-3'>
            Welcome To <span className='text-violet-700'>My</span><span className='text-emerald-700'>Net</span>
          </h1>
          <section className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold hover:text-gray-600'><Link to='/todo'> Todo List</Link></h3>
              <p className='text-gray-700'>Manage your tasks efficiently.</p>
            </div>
            <div>
              <h3 className='text-lg font-semibold  hover:text-gray-600'><Link to='/inbox'>Simple Chat Application</Link></h3>
              <p className='text-gray-700'>Communicate with friends in real-time.</p>
            </div>
            <div>
              <h3 className='text-lg font-semibold  hover:text-gray-600'><Link to='/profile'>Profile Settings</Link></h3>
              <p className='text-gray-700'>Configure the profile that other users see</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Homepage;
