import "./Sidebar.css";
import {useCallback, useContext, useEffect} from "react";
import {MyContext} from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar(){
const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, isSidebarOpen, setIsSidebarOpen}=useContext(MyContext)

const getAllThreads=useCallback(async()=>{
  try{
    const response=await fetch("http://localhost:8080/api/threads");
    const res=await response.json();
    const filteredData=res.map(thread => ({threadId: thread.threadId, title: thread.title}));
    setAllThreads(filteredData);
    console.log(filteredData);
  }
  catch(error){
    console.log(error);
  }
}, [setAllThreads]);

useEffect(()=>{
  getAllThreads();
},[currThreadId, getAllThreads]) 

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
    const response=await fetch(`http://localhost:8080/api/thread/${threadId}`);
    const res=await response.json();
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
  const response=await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"DELETE"})
  const res=await response.json();
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

        {/* Responsive navigation drawer with shared desktop/mobile behavior. */}
        <section className={`sidebar ${isSidebarOpen ? "open" : ""}`} aria-label="Chat history">
            <div className="sidebarHeader">
                <div className="brandMark" aria-hidden="true"><img src="public/gpt.png" alt="NexGPT Logo" className="brandLogo" /></div>
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
