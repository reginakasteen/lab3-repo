import React from 'react';

function Homepage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-emerald-100 p-4'>
      <div className='max-w-2xl w-full bg-emerald-200 p-6 rounded-lg shadow-lg'>
        <main className='bg-emerald-300 p-6 rounded-lg'>
          <h1 className='text-center text-2xl font-bold p-3'>
            Welcome To <span className='text-emerald-700'>MyNet</span>
          </h1>
          <section className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold'>Todo List</h3>
              <p className='text-gray-700'>Manage your tasks efficiently.</p>
            </div>
            <div>
              <h3 className='text-lg font-semibold'>Simple Chat Application</h3>
              <p className='text-gray-700'>Communicate with friends in real-time.</p>
            </div>
            <div>
              <h3 className='text-lg font-semibold'>Project Management</h3>
              <p className='text-gray-700'>Track and collaborate on projects.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Homepage;
