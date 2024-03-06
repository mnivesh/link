import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'

function UserItem(props) {
  const { data, updateSelectedUser, setPassModal } = props;

  const handleDelete = () => {
    updateSelectedUser(data);
    setPassModal(true);
  }

  return (
    <li className='user flex items-center'>
      <figure className='profile-pic'>
        <p className="initial">{data.email[0].toUpperCase()}</p>
      </figure>
      <p className='user-email'>{data.email}</p>
      <button className='delete-btn icon-btn' title='delete' onClick={handleDelete}>
        <FaTrashAlt />
      </button>
    </li>
  )
}

export default UserItem