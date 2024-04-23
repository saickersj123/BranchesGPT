//check dependencies
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
//const RegController = require('./controllers/RegController')
const UserController = require('./controllers/UserController')

//init express app and PORT
const app = express()
const PORT = process.env.PORT || 8000

//use cors() and express.json()
app.use(cors())
app.use(express.json())

//check dotenv for mongodb
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

//handling get request by '/'
app.get('/', (req, res) => {
	res.send('Hello from Node.js app / \n')
})
//handling get request by '/register'
app.get('/register', (req, res) => {
	res.send('Welcome to Register \n')
})
//handling post request by '/register'
app.post('/register', UserController.store)
//connect to mongodb
try {
	mongoose.connect(process.env.MONGO_DB_CONNECT, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	console.log('MongoDb connected successfully!')
} catch (error) {
	console.log(error)
}
//connection status
app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`)
})

