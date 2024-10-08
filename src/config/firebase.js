
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_Gsp-6K0xfFcTH1vH_FNnloGNoYi0lPA",
  authDomain: "chat-app-gs-10311.firebaseapp.com",
  projectId: "chat-app-gs-10311",
  storageBucket: "chat-app-gs-10311.appspot.com",
  messagingSenderId: "930878098718",
  appId: "1:930878098718:web:0d378a2d2ffa833cc0cd0f"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const signup = async (username,email,password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth,email,password);
    // const user = res.user;
    await setDoc(doc(db, "users",user.uid),{
      id:user.uid,
      username:username.toLowerCase(),
      email,
      name:"",
      avatar:"",
      bio:"Hey, There i am using chat app",
      lastSeen:Date.now()
    })
    await setDoc(doc(db,"chats",user.uid),{
      chatsData:[]
    })
  } catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}
const login = async (email,password) => {
  try {
       await signInWithEmailAndPassword(auth,email,password);
      
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const resetPass = async (email) =>{
  if (!email) {
    toast.error("Enter your email");
    return null;
  }
  try {
    const userRef = collection(db,'users');
    const q = query(userRef,where("email","==",email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset Email Sent")
    }
    else{
      toast.error("Email doesn't exists")
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message)
  }
}

export {signup,login,logout,auth,db,resetPass}