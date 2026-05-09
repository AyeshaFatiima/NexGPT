import { useNavigate } from "react-router-dom";
import "./Home.css";

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <div className="logo-section">
                    <div className="app-icon">
                        <i className="fa-solid fa-comment-dots"></i>
                    </div>
                    <h1>Welcome to NexGPT</h1>
                </div>
                
                <p className="tagline">
                    Start a chat, explore an idea, or ask a question. 
                    Your AI companion for smart city management and beyond.
                </p>

                <div className="action-buttons">
                    <button className="btn-primary" onClick={() => navigate("/login")}>
                        Get Started
                    </button>
                    <button className="btn-secondary" onClick={() => navigate("/signup")}>
                        Create Account
                    </button>
                </div>

                <div className="welcome-footer">
                    <p>Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
