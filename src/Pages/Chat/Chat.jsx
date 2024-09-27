import React, { useContext, useEffect, useState } from 'react'
import './Chat.css';
import Leftsidebar from '../../Components/Leftsidebar/Leftsidebar';
import ChatBox from '../../Components/ChatBox/ChatBox';
import Rightsidebar from '../../Components/Rightsidebar/Rightsidebar';
import { AppContext } from '../../Context/AppContext';
const Chat = () => {

  const {chatData,userData} = useContext(AppContext);
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    if (chatData && userData) {
      setLoading(false)
    }
  },[chatData,userData])

  return (
    <div className='chat'>
      {
        loading
        ?<p className='loading'>Loading...</p>
        : <div className="chat-container">
        <Leftsidebar/>
        <ChatBox/>
        <Rightsidebar/>
      </div>
      }
      
    </div>
  )
}

export default Chat

