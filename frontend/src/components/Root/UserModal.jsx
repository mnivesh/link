import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import '../../styles/ModalStyle.css';
import { useLink } from '../../context/LinkContext';

function UserModal(props) {
  const { isOpen, onClose, heading, actionButton } = props;
  const [credentials, setCredentials] = useState({ email: '', role: '' })
  const { updateRole, originalAdminList, originalUserList, setOriginalAdminList, setOriginalUserList } = useAuth();
  const { setAlertState } = useLink();
  const [allUsers, setAllUsers] = useState([]); // all users array to show in datalist options

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  }

  const submitForm = async (e) => {
    e.preventDefault();

    const response = await updateRole(credentials.email, credentials.role);


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
      // Add to admins if new role is admin
      setOriginalAdminList(prevAdmins => [...prevAdmins.filter(user => user._id !== data.user._id), data.user]);
      // Remove from users if previously a user
      setOriginalUserList(prevUsers => prevUsers.filter(user => user._id !== data.user._id));
    } else if (data.user.role === 'user') {
      // Add to users if new role is user
      setOriginalUserList(prevUsers => [...prevUsers.filter(user => user._id !== data.user._id), data.user]);
      // Remove from admins if previously an admin
      setOriginalAdminList(prevAdmins => prevAdmins.filter(user => user._id !== data.user._id));
    }

    // set credentials to empty string 
    setCredentials({ email: '', role: '' });

    // close the modal 
    onClose();

    // show success alert 
    setAlertState({ isOn: true, message: data.message })
  }

  // effect to update allUser array 
  useEffect(() => {
    setAllUsers([...originalAdminList, ...originalUserList]);

    return () => {
      setAllUsers([]);
    }
  }, [originalAdminList, originalUserList])
  
  if (!isOpen) return null;

  return (
    <form className="modal register" onSubmit={submitForm}>
      <div className="modal-content">
        <h2>{heading}</h2>
        <div className="flex flex-col gap-y-3">
          <input
            type="email"
            placeholder="Email"
            list='userlist'
            name='email'
            id='email'
            value={credentials.email}
            onChange={handleOnChange}
          />
          <datalist id='userlist'>{
            allUsers.map(user => (
              <option key={user._id} value={user.email}/>
            ))
          }</datalist>

          <select value={credentials.role} name='role' title='role' required onChange={handleOnChange}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex content-end my-3 gap-x-2">
          <button onClick={()=> {setCredentials({ email: '', role: '' }); onClose()}} type='button' className='close modal-btn'>Close</button>
          <button type='submit' className='add modal-btn'>{actionButton}</button>
        </div>
      </div>
    </form>
  );
}

export default UserModal