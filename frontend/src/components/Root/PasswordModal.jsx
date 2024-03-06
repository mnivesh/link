import React from 'react'
import { IoClose } from "react-icons/io5";
import { useAuth } from '../../context/AuthContext';
import { useLink } from '../../context/LinkContext';

function PasswordModal(props) {
  const { isOpen, onClose, selectedUser } = props;
  const { setAlertState } = useLink();
  const { deleteUser, originalAdminList, originalUserList, setOriginalAdminList, setOriginalUserList } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(selectedUser);

    const response = await deleteUser(selectedUser._id);
    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    if (data.user.role === 'admin') {
      const updatedList = originalAdminList.filter(user => user._id !== data.user._id)
      setOriginalAdminList(updatedList);
    }
    else {
      const updatedList = originalUserList.filter(user => user._id !== data.user._id)
      setOriginalUserList(updatedList);
    }
    setAlertState({ isOn: true, message: data.message })

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
          <h4 className='head-label'>Are you sure you want to remove?</h4>
          <label style={{lineHeight: '1.3rem'}}><ins>{selectedUser.email}</ins> will not be able to access this website</label>
          
          <div className="flex content-end my-3 gap-x-2">
            <button onClick={onClose} type='button' className='close modal-btn'>Cancel</button>
            <button type='submit' className='add modal-btn'>Remove</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PasswordModal