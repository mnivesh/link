
import React, { useState, createContext, useEffect, useContext } from "react";
export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const url = `${process.env.REACT_APP_BASE_URL}/api`;
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({ _id: '', email: '', role: '' });
  const [originalAdminList, setOriginalAdminList] = useState([])
  const [originalUserList, setOriginalUserList] = useState([])

  // 1 login method for authentication 
  const login = async (email, password) => {
    const requestOptions = {
      credentials: 'include',
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
  const register = async (email, role) => {
    const requestOptions = {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ email, role })
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
  const fetchUser = async () => {
    const requestOptions = {
      accept: '/',
      method: 'GET',
      credentials: 'include'
    };

    try {
      const response = await fetch(`${url}/user/`, requestOptions);
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        setLoggedIn(true)
      }

    } catch (error) {
      console.log(error);
    }
  }

  // 4 change password when already logged in
  const changePassword = async (currentPassword, newPassword) => {
    const requestOptions = {
      credentials: 'include',
      method: 'PUT',

      headers: { 'Content-Type': 'application/json' },
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
  const deleteUser = async (userId) => {
    const requestOptions = {
      credentials: 'include',
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
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
      credentials: 'include',
      method: 'GET'
    };
    try {
      const response = await fetch(`${url}/user/all/?role=${role}`, requestOptions);
      const data = await response.json();
      if (!response.ok) {
        console.log('Error fetching users: ', response.error.message);
        alert("Unable to get user list, try again later");
        return;
      }

      return data;
    } catch (error) {
      console.log(error);
      return { 'error': 'Server error! Try again later' };
    }
  }

  // check if user is logged in 
  const isAuthenticated = async () => {
    try {
      console.log('url: ', process.env.REACT_APP_BASE_URL);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/isAuthenticated`, {
        credentials: 'include',
        method: 'GET'
      });
      const data = await response.json();
      console.log('data: ', data)
      if(!response.ok) {
        throw new Error(`Unable to verify session : ${data.error}`);
      }
  
      if(data.isAthenticated) {
        fetchUser();
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    isAuthenticated();

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