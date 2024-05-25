const mongoose = require('mongoose')
const chatSchema = require ('./Chat')

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
	chats: [chatSchema]
})

module.exports = mongoose.model('User', userSchema)
