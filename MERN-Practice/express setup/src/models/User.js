//check dependencies
const mongoose = require('mongoose')
//define schema
const UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	password: String,
	email: String,
})
//export model
module.exports = mongoose.model('User', UserSchema)
