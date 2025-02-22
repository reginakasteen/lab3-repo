import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function Login() {
  const {loginUser} = useContext(AuthContext);
  const handleSubmit = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    email.length > 0 && loginUser(email, password);
    console.log(email)
    console.log(password)

  }
  return (
    <div className='h-screen'>
      <h1>Welcome back</h1>
      <h3>Sign into your account</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type='email' name='email'/>
        </div>
        <div>
          <label>Password</label>
          <input type='password' name='password'/>
        </div>
        <button type='submit'>Login</button>
      </form>
    <p>Do not have an account?<Link to='/register'>Sign up here for free</Link></p>
    </div>
  )
}

export default Login