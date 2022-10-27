const mongoose = require('mongoose')

const Schema = mongoose.Schema

const seatSchema = new Schema({
    screenId: {
        type: Schema.Types.ObjectId,
        ref: "Theater",
        required: true,
    },
    seatNo: {
        type: Number
    },
    // bookingId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Booking",
    //     required: true,
    // },
    showTimeId: {
        type: Schema.Types.ObjectId,
        ref: "ShowTime",
        required: true,
    },
    userId :{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })
const Seat = mongoose.model('Seat', seatSchema)

module.exports = Seat