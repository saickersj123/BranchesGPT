const mongoose = require('mongoose')

//define EventSchema
//req.body structure: Multipart Form
const EventSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    toJSON: {
        virtuals: true
    }
});

//get image from /files url
EventSchema.virtual("thumbnail_url").get(function () { return `http://localhost:8000/files/${this.thumbnail}` })
//export EventSchema
module.exports = mongoose.model('Event', EventSchema)
