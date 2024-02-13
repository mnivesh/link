import React from 'react'
import {Link} from 'react-router-dom'
import LoginForm from './LoginForm'
import Footer from '../Root/Footer'
import logo from '../../assets/LOGOfinal.png'
import '../../styles/LoginStyle.css'

function LoginPage() {
  return (
    <div className='login-page'>
      <header>
        <nav>
          <Link to='/' className='logo'>
        <img src={logo} alt="Niveshonline link Logo" style={{height: '32px'}}/>
        </Link>
        </nav>
      </header>
      <LoginForm/>
      {/* <Footer/> */}
    </div>
  )
}

export default LoginPage