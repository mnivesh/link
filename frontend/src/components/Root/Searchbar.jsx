import React from 'react'
import {IoSearchOutline} from 'react-icons/io5'

function Searchbar(props) {
  const { placeholder, inputValue, changeInputValue } = props;

  return (
    <form className='w-full'>
      <div className='searchbar flex'>
        <button type='submit' className='icon-btn'>
        <IoSearchOutline />
        </button>
        <input className='w-full' type="search" name="search" id="search" placeholder={placeholder} value={inputValue} onChange={changeInputValue} />
      </div>
    </form>
  )
}

export default Searchbar