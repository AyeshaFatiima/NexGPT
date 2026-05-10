import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import mongoose from "mongoose";
import dns from "dns";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import auth from "./middleware/auth.js";

dotenv.config(); 

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const PORT = process.env.PORT || 8080; 

app.use(express.json());
app.use(cors()); 

app.use("/api/auth", authRoutes);

app.get("/api/history", auth, (req, res) => {
    res.json({ message: "This is protected data", user: req.user });
});

app.use("/api", chatRoutes);

app.post("/test", async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8080",
            "X-Title": "NexGpt Project" 
        },
        body: JSON.stringify({
            "model": "openai/gpt-4o-mini",
            "messages": [
                { "role": "user", "content": req.body.message || "Hello" }
            ]
        })
    };

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        res.json({
            reply: data.choices[0].message.content,
            raw: data 
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to fetch from OpenRouter" });
        }
    }
});

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); 
        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1); 
    }     
}

startServer();