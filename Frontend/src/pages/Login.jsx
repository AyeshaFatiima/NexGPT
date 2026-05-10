import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import "./Login.css"; 
import toast from "../toastStore.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const emailHandler = (e) => setEmail(e.target.value);
    const passwordHandler = (e) => setPassword(e.target.value);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const userData = { email, password };
            const res = await fetch("https://nexgpt.onrender.com/api/auth/login", {
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
            console.log("Login Success", data);
            
            if(data.token) {
                localStorage.setItem("token", data.token);
                toast.success('Welcome back, Login Successful.');
            }
            
            navigate("/chat");
            
        } catch (err) {
            console.log("Error Details:", err);
           toast.error(err.message || 'Login Failed. Please check your credentials.');
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Welcome Back!</h2>
                <form onSubmit={submitHandler} style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '15px'}}>
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
                    <button type="submit" className="auth-btn">Login</button> 
                </form>
                <p className="auth-footer">
                    Don't have an account? <Link to="/signup" className="auth-link">Signup</Link>
                </p>
            </div> 
        </div>
    )
}

export default Login;
