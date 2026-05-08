import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Link yahan add kiya
import "./Signup.css"; // CSS file link karna zaroori hai!

const Signup = () => { // Capital S
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    
    const emailHandler = (e) => setEmail(e.target.value);
    const passwordHandler = (e) => setPassword(e.target.value);
    const usernameHandler = (e) => setUsername(e.target.value);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // username: username bhejna hai (kyuki state ka naam username hai)
            const res = await axios.post("http://localhost:8080/api/auth/signup", {
                username, 
                email, 
                password
            });
            
            console.log("Signup Success", res.data);
            navigate("/chat");
        } catch (err) {
            console.log("Error:", err.response?.data || err.message); 
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create Account</h2>
                <input type="text" placeholder="Username" value={username} onChange={usernameHandler}/>
                <input type="email" placeholder="Email" value={email} onChange={emailHandler}/>
                <input type="password" placeholder="Password" value={password} onChange={passwordHandler}/>
                <button onClick={submitHandler}>Sign Up</button> 
                <p>Already have an account? <Link to="/">Login</Link></p>
            </div>
        </div>
    );
}

export default Signup;