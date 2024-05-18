const mongoose = require('mongoose')
import { randomUUID } from "crypto"

const chatSchema = new mongoose.Schema({
	id: {
		type: String,
		default: randomUUID(),
	},
	role: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	}
})

module.exports = mongoose.model('Chat', chatSchema)