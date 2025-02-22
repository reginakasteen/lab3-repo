import React, { useContext } from 'react'
import { jwtDecode } from 'jwt-decode'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom';

function Navbar() {

  const {user, logoutUser} = useContext(AuthContext);
  const token = localStorage.getItem("authTokens");

  if (token) {
    const decoded = jwtDecode(token);
    let user_id = decoded.user_id;
  }

  return (
    <div className="text-center w-full flex py-4 bg-blue-800 shadow">
      <ul className='flex'>
        <li><Link to={'/'}>Home</Link></li>
        <li>About App</li>
        {token === null && 
        <>
          <li><Link to={'/login'}>Login</Link></li>
          <li><Link to={'/register'}>Sign Up</Link></li>
        </>
        }
        {token !== null && 
        <>
          <li><Link to={'/dashboard'}>Dashboard</Link></li>
          <li><Link to={'/todo'}>Todo List</Link></li>          
          <li><Link to={'/inbox'}>Inbox</Link></li>
          <li><Link to={'/login'} onClick={logoutUser}>Logout</Link></li>
        </>
        }
      </ul>
    </div>
  )
}

export default Navbar