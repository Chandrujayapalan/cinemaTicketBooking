const mongoose = require('mongoose')
const Schema = mongoose.Schema
const theaterSchema = new Schema({
    theaterName: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status :{
        type : Boolean,
        default: true

    }
},
    { timestamps: true })
const Theater = mongoose.model('Theater', theaterSchema)

module.exports = Theater