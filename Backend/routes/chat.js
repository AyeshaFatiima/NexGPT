import express from "express";
import Thread from "../models/Thread.js"; 
import getOpenAPIResponse from "../utils/openai.js";

const router = express.Router();

// Test Route
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing New Thread"
        });
        const response = await thread.save();
        res.status(201).send(response);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create thread", error: err.message });
    }
});

// Create New Thread
router.post("/thread", async(req, res) => {
    try {
        const { threadId, title } = req.body;
        let newThread = new Thread({
            threadId,
            title
        });
        let response = await newThread.save();
        res.status(201).json(response);
    } catch(err) {
        console.error("Error creating thread:", err);
        res.status(500).json({ message: "Failed to create thread", error: err.message });
    }
});

// Get All Threads
router.get("/threads", async (req, res) => {
    try {
        let threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Thread by ID
router.get("/thread/:threadid", async (req, res) => {
    try {
        const thread = await Thread.findOne({ threadId: req.params.threadid });
        if (!thread) {
            return res.status(404).json({ message: "Thread not found" });
        }
        res.json(thread); 
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete Thread
router.delete("/thread/:threadid", async (req, res) => {
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId: req.params.threadid });
        if (!deletedThread) {
            return res.status(404).json({ message: "Thread not found" });
        }
        res.json({ message: "Thread deleted successfully" });
    } catch(err) {
        res.status(500).json({ error: "Failed to delete thread" });
    }
});

// Main Chat Route
router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    // 1. Validation check
    if (!threadId || !message) {
        return res.status(400).json({ message: "Invalid request body" });
    }

    try {
        // 2. Find or Create thread (let used to allow reassignment)
        let thread = await Thread.findOne({ threadId: threadId });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message.length > 30 ? message.substring(0, 30) + "..." : message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // 3. Get AI Response
        const assistantReply = await getOpenAPIResponse(message);

        // 4. Update thread with AI response and timestamp
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = Date.now();

        await thread.save();
        res.json({ reply: assistantReply });

    } catch (err) {
        console.error("Chat Error:", err);
        res.status(500).json({ error: "Failed to process chat" });
    }
});

export default router;