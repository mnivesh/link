import React, { useEffect, useRef, useState } from 'react'

function Dropdown(props) {
  const [visible, setVisible] = useState(false);
  const container = useRef(null);

  const toggleDropdown = (e) => {
    setVisible(prevState => !prevState)
  }

  // method to handle click outside of the Dropdown 
  const handleClickOutside = (e) => {
    if (container.current && !container.current.contains(e.target)) {
      setVisible(false);
    }
  };

  // Effect to listen click outside of the Dropdown 
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])
  

  return (
    <div ref={container} className='dropdown flex'>
      <button type="button" className="toggle" onClick={toggleDropdown}>
        {props.toggleButton}
      </button>
      <div className={`dropdown-menu ${visible ? 'show' : 'hide'}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
        {props.children}
      </div>
    </div>
  )
}

export default Dropdown