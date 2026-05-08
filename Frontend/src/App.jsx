import React, { useEffect, useState } from "react";
// 1. BrowserRouter ko as Router import kiya
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import Signup from "./pages/Signup.jsx";
// 2. Login import kiya (Agar file nahi hai toh niche wala temporary component chalega)
import "./App.css";
import { v1 as uuidv1 } from "uuid";

// Temporary Login component taaki error na aaye jab tak aap Login.jsx na bana lo
const Login = () => (
  <div style={{ 
    height: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    color: "white", 
    background: "#1a1a1a" 
  }}>
    <h1>Login Page (Under Construction)</h1>
    <p style={{marginLeft: '10px'}}>Go to <a href="/signup" style={{color: '#ff4b2b'}}>Signup</a></p>
  </div>
);

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", isSidebarOpen);
    return () => document.body.classList.remove("sidebar-open");
  }, [isSidebarOpen]);

  const providerValue = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    isSidebarOpen, setIsSidebarOpen
  };

  // Chat Page Component
  const ChatPage = () => (
    <div className="main">
      <Sidebar />
      <ChatWindow />
    </div>
  );

  return (
    <MyContext.Provider value={providerValue}>
      <Router>
        <Routes>
          {/* Default Route: Login */}
          <Route path="/" element={<Login />} />
          
          {/* Signup Route */}
          <Route path="/signup" element={<Signup />} />
          
          {/* Chat Route (Protected logic baad mein add karenge) */}
          <Route path="/chat" element={<ChatPage />} />
          
          {/* Catch-all: Redirect to Login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </MyContext.Provider>
  );
}

export default App;