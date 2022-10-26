const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reserverSchema = new Schema({
    theaterId :{
        type: Schema.Types.ObjectId,
        ref: "Theater",
        required: true 
    },
    screenId: {
        type: Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },
    movieId: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
    },
    showTimeId: {
        type: Array,
        ref: "ShowTime",
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
const Reserver = mongoose.model('Reserver', reserverSchema)

module.exports = Reserver