import React, { useEffect, useState } from 'react';
import '../../styles/ModalStyle.css'
import { useLink } from '../../context/LinkContext';

const Modal = (props) => {
  const { isOpen, onClose, disableCategory, heading, action, actionButton, selectedLink, updateSelectedLink } = props
  const [linkItem, setLinkItem] = useState(selectedLink);
  const { addLink, updateLink, linksArray, setLinksArray, setAlertState } = useLink();

  const handleOnChange = (e) => {
    let {name, value} = e.target;
    setLinkItem({...linkItem, [name]: value})
  };

  // method to add new link 
  const handleAddLink = async () => {
    const response = await addLink(linkItem);
    const data = await response.json();
    if(!response.ok) {
      if(Array.isArray(data.error)) {
        alert(data.error.map(e => `${e.msg}`).join('\n'))
        return;
      }
      return alert(data.error)
    }
    
    setLinksArray(prevItems => [...prevItems, data.link])
    setAlertState({isOn: true, message: data.message})
    onClose(); // Close the modal after submission
  }

  // method to update link 
  const handleUpdateLink = async () => {
    // return if old and new link items are same 
    if(selectedLink.title === linkItem.title && selectedLink.url === linkItem.url) {
      return;
    }

    // make api request to update 
    const updateFields = {};
    if(selectedLink.title !== linkItem.title) {
      updateFields.title = linkItem.title
    }
    if(selectedLink.url !== linkItem.url) {
      updateFields.url = linkItem.url
    }

    const response = await updateLink(selectedLink._id, updateFields);
    const data = await response.json();
    if(!response.ok) {
      if(Array.isArray(data.error)) {
        alert(data.error.map(e => `${e.msg}`).join('\n'))
        return;
      }
      return alert(data.error)
    }
    
    const updatedLinks = linksArray.map(
      link => {
        if(link._id === selectedLink._id)
          return data.link;
        else  
          return link;
      }
    ) 
    setLinksArray(updatedLinks);

    setAlertState({isOn: true, message: data.message})
    onClose(); // Close the modal after submission
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // update the selectedLink first 
    updateSelectedLink(linkItem);

    // Handle the submission logic here
    action === 'add' ? handleAddLink() : handleUpdateLink();
  };

  useEffect(() => {
    setLinkItem(selectedLink);
  
  }, [selectedLink])
  

  
  if (!isOpen) return null;

  return (
    <form className="modal" onSubmit={handleSubmit}>
      <div className="modal-content">
        <h2>{heading}</h2>
        <div className="flex flex-col gap-y-3">
          <input
            type="text"
            placeholder="Title"
            name='title'
            required
            value={linkItem.title}
            onChange={handleOnChange}
            minLength='3'
          />
          <input
            type="url"
            placeholder="URL"
            name='url'
            value={linkItem.url}
            onChange={handleOnChange}
          />
          <select value={linkItem.category} name='category' required onChange={handleOnChange} disabled={disableCategory}>
            <option value="">Select Category</option>
            <option value="mutual-fund">Mutual Fund</option>
            <option value="basic-forms">Basic Forms</option>
            <option value="most-common-links">Most Common Links</option>
          </select>
        </div>
        <div className="flex content-end my-3 gap-x-2">
        <button onClick={onClose} type='button' className='close modal-btn'>Close</button>
        <button type='submit' className='add modal-btn'>{actionButton}</button>

        </div>
      </div>
    </form>
  );
};

export default Modal;
