const mongoose = require('mongoose')

const Schema = mongoose.Schema
const bookSchema = new Schema({
    movieName: {
        type: String,
        required: true
    },
    screenName: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
         required: true,
    },
    seatNumber: {
        type: Array,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true 
    }
},
    { timestamps: true })
const Booking = mongoose.model('Booking', bookSchema)

module.exports = Booking