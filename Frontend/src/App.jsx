import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ToastContainer from "./ToastContainer.jsx";
// import Welcome from "./pages/Welcome.jsx"; // Welcome page import karein
import "./App.css";
import { v1 as uuidv1 } from "uuid";

// 1. Protected Route: Agar token nahi hai toh Login bhej do
const ChatPage = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="main">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

// 2. Public Route Helper: Agar token HAI toh seedha Chat bhej do (Login/Signup nahi dikhana)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/chat" replace /> : children;
};

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

  return (
    <MyContext.Provider value={providerValue}>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Landing/Welcome Page */}
          <Route path="/" element={<Login />} />

          {/* Login & Signup (Public only) */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          
          {/* Chat (Protected only) */}
          <Route path="/chat" element={<ChatPage />} />
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </MyContext.Provider>
  );
}

export default App;
