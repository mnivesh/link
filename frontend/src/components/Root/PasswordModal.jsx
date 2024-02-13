import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { IoClose } from "react-icons/io5";
import { useAuth } from '../../context/AuthContext';
import { useLink } from '../../context/LinkContext';

function PasswordModal(props) {
  const { isOpen, onClose, selectedUserId } = props;
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setAlertState } = useLink();
  const { deleteUser, originalAdminList, originalUserList, setOriginalAdminList, setOriginalUserList } = useAuth();

  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    setIsPasswordVisible(prevState => !prevState)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(selectedUserId);

    const response = await deleteUser(selectedUserId, password);
    const data = await response.json();

    if(!response.ok) {
      alert(data.error);
      return;
    }

    if(data.user.role === 'admin') {
      const updatedList = originalAdminList.filter(user => user._id !== data.user._id) 
      setOriginalAdminList(updatedList);
    }
    else {
      const updatedList = originalUserList.filter(user => user._id !== data.user._id) 
      setOriginalUserList(updatedList);
    }
    setAlertState({isOn: true, message: data.message})

    setPassword('');
    onClose();
  }
  if (!isOpen) return null

  return (
    <form className='modal pass-modal' onSubmit={handleSubmit}>
      <div className="modal-content relative">
        <button type='reset' className='icon-btn close-modal' onClick={onClose}>
          <IoClose />
        </button>
        <div className="flex flex-col">
          <label htmlFor="" className='head-label'>Enter admin's password to delete this user</label>
          <div className="flex flex-col">
            <label htmlFor="admin-password">Password</label>
            <div className='input-group'>
              <input
                className='w-full'
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                id="password"
                minLength='8'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button id='eye-icon' type='button' className='eye-icon' onClick={togglePasswordVisibility}> {
                isPasswordVisible ? <BsEyeSlash /> : <BsEye />
              }</button>

            </div>
          </div>
          <button type='submit' className='submit'>Submit</button>
        </div>
      </div>
    </form>
  )
}

export default PasswordModal