import "./Chat.css";
import { useContext, useEffect, useRef } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat({loading}){
  const {newChat, prevChats}=useContext(MyContext);
  const chatEndRef = useRef(null);
  
  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, loading]);

  if(!prevChats?.length) {
    return (
      <div className="chats emptyChats">
        <div className="emptyState">
          <span className="emptyIcon"><i className="fa-solid fa-comment-dots"></i></span>
          <h1>{newChat ? "Start a new chat" : "No messages yet"}</h1>
          <p>Ask a question, explore an idea, or paste something you want NexGPT to help with.</p>
        </div>
        <div ref={chatEndRef} />
      </div>
    );
  }

  return(
            <div className="chats">
                {
                    prevChats?.map((chat, idx) => 
                        <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user"? 
                                <p className="userMessage">{chat.content}</p> : 
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }
                <div ref={chatEndRef} />
            </div>
  )
}

export default Chat;
