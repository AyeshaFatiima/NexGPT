import "./Sidebar.css";
import {useCallback, useContext, useEffect} from "react";
import {MyContext} from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";
import {useNavigate} from "react-router-dom";

function Sidebar(){
const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, isSidebarOpen, setIsSidebarOpen}=useContext(MyContext)
const navigate = useNavigate();

const handleUnauthorized = useCallback(() => {
  localStorage.removeItem("token");
  navigate("/login");
}, [navigate]);

const getAllThreads=useCallback(async()=>{
  try{
    const token = localStorage.getItem("token");
    const response=await fetch("https://nexgpt.onrender.com/api/threads", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const res=await response.json();
    if(response.status === 401 || res.error === "jwt expired"){
      handleUnauthorized();
      return;
    }
    if(!response.ok){
      console.error("API error:", res);
      return;
    }
    const filteredData=Array.isArray(res) ? res.map(thread => ({threadId: thread.threadId, title: thread.title})) : [];
    setAllThreads(filteredData);
    console.log(filteredData);
  }
  catch(error){ 
    console.log(error);
  }
}, [handleUnauthorized, setAllThreads]);

useEffect(()=>{
  getAllThreads();
},[getAllThreads])

const createNewChat=()=>{
  setNewChat(true);
  setPrompt("");
  setReply(null);
  setCurrThreadId(uuidv1());
  setPrevChats([]); 
  setIsSidebarOpen(false);
}

const changeThread=async(threadId)=>{
  setCurrThreadId(threadId);
  setIsSidebarOpen(false);

  try{
    const token = localStorage.getItem("token");
    const response=await fetch(`http://localhost:8080/api/thread/${threadId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const res=await response.json();
    if(response.status === 401 || res.error === "jwt expired"){
      handleUnauthorized();
      return;
    }
    if(!response.ok){
      console.error("API error:", res);
      return;
    }
    console.log(res);
    setPrevChats(res.messages || []);
    setNewChat(false);
    setReply(null);
  }catch(err){
    console.log(err);
  }
}

const deleteThread=async(threadId)=>{
try{
  const token = localStorage.getItem("token");
  const response=await fetch(`http://localhost:8080/api/thread/${threadId}`,{
    method:"DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  const res=await response.json();
  if(response.status === 401 || res.error === "jwt expired"){
    handleUnauthorized();
    return;
  }
  if(!response.ok){
    console.error("API error:", res);
    return;
  }
  console.log(res);
  setAllThreads(prev=>prev.filter(thread=>thread.threadId!==threadId));
  if(threadId===currThreadId){
    createNewChat();
  }
}catch(err){
  console.log(err);
}
}

  return(
    <>
        <div
            className={`sidebarOverlay ${isSidebarOpen ? "visible" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
        />

        <section className={`sidebar ${isSidebarOpen ? "open" : ""}`} aria-label="Chat history">
            <div className="sidebarHeader">
                <div className="brandMark" aria-hidden="true"><img src="/gpt.png" alt="NexGPT Logo" className="brandLogo" /></div>
                <div>
                    <p className="brandName">NexGPT</p>
                    <span className="brandMeta">AI workspace</span>
                </div>
                <button className="sidebarClose" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <button className="newChatBtn" onClick={createNewChat}>
                <i className="fa-solid fa-plus"></i>
                <span>New Chat</span>
            </button>

            <div className="historyLabel">Recent conversations</div>
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} 
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "}
                        >
                            <i className="fa-regular fa-message"></i>
                            <span className="threadTitle">{thread.title}</span>
                            <button className="deleteThreadBtn"
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    deleteThread(thread.threadId);
                                }}
                                aria-label={`Delete ${thread.title}`}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </li>
                    ))
                }
            </ul>
 
            <div className="sign">
                <p>By Ayesha Fatima &hearts;</p>
            </div>
        </section>
    </>
  )
}

export default Sidebar;
