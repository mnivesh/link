import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import '../../styles/ModalStyle.css';
import { useLink } from '../../context/LinkContext';

function UserModal(props) {
  const { isOpen, onClose, heading, actionButton } = props;
  const [credentials, setCredentials] = useState({ email: '', role: '' })
  const { register, setOriginalAdminList, setOriginalUserList } = useAuth();
  const { setAlertState } = useLink();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  }

  const submitForm = async (e) => {
    e.preventDefault();

    const response = await register(credentials.email, credentials.role);


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
    setCredentials({ email: '', role: '' });

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