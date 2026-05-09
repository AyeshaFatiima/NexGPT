import express from "express";
import Thread from "../models/Thread.js"; 
import getOpenAPIResponse from "../utils/openai.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const getAuthenticatedUserId = (req) => {
    return req.user?.id || req.user?._id || req.user?.userId || req.user?.sub;
};

// Main Chat Route
router.post("/chat", auth, async (req, res) => {
    const { threadId, message } = req.body; 

    // 1. Basic Validation
    if (!threadId || !message) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    try {
        // 2. Token se User ID nikalna (Payload check)
        // JWT sign karte waqt jo key use ki thi (id ya _id), wahi yahan milegi
        const userId = getAuthenticatedUserId(req);

        if (!userId) {
            console.error("Auth Error: User ID missing in req.user", req.user);
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        // 3. Find thread only if it belongs to THIS logged-in user
        let thread = await Thread.findOne({ threadId: threadId, user: userId });

        if (!thread) {
            // Naya thread banate waqt 'user' field dena compulsory hai
            thread = new Thread({
                user: userId, 
                threadId,
                title: message.length > 30 ? message.substring(0, 30) + "..." : message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            // Purane thread mein naya message push karna
            thread.messages.push({ role: "user", content: message });
        }

        // 4. Get AI Response
        const assistantReply = await getOpenAPIResponse(message);

        // 5. Update thread with AI response and timestamp
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = Date.now();

        // 6. Final Save
        await thread.save();
        res.json({ reply: assistantReply });

    } catch (err) {
        // Console mein error print hogi taaki aap check kar sako exactly kya fata
        console.error("Chat Backend Error Details:", err);
        res.status(500).json({ 
            message: "Failed to process chat", 
            error: err.message 
        });
    }
});

// Get All Threads (Sirf logged-in user ke threads fetch karne ke liye)
router.get("/threads", auth, async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        let threads = await Thread.find({ user: userId }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Thread by ID for logged-in user
router.get("/thread/:threadid", auth, async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const thread = await Thread.findOne({
            threadId: req.params.threadid,
            user: userId
        });

        if (!thread) {
            return res.status(404).json({ message: "Thread not found" });
        }

        res.json(thread);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch thread", error: err.message });
    }
});

// Delete Thread by ID for logged-in user
router.delete("/thread/:threadid", auth, async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const deletedThread = await Thread.findOneAndDelete({
            threadId: req.params.threadid,
            user: userId
        });

        if (!deletedThread) {
            return res.status(404).json({ message: "Thread not found" });
        }

        res.json({ message: "Thread deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete thread", error: err.message });
    }
});

export default router;
