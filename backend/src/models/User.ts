import mongoose from "mongoose";
import conversationSchema from "./Conversation.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    conversations: [conversationSchema],
});

export default mongoose.model("User", userSchema);