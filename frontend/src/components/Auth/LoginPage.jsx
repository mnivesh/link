import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import LoginForm from './LoginForm'
import Footer from '../Root/Footer'
import { SiZoho } from "react-icons/si";
import logo from '../../assets/LOGOfinal.png'
import '../../styles/LoginStyle.css'

function LoginPage() {
  const [error, setError] = useState(null);


  const handleLogin = async () => {
    window.location.href = `auth/zoho`
  }

  useEffect(() => {
    let query = window.location.search;
    // Create a test URLSearchParams object
    const searchParams = new URLSearchParams(query);

    // set error to the state
    setError(searchParams.get('error'))
}, [])


return (
  <div className='login-page'>
    <header>
      <nav>
        <Link to='/' className='logo'>
          <img src={logo} alt="Niveshonline link Logo" style={{ height: '32px' }} />
        </Link>
      </nav>
    </header>
    <section className='body'>
      <div className='head'>
        <h4 className='welcome'>Welcome to Niveshonline</h4>
        <p className='continue'>Login to continue</p>
        {error === 'userNotFound' && <p className="error">Access Denied !</p>}
        <button
          id='login-with-zoho'
          onClick={handleLogin}
        >
          <span className='icon'><SiZoho /></span>
          <span className='text'>Login with Zoho</span>
        </button>
      </div>
    </section>
    {/* <LoginForm/> */}
    {/* <Footer/> */}
  </div>
)
}

export default LoginPage