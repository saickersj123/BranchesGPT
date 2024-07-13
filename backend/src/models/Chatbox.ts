import mongoose from "mongoose";
import { randomUUID } from "crypto";

const chatboxSchema = new mongoose.Schema({
	id: {
		type: String,
		default: randomUUID(),
	},
	cbox_x: {
		type: Number,
	},
	cbox_y: {
		type: Number,
	},
    cbox_w: {
		type: Number,
	},
    cbox_h: {
		type: Number,
	},
	createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
},
{timestamps: true},
);

export default chatboxSchema;