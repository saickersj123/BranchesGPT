import mongoose, { Schema } from "mongoose";
import conversationSchema from "./Conversation.js";

const modelSchema = new mongoose.Schema({
    modelId: {
        type: String,
        required: true,
    },
    modelName: {
        type: String,
        required: true,
    },
    modelData: {
        type: Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, 
{timestamps: true});

export default modelSchema;