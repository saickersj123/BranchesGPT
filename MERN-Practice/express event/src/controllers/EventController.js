//check dependencies
const Event = require('../models/Event');
const User = require('../models/User');

//export functions
module.exports = {
    //create event
    async createEvent(req, res) {
        const { title, description, price } = req.body;
        console.log(req.headers)
        const { user_id } = req.headers;
        const { filename } = req.file;

        const user = await User.findById(user_id)
        const eventexist = await Event.findOne({ title })

        if (!user) {
            return res.status(400).json({ message: 'User does not exist!' })
        }
        if (!eventexist) {
        const event = await Event.create({
            title,
            description,
            price: parseFloat(price),
            user: user_id,
            thumbnail: filename
        })

        return res.json(event);
        }
            return res.status(400).json({ message: 'Event already exist!' })
    },
    //get event by id
    async getEventById(req, res) {
        const { eventId } = req.params;
        try {
            const event = await Event.findById(eventId)

            if (event) {
                return res.json(event)
            }
        } catch (error) {
            return res.status(400).json({ message: 'EventId does not exist!' })
        }
    }
}