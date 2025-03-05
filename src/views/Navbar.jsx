import React, { useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Иконки для бургера
import AuthContext from '../context/AuthContext';

function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const token = localStorage.getItem('authTokens');
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  let user_id = null;
  if (token) {
    const decoded = jwtDecode(token);
    user_id = decoded.user_id;
  }

  return (
    <nav className="bg-violet-700 shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Логотип */}
        <Link to="/" className="text-violet-100 font-bold text-lg">
          About App
        </Link>

        {/* Бургер-меню (мобильная версия) */}
        <button onClick={toggleMenu} className="md:hidden text-violet-100">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Навигация */}
        <ul className={`md:flex md:space-x-4 absolute md:static top-16 left-0 w-full sm:py-3 md:w-auto bg-violet-700 md:bg-transparent transition-transform duration-300 ${isOpen ? 'py-5 translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          {!token ? (
            <>
              <li><Link to='/login' className="text-violet-100 font-bold hover:text-violet-200  px-3 lg:py-3 sm:py-1 rounded transition duration-300">Login</Link></li>
              <li><Link to='/register' className="text-violet-100 font-bold hover:text-violet-200  px-3 lg:py-3 sm:py-1 rounded transition duration-300">Sign Up</Link></li>
            </>
          ) : (
            <>
              <li><Link to='/profile' className="text-violet-100 font-bold hover:text-violet-200 px-3 lg:py-3 sm:py-1 rounded transition duration-300">Profile</Link></li>
              <li><Link to='/todo' className="text-violet-100 font-bold hover:text-violet-200 px-3 lg:py-3 sm:py-1 rounded transition duration-300">Todo List</Link></li>
              <li><Link to='/inbox' className="text-violet-100 font-bold hover:text-violet-200 px-3 lg:py-3 sm:py-1 rounded transition duration-300">Inbox</Link></li>
              <li><Link to='/login' onClick={logoutUser} className="text-violet-100 font-bold hover:text-violet-200 px-3 lg:py-3 sm:py-1 rounded transition duration-300">Logout</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
