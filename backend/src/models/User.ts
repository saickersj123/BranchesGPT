import mongoose from "mongoose";
import conversationSchema from "./Conversation.js";
import modelSchema from "./CustomModel.js"
import chatboxSchema from "./Chatbox.js"

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
    CustomModels: [modelSchema],
    ChatBox: [chatboxSchema],
});

export default mongoose.model("User", userSchema);