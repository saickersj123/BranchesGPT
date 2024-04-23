//check dependencies
const express = require('express')
const multer = require('multer')

const UserController = require('./controllers/UserController')
const EventController = require('./controllers/EventController')
const uploadConfig = require('./config/upload')

const routes = express.Router();
const upload = multer(uploadConfig);

//handle get request by '/status'
routes.get('/status', (req, res) => {
    res.send({ status: 200 })
})
//handle get request by '/'
routes.get('/', (req, res) => {
    res.send('Hello from Node.js app\n')
})

//Event
routes.get('/event/:eventId', EventController.getEventById)
routes.post('/event', upload.single("thumbnail"), EventController.createEvent)


//User
routes.post('/user/register', UserController.createUser)
routes.get('/user/:userId', UserController.getUserById)

//exporting routes
module.exports = routes;