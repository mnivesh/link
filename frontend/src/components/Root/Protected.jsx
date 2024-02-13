import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import LoadingPage from './LoadingPage';

function Protected({children}) {
  const { loggedIn, loading } = useAuth();

  if(loading) {return <LoadingPage/>}

  return (loggedIn ? children : <Navigate to="/login" replace/>);
}

export default Protected