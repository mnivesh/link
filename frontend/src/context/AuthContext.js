
import React, { useState, createContext, useEffect, useContext } from "react";
export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

function AuthProvider({children}) {
  const url = process.env.REACT_APP_BACKEND_URL;
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({ _id: '', email: '', role: ''});
  const [originalAdminList, setOriginalAdminList] = useState([])
  const [originalUserList, setOriginalUserList] = useState([])

  // 1 login method for authentication 
  const login = async (email, password) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ email, password })
    };
    try {
      const response = await fetch(`${url}/user/login`, requestOptions);
      return response;
    } catch (error) {
      console.log(error);
      return { 'error': 'Server error! Try again later' };
    }
  }

  // 2 registration By admin
  const register = async ( email, password, role ) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
      body: JSON.stringify({ email, password, role })
    };
    try {
      const response = await fetch(`${url}/user/register`, requestOptions);
      return response;
    } catch (error) {
      console.log(error);
      return { 'error': 'Server error! Try again later' };
    }
  }
  
  // 3 method to fetch user details 
  const fetchUser = async (token) => {
    const requestOptions = {
      accept: '/',
      method: 'GET',
      headers: { 'token': token }
    };

    try {
      const response = await fetch(`${url}/user/`, requestOptions);
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }

    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }

  // 4 change password when already logged in
  const changePassword = async (currentPassword, newPassword) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
      body: JSON.stringify({ currentPassword, newPassword })
    };
    try {
      const response = await fetch(`${url}/user/change-password`, requestOptions);
      return response;
    } catch (error) {
      console.log(error);
      return { 'error': 'Server error! Try again later' };
    }
  }


  // 5 delete user by admin
  const deleteUser = async (userId, adminPassword) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'token': localStorage.getItem('token') },
      body: JSON.stringify({ 'password': adminPassword })
    };
    try {
      const response = await fetch(`${url}/user/${userId}`, requestOptions);
      return response;
    } catch (error) {
      console.log(error);
      return { 'error': 'Server error! Try again later' };
    }
  }

  // 6 change password when already logged in
  const getUserList = async (role) => {
    const requestOptions = {
      method: 'GET',
      headers: { 'token': localStorage.getItem('token') }
    };
    try {
      const response = await fetch(`${url}/user/all/?role=${role}`, requestOptions);
      const data = await response.json();
      if(!response.ok) {
        console.log('Error fetching users: ', response.error.message);
        alert("Unable to get user list, try again later");
        return ;
      }

      return data;
    } catch (error) {
      console.log(error);
      return { 'error': 'Server error! Try again later' };
    }
  }


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      fetchUser(token);
    }

  }, [loggedIn])

  return (
    <AuthContext.Provider
      value={{
        login, 
        register, 
        changePassword,
        user, 
        setUser,
        fetchUser, 
        getUserList,
        deleteUser,
        originalAdminList,
        setOriginalAdminList,
        originalUserList,
        setOriginalUserList,
        loggedIn, 
        setLoggedIn,  
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;