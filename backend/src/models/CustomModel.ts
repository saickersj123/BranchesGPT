import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";

const modelSchema = new mongoose.Schema({
    modelId: {
        type: String,
        default: randomUUID(),
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