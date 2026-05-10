import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    threadId: {
        type: String,
        default: Date.now
    },
});

const ThreadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    threadId: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        default: "New Chat"
    },
    messages: {
        type: [MessageSchema],
        default: []
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Thread", ThreadSchema);