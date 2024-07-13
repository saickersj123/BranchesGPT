import mongoose from "mongoose";

const chatboxSchema = new mongoose.Schema({
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