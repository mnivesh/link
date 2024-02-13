import React from 'react'
import logo from '../../assets/LOGOfinal.png'
import { Link } from 'react-router-dom'
import Footer from '../Root/Footer'
import { useAuth } from '../../context/AuthContext';

function HomePage() {
  const {loggedIn, setLoggedIn, user, setUser} = useAuth();

  // method to logout 
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setUser({ _id: '', email: '', role: ''});
  }

  return (
    <>
      <main>
        <header className="header">
          <img src={logo} alt="Niveshonline link Logo" style={{ width: "200px", height: "auto", margin: "4.2rem 0" }} />
          <h1>Welcome to Niveshonline Internal link</h1>
          {/* <!-- Login button in the top-right corner --> */}
          {loggedIn ? 
            <button className="login-button" onClick={handleLogout}>Logout</button>
            : <Link to='/login' className="login-button">Login</Link> 
          }
        </header>

        <div className="widget-container">
          <Link className="widget" to="about_us">
            <h2>About Us</h2>
            <p>Learn more about Milestone Global Moneymart Pvt Ltd.</p>
          </Link>
          <Link className="widget" to="basic_link">
            <h2>Basic Link</h2>
            <p>Explore our basic financial resources.</p>
          </Link>

          <Link className="widget" to="app_link">
            <h2>App Link</h2>
            <p>Download the mNivesh App.</p>
          </Link>

          <Link className="widget" to="contact_us">
            <h2>Contact Us</h2>
            <p>Get in touch with us.</p>
          </Link>
          <Link className="widget" to="customer_support">
            <h2>Costumer Support</h2>
            <p>Get your problem resolved here.</p>
          </Link>
          {loggedIn && user?.role === 'admin' && <Link className="widget" to="dashboard">
            <h2>Dashboard</h2>
            <p>Manage all users</p>
          </Link>}

        </div>
      </main>
      <Footer />
    </>
  )
}

export default HomePage