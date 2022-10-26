const mongoose = require('mongoose')

const Schema = mongoose.Schema

const showSchema = new Schema({
    theaterId: {
        type: Schema.Types.ObjectId,
        ref: "Theater",
        required: true,
    },
    screenId: {
        type: Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },
    showStart: {
        type: Date,
        required: true,
        trim: true,
    },
    // seatId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Seat",
    //     required: true
    // },
    status: {
        type: Boolean,
        default: true
    },

},
    { timestamps: true })
const ShowTime = mongoose.model('ShowTime', showSchema)

module.exports = ShowTime