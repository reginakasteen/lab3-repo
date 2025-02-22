import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function Register() {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const {registerUser} = useContext(AuthContext);
  console.log(email);
  const handleSubmit = async e => {
    e.preventDefault();
    registerUser(email, username, password, password2);
  }

  return (
    <div className='h-screen'>
      <h1>Welcome!</h1>
      <h3>Create a new account</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <input type='email' placeholder='Email' name='email' onChange={e => setEmail(e.target.value)}/>
        </div>
        <div>
          <input type='text' placeholder='Username' name='username' onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
          <input type='password' placeholder='Password' name='password' onChange={e => setPassword(e.target.value)}/>
        </div>
        <div>
          <input type='password' placeholder='Confirm password' name='password2' onChange={e => setPassword2(e.target.value)}/>
        </div>
        <button type='submit'>Register</button>
      </form>
      <p>Already have an account?<Link to='/login'>Log in</Link></p>

    </div>
  )
}

export default Register