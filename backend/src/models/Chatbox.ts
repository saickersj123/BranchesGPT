import mongoose from "mongoose";

const chatboxSchema = new mongoose.Schema({
	cbox_x: {
		type: Number,
		required: true,
	},
	cbox_y: {
		type: Number,
		required: true,
	},
    cbox_w: {
		type: Number,
		required: true,
	},
    cbox_h: {
		type: Number,
		required: true,
	},

});

export default chatboxSchema;