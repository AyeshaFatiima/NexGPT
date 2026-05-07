import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import { MyContext } from './MyContext.jsx'
import "./App.css"
import {useEffect, useState} from "react";
import {v1 as uuidv1} from "uuid";
 

function App() {
  const [prompt,setPrompt]=useState("");
  const [reply,setReply]=useState("");
  const [currThreadId,setCurrThreadId]=useState(uuidv1());
  const [prevChats,setPrevChats]=useState([]);
  const[newChat,setNewChat]=useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lock background scrolling while the mobile drawer is open.
  useEffect(() => {
    document.body.classList.toggle("sidebar-open", isSidebarOpen);
    return () => document.body.classList.remove("sidebar-open");
  }, [isSidebarOpen]);

 const providerValue = {
  prompt,setPrompt,
  reply,setReply, 
  currThreadId,setCurrThreadId,
  newChat,setNewChat,
  prevChats,setPrevChats,
  allThreads,setAllThreads,
  isSidebarOpen,setIsSidebarOpen
 };

  return (
    <div className="main"> 
    <MyContext.Provider value={providerValue}>
      <Sidebar></Sidebar> 
      <ChatWindow></ChatWindow>
    </MyContext.Provider>
      </div>
  )
}

export default App
