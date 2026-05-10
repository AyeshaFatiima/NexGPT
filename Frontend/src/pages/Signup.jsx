import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import "./Signup.css"; 
import toast from "../toastStore.js";

const Signup = () => {
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
            const userData = { username, email, password };
            const res = await fetch("https://nexgpt.onrender.com/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw data;
            }
            if (data.token) {
                localStorage.setItem("token", data.token);
                toast.success('Account created successfully! Welcome, ' + username + '!');
            }
            
            console.log("Signup Success", data);
            navigate("/chat");      
        } catch (err) {
            console.log("Error:", err);
            toast.error(err.message || 'Signup Failed. Please try again.');
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Welcome to NexGPT!</h2>
                <form onSubmit={submitHandler} style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={usernameHandler} 
                        required
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={emailHandler} 
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={passwordHandler} 
                        required
                    />
                    <button type="submit" className="auth-btn">Sign Up</button> 
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/" className="auth-link">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
