const mongoose = require('mongoose')

const Schema = mongoose.Schema

const theaterSchema = new Schema({
    theaterName: {
        type: String,
        required: true
    },
        // reserverId: {
        //     type: Array,
        //     ref: "Reserver",
        //     required: true,
        // },
    // screenId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Screen",
    //     required: true,
    // },
    area: {
        type: String,
        required: true
    },
},
    { timestamps: true })
const Theater = mongoose.model('Theater', theaterSchema)

module.exports = Theater