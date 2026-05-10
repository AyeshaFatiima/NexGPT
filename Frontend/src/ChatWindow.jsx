import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "./toastStore.js";

function ChatWindow() {
  const { 
    prompt, setPrompt, 
    setReply, currThreadId, 
    setPrevChats, setNewChat, 
    setIsSidebarOpen, setAllThreads 
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const menuRef = useRef(null);
  const chatEndRef = useRef(null); // Scroll ke liye ref

  // 1. Auto-scroll function
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Jab bhi loading state change ho, niche scroll karein
  useEffect(() => {
    scrollToBottom();
  }, [loading]);

  const handleLogout = useCallback((showToast = true) => {
    localStorage.removeItem("token");
    if (showToast) {
      toast.success("Logged out successfully");
    }
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getReply = async () => {
    if (!prompt.trim() || loading) return;

    const currentPrompt = prompt;
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Session expired. Please login again.");
      handleLogout(false);
      return;
    }

    setPrompt("");
    setLoading(true);
    setNewChat(false);
    
    // User message turant UI mein dikhane ke liye
    setPrevChats(prevChats => [
      ...prevChats,
      { role: "user", content: currentPrompt }
    ]);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        message: currentPrompt,
        threadId: currThreadId
      })
    };

    try {
      const response = await fetch("https://nexgpt.onrender.com/api/chat", options);
      const res = await response.json();

      if (response.status === 401) {
        toast.error("Unauthorized access");
        setPrevChats(prevChats => prevChats.slice(0, -1));
        handleLogout(false);
        return;
      }

      if (!response.ok) {
        throw new Error(res.error || res.message || "Failed to get reply");
      }

      // Assistant message add karna
      setReply(res.reply);
      setPrevChats(prevChats => [
        ...prevChats,
        { role: "assistant", content: res.reply }
      ]);

      // Sidebar mein thread update karna
      setAllThreads(prevThreads => {
        if (prevThreads.some(thread => thread.threadId === currThreadId)) {
          return prevThreads;
        }
        const title = currentPrompt.length > 30 ? `${currentPrompt.substring(0, 30)}...` : currentPrompt;
        return [{ threadId: currThreadId, title }, ...prevThreads];
      });

    } catch (err) {
      console.error("Chat Error:", err);
      // Agar error aaye toh user ka message remove kar sakte hain ya error dikha sakte hain
      setPrevChats(prevChats => prevChats.slice(0, -1));
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => setIsOpen(!isOpen);

  return (
    <div className="chatWindow">
      <div className="navbar">
          <div className="navLeft">
              <button className="menuButton" onClick={() => setIsSidebarOpen(true)}>
                  <i className="fa-solid fa-bars"></i>
              </button>
              <span>NexGPT <i className="fa-solid fa-chevron-down"></i></span>
          </div>

          <div className="userMenuWrapper" ref={menuRef} style={{ position: "relative" }}>
              <div className="userIconDiv" onClick={handleProfileClick}>
                  <span className="userIcon"><i className="fa-solid fa-user"></i></span>
              </div>

              {isOpen && (
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>
                </div>
              )}
          </div>
      </div>

      <main className="chatBody">
          <Chat loading={loading} />
          {loading && (
            <div className="typing-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          )}
          {/* Scroll Target */}
          <div ref={chatEndRef} />
      </main>

      <div className="chatInput">
          <div className="inputBox">
              <textarea 
                placeholder={loading ? "Thinking..." : "Ask anything"}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        getReply();
                    }
                }} 
              />
              <button className="sendButton" onClick={getReply} disabled={loading || !prompt.trim()}>
                  <i className="fa-solid fa-paper-plane"></i> 
              </button> 
          </div>
          <p className="info">
              NexGPT can make mistakes. Check important info.
          </p>
      </div>
    </div>
  );
}

export default ChatWindow;
