import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useAuth } from '../../context/AuthContext';

function LoginForm() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login, setLoggedIn } = useAuth();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setCredentials({...credentials, [name]: value });
  }

  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    setIsPasswordVisible(prevState => !prevState)
  }

  const submitForm = async (e) => {
    e.preventDefault();
    
    const response = await login(credentials.email, credentials.password);
    
    // // convert response into json 
    const data = await response.json();
    
    // show alert if response is not ok 
    if (!response.ok) {
      return alert(data.error);
    }

    // set token into localStorage 
    localStorage.setItem('token', data.token);

    // set loggedin state true 
    setLoggedIn(true)

    // set credentials to empty string 
    setCredentials({ email: '', password: '' });

    // navigate to Homepage 
    navigate('/', {replace: true})
  }

  return (
    <form className='login' onSubmit={submitForm}>
      <div className='container'>
        <div className='head'>
          <h3>Login</h3>
          <p className='welcome'>Welcome to Niveshonline</p>
        </div>
        <div className="body">
          <div className='flex-col gap-y-1'>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={credentials.email}
              onChange={handleOnChange}
            />
          </div>

          <div className='flex-col gap-y-1'>
            <label htmlFor="password">Password</label>
            <div className='input-group'>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                id="password"
                minLength='8'
                value={credentials.password}
                onChange={handleOnChange}
              />
              <button className='eye-icon' type='button' onClick={togglePasswordVisibility}> {
                isPasswordVisible ? <BsEyeSlash /> : <BsEye />
              }</button>

            </div>
          </div>

          <div>
            <input
              type="submit"
              name="submit"
              id="submit"
              value='Submit'
            />
            {/* <div className='signup-link'><span>Don't have an account? </span><Link to='/'>Sign up</Link></div> */}
          </div>
        </div>
      </div>
    </form>
  )
}

export default LoginForm