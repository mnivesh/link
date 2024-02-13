import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom';
import Searchbar from '../Root/Searchbar';
import '../../styles/DashboardStyle.css'
import UserItem from '../Root/UserItem';
import UserModal from '../Root/UserModal';
import SuccessAlert from '../Root/SuccessAlert';
import PasswordModal from '../Root/PasswordModal';
import { FaUser } from "react-icons/fa";
import LoadingPage from '../Root/LoadingPage';

function Dashboard() {
  const [adminList, setAdminList] = useState([])
  const [userList, setUserList] = useState([])
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('');
  const { user, loggedIn, loading, getUserList, originalAdminList, originalUserList, setOriginalAdminList, setOriginalUserList } = useAuth();

  // function to search users 
  const searchUser = (e) => {
    e.preventDefault();

    let searchTerm = e.target.value.toLowerCase().trim();
    setInputValue(searchTerm);

    if (searchTerm === '') {
      setAdminList(originalAdminList);
      setUserList(originalUserList)
      return;
    }

    setAdminList(
      originalAdminList.filter(item => (
        item.email.toLowerCase().includes(searchTerm)
      )
    ))

    setUserList(
      originalUserList.filter(item => (
        item.email.toLowerCase().includes(searchTerm)
      )
    ))

  }

  // function to get admins list 
  const getAdmins = async () => {
    const data = await getUserList('admin');
    setOriginalAdminList(data.users);
  }

  // function to get users list 
  const getUsers = async () => {
    const data = await getUserList('user');
    setOriginalUserList(data.users);
  }

  // function to update selected user 
  const updateSelectedUserId = (value) => {
    setSelectedUserId(value);
  }


  // effect to sync originalAdminList and adminList also originalUserList and userList 
  useEffect(() => {
    setAdminList(originalAdminList);
    setUserList(originalUserList);

  }, [originalAdminList, originalUserList])

  // effect to fetch users and admins list initially 
  useEffect(() => {
    if(loggedIn) {
      getAdmins();
      getUsers();
    }

    return () => {
      setUserList([])
      setAdminList([])
    }
  }, [loggedIn])
  

  return (
    loading ? <LoadingPage/> : user.role === 'admin' ? 
    <div className='dashboard'>
      <header className='flex items-center px-2'>
        <figure className='profile-pic'>
          <FaUser />
        </figure>
        <h1>Dashboard</h1>
      </header>
      <main className='flex flex-col gap-y-3'>
        <SuccessAlert />
        <PasswordModal isOpen={isPassModalOpen} onClose={() => setIsPassModalOpen(false)} selectedUserId={selectedUserId}/>
        <UserModal isOpen={isModalOpen} onClose={() => setisModalOpen(false)} heading={'Register User'} actionButton='Register' />
        <section className="flex px-2 main-header">
          <Searchbar inputValue={inputValue} changeInputValue={searchUser} placeholder='Search user'/>
          <button className='add-user-btn' onClick={() => setisModalOpen(true)}>Add user</button>
        </section>
        <section className='flex px-2 gap-x-3'>
          <div className='user-groups admins px-2'>
            <p className='header'>Admins</p>
            <ul className='flex flex-col'> {
              adminList?.map(user => (
                <UserItem key={user._id} data={user} updateSelectedUserId={updateSelectedUserId} setPassModal={setIsPassModalOpen}/>
              ))
            }
            </ul>
          </div>
          <div className='user-groups users px-2'>
            <p className='header'>Users</p>
            <ul className='flex flex-col'>{
            userList?.map(user => (
              <UserItem key={user._id} data={user} updateSelectedUserId={updateSelectedUserId} setPassModal={setIsPassModalOpen}/>
            ))
            }</ul>
          </div>
        </section>
      </main>
    </div> 
    : <Navigate to='/' replace /> 
  )
}

export default Dashboard