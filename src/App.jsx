import React, { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './Pages/Login/login'
import Chat from './Pages/chat/chat'
import Profile from './Pages/Profile/Profile'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { AppContext } from './Context/AppContext';

  

const App = () => {
    
  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext)

  useEffect(()=> {
    onAuthStateChanged(auth, async (user)=> {
      if (user) {
        navigate('/chat')
        await loadUserData(user.uid)
      }
      else {
        navigate('/')
      }
    })
  },[])

  return (
    <>
    <ToastContainer/>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/Chat' element={<Chat/>}/>
          <Route path='/profile' element={<Profile/>}/>
          
        </Routes>
    </>
  )
}

export default App
