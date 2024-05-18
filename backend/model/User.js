const mongoose = require('mongoose')
import chatSchema from "./chat-model.js";

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
	chats: [chatSchema],
})

module.exports = mongoose.model('User', userSchema)
