
import React, { useState, createContext, useContext, useEffect } from "react";
export const LinkContext = createContext();

export const useLink = () => {
  return useContext(LinkContext);
}

function LinkProvider({ children }) {
  const url = `${process.env.REACT_APP_BASE_URL}/api`;
  const [linksArray, setLinksArray] = useState([])
  const [linkItems, setLinkItems] = useState([])
  const [loading, setLoading] = useState(true);
  const [alertState, setAlertState] = useState({ isOn: false, message: '' });

  useEffect(() => {
    setLinkItems(linksArray);

  }, [linksArray])

  // 1 method to add new link 
  const addLink = async (linkObject) => {
    const requestOptions = {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(linkObject)
    };
    try {
      const response = await fetch(`${url}/link`, requestOptions);
      return response;
    } catch (error) {
      console.log(error);
      return { 'error': 'Server error! Try again later' };
    }
  }

  // 2 method to update a link 
  const updateLink = async (linkId, updateFields) => {
    const requestOptions = {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(updateFields)
    };
    try {
      const response = await fetch(`${url}/link/${linkId}`, requestOptions);
      return response;
    } catch (error) {
      console.log(error);
      return { 'error': 'Server error! Try again later' };
    }
  }

  // 3 method to delete link 
  const deleteLink = async (linkId) => {
    const requestOptions = {
      credentials: 'include',
      method: 'DELETE'
    };

    try {
      const response = await fetch(`${url}/link/${linkId}`, requestOptions);
      return response

    } catch (error) {
      console.log(error);
      return { 'error': 'Server error! Try again later' };
    }
  }

  // 4 method to fetch all links 
  const getAllLinks = async () => {
    setLoading(true);

    const requestOptions = {
      credentials: 'include',
      method: 'GET'
    };

    try {
      const response = await fetch(`${url}/link/`, requestOptions);
      const data = await response.json()
      if (!response.ok) {
        alert(data.error)
      }

      setLinkItems(data.links)
      setLinksArray(data.links)
    } catch (error) {
      console.log(error);
      return { 'error': 'Server error! Try again later' };
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <LinkContext.Provider
      value={{
        addLink,
        updateLink,
        deleteLink,
        getAllLinks,
        linkItems,
        setLinkItems,
        linksArray,
        setLinksArray,
        loading,
        alertState,
        setAlertState
      }}
    >
      {children}
    </LinkContext.Provider>
  )
}

export default LinkProvider;