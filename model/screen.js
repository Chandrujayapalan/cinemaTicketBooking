const mongoose = require('mongoose')

const Schema = mongoose.Schema

const screenSchema = new Schema({
    screenName: {
        type: String,
        required: true
    },
    theaterId: {
        type: Schema.Types.ObjectId,
        ref: "Theater",
        required: true,
    },
    seatId: {
        type: Schema.Types.ObjectId,
        ref: "Seat",
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },
},
    { timestamps: true })
const Screen = mongoose.model('Screen', screenSchema)
module.exports = Screen