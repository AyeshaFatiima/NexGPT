import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import "./Signup.css"; 

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
            const res = await fetch("http://localhost:8080/api/auth/signup", {
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
            
            // Sabse important step: Token ko save karna
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            
            console.log("Signup Success", data);
            navigate("/chat");
        } catch (err) {
            console.log("Error:", err);
            alert(err.message || "Signup failed. Try again.");
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create Account</h2>
                {/* Form tag add kiya hai taaki Enter key se submit ho sake */}
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
