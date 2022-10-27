const mongoose = require('mongoose')

const Schema = mongoose.Schema

const showSchema = new Schema({
    screenId: {
        type: Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },
    movieId: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },
    showTiming: {
        type: String,
        required: true,
        },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    },

},
    { timestamps: true })
const ShowTime = mongoose.model('ShowTime', showSchema)

module.exports = ShowTime