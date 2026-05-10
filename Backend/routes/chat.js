import express from "express";
import Thread from "../models/Thread.js"; 
import getOpenAPIResponse from "../utils/openai.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const getAuthenticatedUserId = (req) => {
    return req.user?.id || req.user?._id || req.user?.userId || req.user?.sub;
};

router.post("/chat", auth, async (req, res) => {
    const { threadId, message } = req.body; 

    if (!threadId || !message) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    try {
        const userId = getAuthenticatedUserId(req);

        if (!userId) {
            console.error("Auth Error: User ID missing in req.user", req.user);
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        let thread = await Thread.findOne({ threadId: threadId, user: userId });

        if (!thread) {
            thread = new Thread({
                user: userId, 
                threadId,
                title: message.length > 30 ? message.substring(0, 30) + "..." : message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAPIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = Date.now();

        await thread.save();
        res.json({ reply: assistantReply });

    } catch (err) {
        console.error("Chat Backend Error Details:", err);
        res.status(500).json({ 
            message: "Failed to process chat", 
            error: err.message 
        });
    }
});

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
