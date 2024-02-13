import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './components/Home/HomePage.jsx';
import AboutUs from './components/OtherPages/AboutUs.jsx';
import BasicLink from './components/OtherPages/BasicLink.jsx';
import ContactUs from './components/OtherPages/ContactUs.jsx';
import CustomerSupport from './components/OtherPages/CustomerSupport.jsx';
import AppLink from './components/OtherPages/AppLink.jsx';
import LoginPage from './components/Auth/LoginPage.jsx';
import AuthProvider from './context/AuthContext.js';
import Protected from './components/Root/Protected.jsx';
import LinkProvider from './context/LinkContext.js';
import Dashboard from './components/OtherPages/Dashboard.jsx';

// router object 
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/about_us",
    element: (
      <Protected >
        <AboutUs/>
      </Protected>
    ),
  },
  {
    path: "/basic_link",
    element: (
      <Protected>
        <BasicLink/>
      </Protected>
    ),
  },
  {
    path: "/contact_us",
    element: (
      <Protected>
        <ContactUs/>
      </Protected>
    ),
  },
  {
    path: "/customer_support",
    element: (
      <Protected>
        <CustomerSupport/>
      </Protected>
    ),
  },
  {
    path: "/app_link",
    element: (
      <Protected>
        <AppLink/>
      </Protected>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Protected>
        <Dashboard/>
      </Protected>
    ),
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <LinkProvider>
      <RouterProvider router={router} />
      </LinkProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
