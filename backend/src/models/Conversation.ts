import mongoose from "mongoose";
import chatSchema from "./Chat.js";

const conversationSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => new mongoose.Types.ObjectId(),
    },
    chats: [chatSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default conversationSchema;
