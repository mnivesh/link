import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useAuth } from '../../context/AuthContext';
import '../../styles/ModalStyle.css';
import { useLink } from '../../context/LinkContext';

function UserModal(props) {
  const { isOpen, onClose, heading, actionButton } = props;
  const [credentials, setCredentials] = useState({ email: '', password: '', role: '' })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { register, setOriginalAdminList, setOriginalUserList } = useAuth();
  const { setAlertState } = useLink();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  }

  const togglePasswordVisibility = (e) => {
    e.preventDefault()
    setIsPasswordVisible(prevState => !prevState)
  }

  const submitForm = async (e) => {
    e.preventDefault();

    const response = await register(credentials.email, credentials.password, credentials.role);


    // convert response to json 
    const data = await response.json();

    // show alert if response is not ok 
    if(!response.ok) {
      if(Array.isArray(data.error)) {
        alert(data.error.map(e => `${e.msg}`).join('\n'))
        return;
      }
      return alert(data.error)
    }

    // Update users list 
    if (data.user.role === 'admin') {
      setOriginalAdminList(prevList => [data.user, ...prevList])
    }
    else {
      setOriginalUserList(prevList => [data.user, ...prevList])
    }

    // set credentials to empty string 
    setCredentials({ email: '', password: '' });

    // close the modal 
    onClose();

    // show success alert 
    setAlertState({ isOn: true, message: data.message })
  }

  if (!isOpen) return null;

  return (
    <form className="modal register" onSubmit={submitForm}>
      <div className="modal-content">
        <h2>{heading}</h2>
        <div className="flex flex-col gap-y-3">
          <input
            type="email"
            placeholder="Email"
            name='email'
            id='email'
            value={credentials.email}
            onChange={handleOnChange}
          />
          <select value={credentials.role} name='role' required onChange={handleOnChange}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className='input-group'>
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              id="password"
              minLength='8'
              value={credentials.password}
              onChange={handleOnChange}
            />
            <button id='eye-icon' type='button' className='eye-icon' onClick={togglePasswordVisibility}> {
              isPasswordVisible ? <BsEyeSlash /> : <BsEye />
            }</button>

          </div>
        </div>
        <div className="flex content-end my-3 gap-x-2">
          <button onClick={onClose} type='button' className='close modal-btn'>Close</button>
          <button type='submit' className='add modal-btn'>{actionButton}</button>
        </div>
      </div>
    </form>
  );
}

export default UserModal