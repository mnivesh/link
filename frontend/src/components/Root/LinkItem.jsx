import React from 'react'
import { Link } from 'react-router-dom';
import { FaEllipsisVertical } from "react-icons/fa6";
import Dropdown from './Dropdown';
import { useLink } from '../../context/LinkContext';

function LinkItem({data, updateSelectedLink, setModalConfig, isAdmin}) {
  const { deleteLink, linksArray, setLinksArray, setAlertState } = useLink();

  const openUpdateModal = () => {
    updateSelectedLink(data);
    setModalConfig({
      open: true,
      heading: 'Update link',
      action: 'update',
      actionButton: 'Update',
      disableCategory: true
    })
  }

  const handleDelete = async () => {
    // const confirmDeletion = window.confirm('Are you sure?');
    const confirmDeletion = window.confirm('Are you sure? \nClick OK to delete');
    if(!confirmDeletion) {
      return;
    }

    // make delete request 
    const response = await deleteLink(data._id);
    const jsonData = await response.json();
    
    if(!response.ok) {
      alert(jsonData.error);
    }

    const updatedLinks = linksArray.filter(link => link._id !== data._id);
    setLinksArray(updatedLinks);
    setAlertState({isOn: true, message: jsonData.message})
  }

  return (
    <li className="link-item">
      <div className="flex">

        <Link className="link "
          to={data.url} target='_blank'>
          {data.title}
        </Link>

        {isAdmin && <Dropdown toggleButton={<span><FaEllipsisVertical /></span>}>
          <div className='w-max'>
            <ul className="py-2 text-start" role="none">
              <li><button className='update' role="menuitem" tabIndex="-1" onClick={openUpdateModal}>Update</button></li>
              <li><button className='delete' role="menuitem" tabIndex="-1" onClick={handleDelete}>Delete</button></li>
            </ul>
          </div>
        </Dropdown>}

      </div>
    </li>
  )
}

export default LinkItem