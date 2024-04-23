//check dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes =require('./routes');
const path = require("path");

//init express app
const app = express();
const PORT = process.env.PORT || 8000

//init cors and express.json
app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

try {
	mongoose.connect(process.env.MONGO_DB_CONNECT, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	console.log('MongoDb connected successfully!')
} catch (error) {
	console.log(error)
}

//init /files urls
app.use("/files", express.static(path.resolve(__dirname, "..", "files")))
//init routes
app.use(routes);

//check if server is running
app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`)
})
