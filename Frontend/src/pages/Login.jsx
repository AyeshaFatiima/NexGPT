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
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            
            const data = await res.json();
            
            // 1. Pehle check karo ki response sahi hai ya nahi
            if (!res.ok) {
                throw data; // Agar error hai toh catch block mein bhej do
            }

            // 2. Agar Response OK hai, tabhi token save karo aur navigate karo
            console.log("Login Success", data);
            
            // Check karein ki aapka backend 'token' naam se hi bhej raha hai na?
            if(data.token) {
                localStorage.setItem("token", data.token);
                toast.success('k, Ayesha! Login Successful.'); // Success Message
            }
            
            navigate("/chat");
            
        } catch (err) {
            console.log("Error Details:", err);
            // Agar backend se message aa raha hai toh wahi dikhao
           toast.error(err.message || 'Login Failed. Please check your credentials.');
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Login</h2>
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
