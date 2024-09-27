import React, { useContext, useEffect, useState } from "react";
import "./Leftsidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";

const Leftsidebar = () => {
  const navigate = useNavigate();
  const { userData,chatData, chatUser,setChatUser,setMessagesId, messagesId , chatVisible,setChatVisible } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setShowSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
            let userExist = false
            chatData.map((user) =>{
                if (user.rId === querySnap.docs[0].data().id) {
                    userExist = true;
                }
            })
            if (!userExist){
                setUser(querySnap.docs[0].data());
            }
        }
        else{
            setUser(null);
        }
      }
      else{
        setShowSearch(false);
      }
    } catch (error) {

    }
  }

  const addChat = async () => {
    const messagesRef = collection(db,"messages");
    const chatsRef = collection(db,"chats");
    try {
        const newMessagesRef = doc(messagesRef);
        await setDoc(newMessagesRef,{
            createAt:serverTimestamp(),
            messages:[]
        })

        await updateDoc(doc(chatsRef,user.id),{
            chatsData:arrayUnion({
                messagesId:newMessagesRef.id,
                lastMessages:"",
                rId:userData.id,
                updateAt:Date.now(),
                messagesSeen:true
            })
        })

        await updateDoc(doc(chatsRef,userData.id),{
            chatsData:arrayUnion({
                messagesId:newMessagesRef.id,
                lastMessages:"",
                rId:user.id,
                updateAt:Date.now(),
                messagesSeen:true
            })
        })


        const uSnap =await getDoc(doc(db,"users",user.id));
        const uData = uSnap.data();
        setChat({
          messagesId:newMessages.id,
          lastMessages:"",
          rId:user.id,
          updatedAt:Date.now(),
          messagesSeen:true,
          userData:uData
        })
        setShowSearch(false)
        setChatVisible(true)

    } catch (error) {
        toast.error(error.meesage);
        console.error(error)
    }
  }
 const setChat = async (item)=>{
  try {
    setMessagesId(item.messagesId);
    setChatUser(item)
    const userChatsRef = doc(db, 'chats'. userData.id);
    const userChatsSnapshot = await getDoc(userChatsRef);
    const userChatsData = userChatsSnapshot.data();
    const chatIndex = userChatsData.chatsData.findIndex((c)=>c.messagesId===item.messagesId);
    userChatsData.chatsData[chatIndex].messagesSeen = true;
    await updateDoc(userChatsRef,{
      chatsData: userChatsData.chatsData
    })
    setChatVisible(true);
  } catch (error) {
    toast.error(error.message)
  }
    
 }

 useEffect(()=>{
  
  const updateChatUserData = async () => {

    if (chatUser) {
      const userRef = doc(db,"users", chatUser.userData.id);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setChatUser(prev=>({...prev,userData:userData}))
    }
  }
  updateChatUserData();

 },[chatData])

  return (
    <div className={`ls ${chatVisible? "hidden": ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here.."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user
        ? <div onClick={addChat} className='friends add-user'>
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
        </div>
        :chatData.map((item, index) => (
          <div onClick={()=>setChat(item)} key={index} className={`friends ${item.messagesSeen || item.messagesId === messagesId ?  "" : "border"}`}>
            <img src={item.userData.avatar} alt="" />
            <div>
              <p>{item.userData.name}</p>
              <span>{item.lastMessages}</span>
            </div>
          </div>
        ))
        }
        
      </div>
    </div>
  );
};

export default Leftsidebar;
