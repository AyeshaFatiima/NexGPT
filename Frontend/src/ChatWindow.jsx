import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import{MyContext} from "./MyContext.jsx";
import {useContext, useState} from "react";
import {ScaleLoader} from "react-spinners"; 

function ChatWindow(){
  const {prompt, setPrompt, setReply,currThreadId,setPrevChats, setNewChat, setIsSidebarOpen}=useContext(MyContext);
  const [loading,setLoading]=useState(false);
  const [isOpen, setIsOpen]=useState(false);

const getReply=async ()=>{
  if(!prompt.trim() || loading) return;
  const currentPrompt = prompt;
  setPrompt("");
  setLoading(true);
  setNewChat(false);
  console.log("message",currentPrompt,"threadId",currThreadId); 
  const options={    
method:"POST",
headers:{
  "Content-Type":"application/json",
},
body:JSON.stringify({
 message:currentPrompt,
 threadId:currThreadId
  })
};

try{
  const response=await fetch("http://localhost:8080/api/chat",options);
  const res=await response.json();  
  console.log("reply",res);
  setReply(res.reply);
  
  setPrevChats(prevChats=>{
    return [...prevChats,{
      role:"user",
      content:currentPrompt},{
        role:"assistant",
        content:res.reply
      }]
    }) 

}catch(err){ 
  console.log(err);
}
  setLoading(false);
  }

  const handleProfileClick=()=>{
    setIsOpen(!isOpen);
  } 

  return(
    <div className="chatWindow">
            <div className="navbar">
                <div className="navLeft">
                    <button className="menuButton" onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <span>NexGPT <i className="fa-solid fa-chevron-down"></i></span>
                </div>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            <main className="chatBody">
                <Chat loading={loading}></Chat>
                {loading && (
  <div className="typing-dots">
    <span>.</span><span>.</span><span>.</span>
  </div>
)}
            </main> 
            
            <div className="chatInput">
                <div className="inputBox">
                    <textarea placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                getReply();
                            }
                        }} 
                        rows="1"
                    />
                    <button id="submit" onClick={getReply} disabled={loading || !prompt.trim()} aria-label="Send message">
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
                <p className="info">
                    NexGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
  )
}

export default ChatWindow; 
